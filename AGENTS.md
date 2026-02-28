# Repository Guidelines

## Project Structure & Module Organization
- `src/main.jsx` boots the app, router, and lazy-load flow.
- `src/components/` contains reusable UI blocks (for example `BentoCard.jsx`, `Modal.jsx`).
- `src/hooks/useData.js` holds data-fetching hooks for Bilibili and blog feeds.
- `src/utils/api.js` centralizes API calls, RSS parsing, and display format helpers.
- `public/` stores static assets; `dist/` is build output (do not edit directly).
- `.github/workflows/` contains automation such as Dependabot auto-merge.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start Vite dev server with HMR.
- `npm run build`: create production bundle in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint checks across the project.
- Optional quality tools: `qlty check` and `qlty fmt` for extra lint/format review.

## Coding Style & Naming Conventions
- Use React function components and hooks.
- Component files use `PascalCase.jsx`; hooks use `useXxx.js`; utilities use descriptive `camelCase` exports.
- Keep imports grouped: external packages first, then local modules.
- Follow the existing file style (quotes/semicolon usage may differ by file) and rely on `npm run lint` before committing.
- ESLint note: `no-unused-vars` ignores names beginning with uppercase letters or `_`.

## Testing Guidelines
- No test runner is currently configured (`package.json` has no `test` script).
- Minimum validation before PR: `npm run lint && npm run build`.
- For UI/data changes, include manual verification steps in PR (desktop + mobile, API error path).
- If adding tests, prefer Vitest + React Testing Library under `src/__tests__/` with `*.test.jsx` naming.
- Browser API reminder: mock/polyfill `fetch` and `DOMParser` for any Node-based tests.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history, e.g. `chore(deps): bump react-router...`.
- Recommended format: `type(scope): short imperative summary` (`feat`, `fix`, `chore`, `docs`, `refactor`).
- PRs should include: purpose, key changes, validation steps, linked issue, and screenshots for UI updates.
- Keep PRs focused and small; avoid mixing unrelated refactors.
- Dependabot patch/minor dependency PRs may be auto-approved/auto-merged by workflow.

## Security & Configuration Notes
- `src/utils/api.js` hardcodes `USER_UID` and uses a CORS proxy; verify both dev/prod request paths when changing API logic.
- `formatPublishTime` expects Unix timestamps in seconds (not milliseconds).
- Never commit secrets; keep environment-specific values in `.env` only.
