# Vue Vite+ SSR

A reusable Vue 3 full-stack starter with Nitro, Vite+, Bun, typed file routing, Pinia hydration, a
typed `fetch` client, auto-imports, automatic components, OXC checks, and Docker.

The boundary is explicit: Nitro owns HTTP and API concerns, Vue owns UI rendering and application
state, and Vite+ owns development, checks, tests, and builds. Bun remains the package manager and
the production runtime for Nitro's unified output.

## Start here

```sh
vp install
vp dev
```

The Nitro development server runs at `http://localhost:5173` with Vite HMR.

## Commands

```sh
vp dev                    # Nitro and Vue SSR development with HMR
vp test                   # unit tests
vp check                  # format, lint, and type-check
vp run build:ssr          # unified Nitro production build
vp run preview:ssr        # build and start the production Bun server
```

Production runs the Bun preset artifact directly:

```sh
bun run .output/server/index.mjs
```

## Architecture

- `nitro.config.ts` configures the Nitro v3 server directory and Bun deployment preset.
- `server/api` contains method-specific Nitro routes. Add same-origin REST endpoints here.
- `src/entry-server.ts` is Nitro's default Vite SSR service. It renders unmatched requests with a
  fresh Vue application and uses Nitro's in-process fetch for same-origin API calls.
- `src/app.ts` creates Vue, Router, Pinia, and API client instances once per SSR request. The
  browser creates its own instances for hydration.
- `src/entry-client.ts` restores serialized Pinia state before hydration.
- `src/api/client.ts` remains the browser-facing typed request boundary, with JSON handling,
  cancellation, and `ApiError`.
- `@jtclarkjr/component-library-vue` supplies the themeable UI primitives and their public
  Storybook catalogue; the app resolves the starter component set through
  `unplugin-vue-components`.
- `src/pages` becomes typed routes through `unplugin-vue-router`; Vue, Router, Pinia, composables,
  stores, and components are auto-imported with generated declarations.

Pinia state embedded in HTML is serialized with `devalue`, including safe handling of closing
script sequences. Router, store, and API instances are never shared between SSR requests.

## API boundary

`GET /api/health` reports service health. `GET /api/example` demonstrates a typed Nitro response
used during SSR and in the browser. Unknown routes, thrown route errors, request logging, and error
response bodies use Nitro's defaults.

The default dependency tree includes no GraphQL client. Projects that need GraphQL can add a Nitro
route or adapter while leaving the injected `useApi()` application boundary intact.

## UI conventions

Design tokens live in `src/assets/styles/_tokens.scss` and map onto the component library's public
`--clv-*` custom properties. The starter auto-imports Button, Dialog, Input, Card, and Spinner from
[`@jtclarkjr/component-library-vue`](https://github.com/jtclarkjr/component-library-vue), which owns
their accessible behavior, visual styling, stories, and component-level tests.

## Docker

```sh
docker compose up --build
```

The multi-stage image builds Nitro's `.output` artifact with Vite+ and runs it as the non-root Bun
user. The container health check calls `GET /api/health`; the default host port is `8080` and can be
overridden with `PORT`.
