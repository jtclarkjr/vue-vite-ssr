<script setup lang="ts">
import { Link as VoidLink } from '@void/vue'
</script>

<template>
  <section class="content-page stack-lg">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p>The requested route does not exist.</p>
    <Button :as="VoidLink" href="/">Return home</Button>
  </section>
</template>
