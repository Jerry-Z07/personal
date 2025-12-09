# Project Coding Rules (Non-Obvious Only)

- Tests: no test runner configured in root; any unit tests must polyfill browser globals (global.fetch, DOMParser) when run under Node. See [`src/utils/api.js`](src/utils/api.js:151).
- API shapes: helpers may return {data}, {code:0,data} or plain arrays — hooks in [`src/hooks/useData.js`](src/hooks/useData.js:33) tolerate these; mock responses to match one of these shapes.
- Error handling: API helpers log and rethrow Error objects; ensure mocks/implementations throw Error('message') so hooks read err.message. See [`src/utils/api.js`](src/utils/api.js:16).
- CORS & UID: USER_UID is hardcoded to '401175768' and a CORS proxy is used — changing endpoints/UID or proxy without validating availability will break feeds. See [`src/utils/api.js`](src/utils/api.js:10) and [`src/utils/api.js`](src/utils/api.js:103).
- DOM dependency: `fetchBlogFeed` uses DOMParser and expects browser DOM — do NOT call it from Node tests without a DOM polyfill. See [`src/utils/api.js`](src/utils/api.js:151).
- Tailwind paths: tailwind only scans "./index.html" and "./src/**/*.{js,ts,jsx,tsx}" — add paths in [`tailwind.config.js`](tailwind.config.js:1) if you introduce non-src UI files.
- ESLint quirk: 'no-unused-vars' is configured with varsIgnorePattern '^[A-Z_]' — renaming helpers that start with _ or uppercase can bypass warnings/errors. See [`eslint.config.js`](eslint.config.js:25).
- Vite legacy plugin: legacy() is enabled after react()/tailwindcss() — it injects polyfills and increases bundle size; plugin order matters. See [`vite.config.js`](vite.config.js:7).
- Localization gotcha: `formatPlayCount` returns Chinese unit '万' — UI strings are localized; don't blindly normalize to english units. See [`src/utils/api.js`](src/utils/api.js:59).