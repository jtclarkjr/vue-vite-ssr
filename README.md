# Vue Vite+ SSR

A Vue 3 full-stack starter using Void Pages, Vite+, Bun, and Cloudflare Workers. Void owns
server-rendered pages, hydration, typed API routes, and the D1 database. Vite+ provides development,
checks, tests, and production builds.

## Start here

Use Node.js 24.21 or newer and Bun 1.3.14.

```sh
vp install
cp void.config.example.ts void.config.ts
vp run prepare
vp dev
```

Open `http://localhost:5173`. Development runs the app in the local Workers runtime with Vite HMR
and a local D1 database. No Cloudflare credentials are needed for this starter's local features.

Run `vp run prepare` after a fresh clone or dependency installation: install scripts are disabled
in `bunfig.toml`, and the command generates the ignored `.void` types before checks run. Development
and builds also refresh these types.

## Commands

```sh
vp dev                    # Void Pages and API development with HMR
vp run prepare            # Vite+ setup and generated Void types
vp check                  # format, lint, and type-check
vp test run               # unit tests
vp run build              # checks, tests, and the production build
vp run build:ssr          # production build without the checks
vp run preview:ssr        # build and preview locally in the Workers runtime
```

The production output is a Cloudflare Worker and client assets in `dist/`. Preview uses the same
Workers integration; production deployment uses Void's Cloudflare deploy command.

## Architecture

- `pages/` contains Void Pages Vue components. `pages/layout.vue` provides the shared shell;
  companion `.server.ts` files load data and supply typed props to pages.
- `routes/api/` contains method-specific Void handlers. `GET /api/health` reports service health,
  `GET /api/example` supplies the starter data, and `GET /api/posts` demonstrates a typed D1 query.
- `db/schema.ts` defines the posts table with Drizzle. `db/migrations/` contains the initial SQL
  migration and its history. Void applies migrations locally and during deployment.
- `src/components`, `src/composables`, and `src/assets/styles` hold reusable UI code. Vue APIs,
  composables, and components are auto-imported with generated declarations.
- `void.config.example.ts` is the shareable configuration template. Copy it to the ignored
  `void.config.ts` for your app's private Cloudflare settings. The ignored `void.lock.json`
  records resolved resources and deployment history.

Page data comes from request-scoped server loaders. Void's Vue adapter renders and hydrates the
pages. For browser API requests, import the typed `fetch` from `void/client`; handler return types
flow into its response types through the generated `.void` declarations.

## UI conventions

Design tokens live in `src/assets/styles/_tokens.scss` and map onto the component library's public
`--clv-*` custom properties. The starter auto-imports Button, Dialog, Input, Card, and Spinner from
[`@jtclarkjr/component-library-vue`](https://github.com/jtclarkjr/component-library-vue), which owns
their accessible behavior, visual styling, stories, and component-level tests.

## Environment variables

No environment variables are required for local development. Void supports one local dotenv file,
`.env`, which is ignored by Git. Files such as `.env.example`, `.env.local`, `.env.production`, and
`.dev.vars` are rejected by Void.

When adding configuration, declare its schema in root `env.ts` and read values through `void/env`.
Set production server values with `vp exec void secret put NAME`. Local `.env` values are never
uploaded by deployment; public `VITE_*` values must come from the production build environment.

## Deploy to Cloudflare

The real `void.config.ts`, `void.lock.json`, generated Cloudflare config, and `.void/` directory
stay out of Git. The example contains no account-specific identifiers or tokens. Edit your local
config's Worker name and supply the account ID through the shell when using the example:

```sh
CLOUDFLARE_ACCOUNT_ID=your-account-id vp exec void deploy --platform cloudflare
```

Void builds the Worker, provisions D1, applies committed migrations, checks readiness, and activates
the deployment. Void generates the real lock automatically; an example lock is unnecessary. Keep a
private backup of the real config and lock, and restore them before deploying an existing app from
another machine. Reusing the lock preserves the existing resource IDs and deployment history.
For later schema changes, run `vp exec void db generate` and commit the generated SQL migration.

The GitHub Actions workflow restores the private files, prepares types, runs checks and tests, and
deploys pushes to `main`. Configure these repository secrets:

- `VOID_CONFIG_TS`: the complete contents of your private `void.config.ts`. If the config reads
  `process.env.CLOUDFLARE_ACCOUNT_ID`, also set that repository secret.
- `VOID_LOCK_JSON`: the complete contents of your real `void.lock.json` after the first local
  deployment. Refresh this secret when deployment changes the lock.
- `CLOUDFLARE_API_TOKEN`: a scoped token with Workers Scripts edit access and access to read and
  provision D1.

The workflow writes the private files without logging their contents. If Worker version URLs are
unavailable, also set the repository variable
`CLOUDFLARE_WORKERS_SUBDOMAIN` to the account's Workers subdomain. Access-protected readiness URLs
additionally need the `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` repository secrets.

Read the version-matched Void documentation in `node_modules/void/docs/`, starting with
`guide/quickstart.md` and `guide/deployment.md`.
