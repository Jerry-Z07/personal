# Project Debug Rules (Non-Obvious Only)

- `fetchBlogFeed` uses DOMParser and expects a browser DOM; Node tests must polyfill DOMParser (jsdom) or they will fail. See [`src/utils/api.js`](src/utils/api.js:151).
- API helpers log via console.error then rethrow Errors; hooks set error to err.message — inspect thrown Error.message when debugging. See [`src/utils/api.js`](src/utils/api.js:16) and [`src/hooks/useData.js`](src/hooks/useData.js:44).
- Network uses a CORS proxy (CORS_PROXY = 'https://cors1.078465.xyz/...'); if the proxy or uapis.cn endpoints are down feeds will silently fail — check network/proxy availability. See [`src/utils/api.js`](src/utils/api.js:103).
- USER_UID is hardcoded to '401175768'; changing it without validating uapis.cn responses causes empty/invalid feeds. See [`src/utils/api.js`](src/utils/api.js:10).
- Tailwind only scans "./index.html" and "./src/**/*.{js,ts,jsx,tsx}" — adding UI files outside these paths will result in missing styles during debug. See [`tailwind.config.js`](tailwind.config.js:1).
- Vite legacy plugin injects polyfills in build — runtime behavior may differ between dev server and production build; plugin order matters. See [`vite.config.js`](vite.config.js:7).
- No test runner configured: unit tests run in Node must polyfill global.fetch and DOMParser and stub network calls to avoid flaky network-dependent failures.
- When UI appears empty, check network requests and console.error first — most runtime failures surface as rethrown Errors logged by API helpers.