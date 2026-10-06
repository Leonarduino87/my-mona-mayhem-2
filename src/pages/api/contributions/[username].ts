import type { APIRoute } from 'astro';
import { getContributions, isValidUsername } from '../../../lib/github-contributions';

export const prerender = false;

const SUCCESS_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const NOT_FOUND_CACHE_CONTROL = 'public, max-age=300';

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
	});
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username ?? '';

	if (!isValidUsername(username)) {
		return json({ error: 'Invalid GitHub username' }, 400, { 'Cache-Control': 'no-store' });
	}

	const result = await getContributions(username);

	if (result.ok) {
		return json(result.data, 200, { 'Cache-Control': SUCCESS_CACHE_CONTROL, 'X-Cache': result.cache });
	}

	const headers: Record<string, string> = {
		'Cache-Control': result.status === 404 ? NOT_FOUND_CACHE_CONTROL : 'no-store',
		'X-Cache': result.cache,
	};
	if (result.retryAfter) {
		headers['Retry-After'] = result.retryAfter;
	}
	return json({ error: result.error }, result.status, headers);
};
