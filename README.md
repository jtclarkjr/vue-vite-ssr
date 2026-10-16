# Vue Vite+ SSR

A reusable Vue 3 boilerplate with Vite+, Bun SSR, typed file routing, Pinia hydration, a typed
`fetch` client, auto-imports, automatic components, Storybook, OXC checks, and Docker.

## Dependencies

- [Vite+](https://viteplus.dev) provides the unified `vp` toolchain used for installation,
  development, checks, tests, and builds.
- [Bun](https://bun.sh) is the package manager and JavaScript runtime used by the SSR server.

## Nitro branch

The [`nitro` branch](https://github.com/jtclarkjr/vue-vite-ssr/tree/nitro) uses Nitro for the server
and includes usage of
[`@jtclarkjr/component-library-vue`](https://github.com/jtclarkjr/component-library-vue).

## Void branch

The [`void` branch](https://github.com/jtclarkjr/vue-vite-ssr/tree/void) uses Void Pages for Vue SSR
and hydration, typed API routes, and a D1 SQLite database on Cloudflare Workers. It also uses
[`@jtclarkjr/component-library-vue`](https://github.com/jtclarkjr/component-library-vue).

Use Node.js 24.21 or newer and Bun 1.3.14. From a clone of this repository:

```sh
git switch void
vp install
cp void.config.example.ts void.config.ts
vp run prepare
vp dev
```

Local development runs at `http://localhost:5173` with a local Workers runtime and D1 database;
Cloudflare credentials are not required locally. Before deploying, set your Worker name in the
local config and supply your Cloudflare account ID:

```sh
CLOUDFLARE_ACCOUNT_ID=your-account-id vp exec void deploy --platform cloudflare
```

Keep the real `void.config.ts` and generated `void.lock.json` private; both are ignored by Git.
Restore the existing app's real lock when deploying from another machine to preserve resource
IDs and deployment history.

For GitHub Actions deployment, configure the repository secrets `VOID_CONFIG_TS`, `VOID_LOCK_JSON`,
and `CLOUDFLARE_API_TOKEN`, plus `CLOUDFLARE_ACCOUNT_ID` when using the example config. See the
[Void branch deployment instructions](https://github.com/jtclarkjr/vue-vite-ssr/tree/void#deploy-to-cloudflare)
for secret contents and optional Cloudflare settings.

## Start here

```sh
vp install
vp dev
```

The SSR development server runs at `http://localhost:5173` with Vite HMR. Use `vp run dev:spa`
only when you specifically want to debug the client without SSR.

## Commands

```sh
vp dev                    # SSR development with HMR
vp run dev:spa            # optional SPA-only mode
vp test run               # unit tests
vp check                  # format, lint, and type-check
vp run build:ssr          # client and server production bundles
vp run preview:ssr        # build and start the production Bun server
vp run storybook          # component workbench on port 6006
vp run build-storybook    # static Storybook build
vp run test:storybook     # browser-based story tests
```

## Architecture

- `src/app.ts` creates Vue, Router, Pinia, and API client instances. SSR calls it once per request;
  the browser calls it once for hydration.
- `src/entry-server.ts` resolves the typed file route, runs SSR hooks, and returns HTML plus Pinia
  state. `src/entry-client.ts` restores that state before hydration.
- `server/api.ts` is shared by development and production. Add same-origin REST endpoints here.
- `src/api/client.ts` provides typed request methods, JSON handling, cancellation, and `ApiError`.
- `src/components/ui` contains themeable primitives. Props model variants and state; slots model
  composition. Storybook is their public catalogue.
- `src/pages` is converted to typed routes by `unplugin-vue-router`; Vue, Router, Pinia,
  composables, stores, and components are auto-imported with generated declaration files.

Pinia state embedded in HTML is serialized with `devalue`, avoiding executable values and escaped
closing-script sequences. Router, store, and API instances are never shared between SSR requests.

## API and GraphQL

The default dependency tree is transport-neutral and includes no GraphQL client. Build REST-style
handlers in `server/api.ts` and call them through the injected `useApi()` client. If a project needs
GraphQL, add a small adapter behind the same application boundary rather than coupling the starter
to Apollo.

## UI conventions

Design tokens live in `src/assets/styles/_tokens.scss`. Reka UI supplies accessible behavior for
composite widgets such as dialogs, while the project owns all visual styling. The starter includes
Button, Dialog, Input, Card, and Spinner primitives with stories and tests.

## Docker

```sh
docker compose up --build
```

The multi-stage image builds with Vite+ and runs as the non-root Bun user. The container health
check calls `GET /api/health`; the default host port is `8080` and can be overridden with `PORT`.
