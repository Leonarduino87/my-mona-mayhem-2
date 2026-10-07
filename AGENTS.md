# Project Instructions

## Overview
Mona Mayhem is an Astro 6 app for a GitHub contribution battle arena. The app lives in `src/`; its current routes include the home page and a contribution API endpoint. It uses TypeScript, strict Astro settings, and the Node standalone adapter. The API endpoint `GET /api/contributions/[username]` proxies `https://github.com/{username}.contribs` server-side (fetch, error handling, and in-memory TTL cache live in `src/lib/github-contributions.ts`). Refer to [README.md](README.md) for the project overview and deployment notes.

Ignore `workshop/` when working on the app unless the user explicitly asks about workshop content.

## Commands
- `npm run dev` - start the local development server.
- `npm run build` - build the app.
- `npm run lint` - lint the app with ESLint.
- `npm run preview` - preview the production build.
- `npm run astro -- <command>` - run an Astro CLI command.

There is currently no test script in `package.json`.

## Astro Practices
- Keep route and page code in `src/pages/`; Astro file-based routing determines URLs.
- Use `.astro` components for server-rendered UI and keep client-side JavaScript limited to interactions that need it.
- For API routes, use Astro's `APIRoute` type and return standard `Response` objects. Set `prerender = false` for routes that require runtime handling.
- Preserve the server output and Node standalone adapter in `astro.config.mjs` unless deployment requirements change.
- Keep TypeScript compatible with the strict Astro configuration and validate changes with `npm run build`.

## Retro Arcade Design
- Keep the UI dark and arcade-inspired: use `#0a0a1a` for the page background, `#5fed83` neon green and `#8a2be2` purple as the primary accents, and readable light text on dark panels.
- Use the Google Font `Press Start 2P` for the retro game feel. Keep small text legible and preserve responsive layouts at narrow viewport widths.
- Use restrained neon effects and playful motion: CRT scanlines, a softly pulsing and electrically flickering title, a gradient-pulsing VS badge, shimmer on result cards, float-in inputs, green/purple loading text, and green glow on contribution cells when hovered.
- Respect `prefers-reduced-motion` by disabling decorative animations and transitions when requested.
