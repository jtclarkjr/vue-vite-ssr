<route lang="json">
{
  "meta": { "status": 404 }
}
</route>

<template>
  <section class="content-page stack-lg">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p>The requested route does not exist.</p>
    <Button :as="RouterLink" to="/">Return home</Button>
  </section>
</template>
