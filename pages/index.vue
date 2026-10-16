<script setup lang="ts">
import type { Props } from './index.server'

const props = defineProps<Props>()
const dialogOpen = ref(false)
</script>

<template>
  <section class="hero stack-lg">
    <p class="eyebrow">Production-minded starter</p>
    <h1>Vue SSR with Void.</h1>
    <p class="hero-copy">
      Void owns HTTP, API routes, and server data loading. Vue renders the interface, and Vite+ owns
      the toolchain. The app deploys to Cloudflare Workers.
    </p>
    <div class="cluster">
      <Button @click="dialogOpen = true">Open dialog</Button>
      <Button as="a" href="https://viteplus.dev" target="_blank" variant="secondary">
        Vite+ documentation
      </Button>
    </div>
  </section>

  <section class="feature-grid" aria-label="Starter capabilities">
    <Card title="Server rendering" variant="accent">
      Void loads typed page props, renders Vue on the server, and hydrates the page in the browser.
    </Card>
    <Card title="Typed fetch client">
      <template #default>
        <p>{{ props.example.message }}</p>
      </template>
      <template #footer>
        API status: <strong>{{ props.health.status }}</strong>
      </template>
    </Card>
    <Card title="Composable UI">
      Props define meaningful variants; slots compose content and structure without duplicating
      behavior.
    </Card>
  </section>

  <Dialog
    v-model:open="dialogOpen"
    title="Accessible by default"
    description="Focus, keyboard navigation, and screen-reader semantics come from Reka UI."
  >
    <p>The visual layer stays completely themeable through SCSS and CSS custom properties.</p>
    <template #footer>
      <Button variant="secondary" @click="dialogOpen = false">Close</Button>
    </template>
  </Dialog>
</template>
