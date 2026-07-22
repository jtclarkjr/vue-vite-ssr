<template>
  <section class="content-page stack-lg">
    <p class="eyebrow">Architecture</p>
    <h1>Small pieces, explicit boundaries.</h1>
    <p>
      The starter keeps the server, application factory, API transport, pages, stores, and UI
      primitives independently replaceable. GraphQL is intentionally not installed; add it as an
      adapter only when a project needs it.
    </p>
    <Button :as="RouterLink" to="/" variant="secondary">Back home</Button>
  </section>
</template>
