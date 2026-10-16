<script setup lang="ts">
import { Link as VoidLink, useRouter } from '@void/vue'

import '@/assets/styles/main.scss'

const router = useRouter()
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <VoidLink class="brand" href="/">Vue Vite+ SSR</VoidLink>
      <nav aria-label="Primary navigation">
        <VoidLink href="/" :aria-current="router.path === '/' ? 'page' : undefined">Home</VoidLink>
        <VoidLink href="/about" :aria-current="router.path === '/about' ? 'page' : undefined">
          About
        </VoidLink>
      </nav>
    </header>

    <main class="page-shell">
      <slot />
    </main>
  </div>
</template>
