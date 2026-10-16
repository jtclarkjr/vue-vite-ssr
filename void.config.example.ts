import { defineConfig } from 'void/config'

export default defineConfig({
  target: 'cloudflare',
  worker: {
    compatibility_date: '2026-02-24',
    compatibility_flags: ['nodejs_compat'],
  },
  cloudflare: {
    name: 'vue-vite-ssr',
    // Optional for local development; supply your account when deploying.
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  },
  head: {
    title: 'Vue Vite+ SSR',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'description', content: 'A Vue, Void, and Vite+ starter for Cloudflare Workers.' },
    ],
  },
})
