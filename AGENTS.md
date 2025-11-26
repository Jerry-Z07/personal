# AGENTS.md

This file provides guidance to agents when working with code in this repository.

- No test runner configured: no "test" script present in [`package.json`](package.json:6). To run unit tests you must add a test framework (Vitest/Jest) and remember to polyfill browser globals.
- Network/CORS specifics: USER_UID is hardcoded as '401175768' and a CORS proxy is used — see [`src/utils/api.js`](src/utils/api.js:10) and [`src/utils/api.js`](src/utils/api.js:103). If the proxy or uapis.cn endpoints are down, feeds will silently fail or throw.
- Browser-only APIs: [`src/utils/api.js`](src/utils/api.js:151) uses DOMParser (and code relies on global fetch). Tests/Node scripts must polyfill DOMParser + fetch (jsdom/node-fetch or undici global polyfill).
- Time units: [`formatPublishTime`](src/utils/api.js:82) expects a UNIX timestamp in seconds (it multiplies by 1000). Passing milliseconds yields wrong dates.
- Localization: [`formatPlayCount`](src/utils/api.js:59) returns Chinese unit '万' — UI strings are localized and not generic.
- ESLint quirk: rule 'no-unused-vars' ignores identifiers starting with uppercase or underscore (varsIgnorePattern: '^[A-Z_]') — do not rename leading-underscore helpers or uppercase-only variables expecting to be flagged; see [`eslint.config.js`](eslint.config.js:25).
- Vite build detail: project enables legacy builds (plugins ordered as react(), tailwindcss(), legacy()) — legacy builds add polyfills and increase bundle size; see [`vite.config.js`](vite.config.js:7).
- API response shapes: hooks in [`src/hooks/useData.js`](src/hooks/useData.js:33) tolerate multiple shapes ({data}, {code:0,data}, plain arrays). When mocking or changing APIs, match one of these shapes or update the hooks.
- Error handling pattern: API helpers log then throw (they rethrow Error). Hooks set error to err.message — when mocking, throw Error('message') so hooks surface the message correctly.
- Tailwind content paths are restricted to index+src (see [`tailwind.config.js`](tailwind.config.js:3-6)). Add new non-src HTML/JSX paths there to avoid missing styles.
- Critical gotcha: many utilities assume browser environment (document, DOMParser, fetch). Avoid invoking UI utilities from Node/CI without polyfills.
- Component conventions: existing components use .jsx files and default export/import patterns (see [`src/main.jsx`](src/main.jsx:1) and [`src/App.jsx`](src/App.jsx:1)); follow the same to avoid import/ESLint friction.