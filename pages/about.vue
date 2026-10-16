<script setup lang="ts">
import { Link as VoidLink } from '@void/vue'
</script>

<template>
  <section class="content-page stack-lg">
    <p class="eyebrow">Architecture</p>
    <h1>Small pieces, explicit boundaries.</h1>
    <p>
      Void owns HTTP, API routes, and page data. Vue owns the interface, and Vite+ owns development,
      checks, tests, and builds. Cloudflare Workers runs the application.
    </p>
    <Button :as="VoidLink" href="/" variant="secondary">Back home</Button>
  </section>
</template>
