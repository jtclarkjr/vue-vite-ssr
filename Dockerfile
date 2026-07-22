# syntax=docker/dockerfile:1

ARG VP_VERSION=0.2.5
ARG BUN_VERSION=1.3.14

FROM ghcr.io/voidzero-dev/vite-plus:${VP_VERSION} AS build
WORKDIR /app
COPY --chown=vp:vp bun.lock package.json ./
RUN vp install --frozen-lockfile
COPY --chown=vp:vp . .
RUN vp run build:ssr

FROM oven/bun:${BUN_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/.output ./.output
USER bun
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD ["bun", "-e", "const r=await fetch('http://127.0.0.1:8080/api/health');process.exit(r.ok?0:1)"]
CMD ["bun", "run", ".output/server/index.mjs"]
