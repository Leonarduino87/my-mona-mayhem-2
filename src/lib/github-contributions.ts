const UPSTREAM_BASE_URL = 'https://github.com';
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const FETCH_TIMEOUT_MS = 8_000;
const SUCCESS_TTL_MS = 60 * 60 * 1000;
const NOT_FOUND_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

export type ContributionData = Record<string, unknown> & { weeks: unknown[] };

export type CacheStatus = 'HIT' | 'MISS' | 'STALE';

export type ContributionResult =
	| { ok: true; data: ContributionData; cache: CacheStatus }
	| { ok: false; status: number; error: string; cache: CacheStatus; retryAfter?: string };

type CacheEntry =
	| { kind: 'data'; data: ContributionData; expiresAt: number }
	| { kind: 'not-found'; expiresAt: number };

type UpstreamResult =
	| { kind: 'data'; data: ContributionData }
	| { kind: 'not-found' }
	| { kind: 'error'; status: number; error: string; retryAfter?: string };

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<UpstreamResult>>();

export function isValidUsername(username: string): boolean {
	return USERNAME_PATTERN.test(username);
}

function setCacheEntry(key: string, entry: CacheEntry): void {
	cache.delete(key);
	cache.set(key, entry);
	while (cache.size > MAX_CACHE_ENTRIES) {
		const oldestKey = cache.keys().next().value;
		if (oldestKey === undefined) break;
		cache.delete(oldestKey);
	}
}

function isContributionData(value: unknown): value is ContributionData {
	return typeof value === 'object'
		&& value !== null
		&& Array.isArray((value as { weeks?: unknown }).weeks);
}

async function fetchUpstream(username: string): Promise<UpstreamResult> {
	let response: Response;
	try {
		response = await fetch(`${UPSTREAM_BASE_URL}/${encodeURIComponent(username)}.contribs`, {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'mona-mayhem-contributions-proxy',
			},
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			console.error(`[contributions] Upstream timeout for "${username}"`);
			return { kind: 'error', status: 504, error: 'Upstream request timed out' };
		}
		console.error(`[contributions] Network error for "${username}":`, error);
		return { kind: 'error', status: 502, error: 'Failed to reach GitHub' };
	}

	if (response.status === 404) {
		return { kind: 'not-found' };
	}

	if (response.status === 429 || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')) {
		return {
			kind: 'error',
			status: 429,
			error: 'Rate limited by GitHub, try again later',
			retryAfter: response.headers.get('retry-after') ?? undefined,
		};
	}

	if (!response.ok) {
		console.error(`[contributions] Upstream status ${response.status} for "${username}"`);
		return { kind: 'error', status: 502, error: 'Unexpected response from GitHub' };
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch (error) {
		console.error(`[contributions] Invalid JSON for "${username}":`, error);
		return { kind: 'error', status: 502, error: 'Invalid response from GitHub' };
	}

	if (!isContributionData(body)) {
		console.error(`[contributions] Unexpected payload shape for "${username}"`);
		return { kind: 'error', status: 502, error: 'Invalid response from GitHub' };
	}

	return { kind: 'data', data: body };
}

export async function getContributions(username: string): Promise<ContributionResult> {
	const key = username.toLowerCase();
	const cached = cache.get(key);

	if (cached && cached.expiresAt > Date.now()) {
		return cached.kind === 'data'
			? { ok: true, data: cached.data, cache: 'HIT' }
			: { ok: false, status: 404, error: 'User not found', cache: 'HIT' };
	}

	let pending = inFlight.get(key);
	if (!pending) {
		pending = fetchUpstream(username).finally(() => inFlight.delete(key));
		inFlight.set(key, pending);
	}
	const result = await pending;

	switch (result.kind) {
		case 'data':
			setCacheEntry(key, { kind: 'data', data: result.data, expiresAt: Date.now() + SUCCESS_TTL_MS });
			return { ok: true, data: result.data, cache: 'MISS' };
		case 'not-found':
			setCacheEntry(key, { kind: 'not-found', expiresAt: Date.now() + NOT_FOUND_TTL_MS });
			return { ok: false, status: 404, error: 'User not found', cache: 'MISS' };
		case 'error':
		// Serve expired data rather than failing when GitHub is unavailable.
			if (cached?.kind === 'data') {
				return { ok: true, data: cached.data, cache: 'STALE' };
			}
			return { ok: false, status: result.status, error: result.error, cache: 'MISS', retryAfter: result.retryAfter };
	}
}
