<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">Vue Vite+ SSR</RouterLink>
      <nav aria-label="Primary navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main class="page-shell">
      <RouterView />
    </main>
  </div>
</template>
