# Project Architecture Rules (Non-Obvious Only)

- Hooks ↔ API coupling: hooks in [`src/hooks/useData.js`](src/hooks/useData.js:1) expect API helpers to return either {data}, {code:0,data} or plain arrays; changing shapes breaks consumers.
- API helpers log then rethrow Error('message'); UI relies on err.message — don't change to return non-Error objects. See [`src/utils/api.js`](src/utils/api.js:16).
- DOM-only parsing: `fetchBlogFeed` uses DOMParser and global fetch; server-side tasks must polyfill both or run in a browser environment. See [`src/utils/api.js`](src/utils/api.js:151).
- Hardcoded UID & CORS proxy: USER_UID '401175768' and CORS_PROXY are baked into API URLs — replace both consistently and validate availability before deploying. See [`src/utils/api.js`](src/utils/api.js:10).
- Tailwind scan paths limited to "./index.html" and "./src/**/*.{js,ts,jsx,tsx}" — placing UI files elsewhere will silently drop styles (see [`tailwind.config.js`](tailwind.config.js:3)).
- Vite legacy plugin order affects runtime (polyfills injected only in build) — dev vs prod behavior may differ; plugin order is [react(), tailwindcss(), legacy()]. See [`vite.config.js`](vite.config.js:7).
- Time unit gotcha: `formatPublishTime` expects a UNIX timestamp in seconds (it multiplies by 1000). Passing milliseconds yields wrong dates. See [`src/utils/api.js`](src/utils/api.js:82).