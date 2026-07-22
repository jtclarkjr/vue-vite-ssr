<template>
  <section class="content-page stack-lg">
    <p class="eyebrow">Architecture</p>
    <h1>Small pieces, explicit boundaries.</h1>
    <p>
      Nitro owns HTTP and API concerns, Vue owns UI rendering and application state, and Vite+ owns
      development, checks, tests, and builds.
    </p>
    <Button :as="RouterLink" to="/" variant="secondary">Back home</Button>
  </section>
</template>
