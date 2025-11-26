# Project Documentation Rules (Non-Obvious Only)

- Canonical API behavior lives in [`src/utils/api.js`](src/utils/api.js:16) — read it before changing consumers; it uses a hardcoded USER_UID ([`src/utils/api.js`](src/utils/api.js:10)) and a CORS proxy ([`src/utils/api.js`](src/utils/api.js:103)).
- RSS parsing specifics: `fetchBlogFeed` prefers RSS <item> then Atom <entry> and uses `DOMParser` — see [`src/utils/api.js`](src/utils/api.js:151). Tests or scripts that parse feeds must replicate this behavior.
- Consumers expect multiple API shapes — check [`src/hooks/useData.js`](src/hooks/useData.js:33) for tolerated shapes ({data}, {code:0,data}, plain arrays) before mocking or modifying endpoints.
- Tailwind scans only "./index.html" and "./src/**/*.{js,ts,jsx,tsx}" — add new UI files to [`tailwind.config.js`](tailwind.config.js:3) if outside these paths.
- No test runner configured in root — see [`package.json`](package.json:6). Documentation or examples referencing "npm test" are outdated.
- Component conventions: files use `.jsx` default exports; prefer that pattern for new components to avoid ESLint/import friction (see [`src/main.jsx`](src/main.jsx:1) and [`src/App.jsx`](src/App.jsx:1)).