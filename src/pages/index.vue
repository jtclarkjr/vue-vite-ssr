<script setup lang="ts">
import type { ExampleResponse, HealthResponse } from '@/api/types'
import { useApi } from '@/api/client'

const api = useApi()
const example = useExampleStore()
const dialogOpen = ref(false)
const health = ref<HealthResponse>()

async function loadExample() {
  if (example.status !== 'idle') return
  example.start()
  try {
    const [exampleResponse, healthResponse] = await Promise.all([
      api.get<ExampleResponse>('/api/example'),
      api.get<HealthResponse>('/api/health'),
    ])
    example.succeed(exampleResponse)
    health.value = healthResponse
  } catch (error) {
    example.fail(error)
  }
}

onServerPrefetch(loadExample)
onMounted(loadExample)
</script>

<template>
  <section class="hero stack-lg">
    <p class="eyebrow">Production-minded starter</p>
    <h1>Vue SSR with a Nitro server.</h1>
    <p class="hero-copy">
      Nitro owns HTTP and API concerns, Vue owns UI rendering, and Vite+ owns the toolchain. Bun
      runs the unified production output.
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
      Nitro delegates page requests to a fresh Vue router, Pinia store, and API client.
    </Card>
    <Card title="Typed fetch client">
      <template #default>
        <Spinner v-if="example.status === 'loading'" label="Loading API example" />
        <p v-else-if="example.data">{{ example.data.message }}</p>
        <p v-else-if="example.error" role="alert">{{ example.error }}</p>
      </template>
      <template #footer>
        API status: <strong>{{ health?.status ?? example.status }}</strong>
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

<style scoped lang="scss">
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--space-4);
  margin-top: clamp(4rem, 9vw, 7rem);
}
</style>
