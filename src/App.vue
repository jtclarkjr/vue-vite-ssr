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

<style scoped lang="scss">
.app-shell {
  width: min(76rem, calc(100% - 2rem));
  margin-inline: auto;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-6);
  border-bottom: 1px solid var(--color-border);

  nav {
    display: flex;
    gap: var(--space-4);
  }

  a {
    color: var(--color-text-muted);
    text-decoration: none;

    &:hover,
    &.router-link-active {
      color: var(--color-text);
    }
  }

  .brand {
    color: var(--color-text);
    font-weight: 800;
  }
}

.page-shell {
  padding-block: clamp(4rem, 10vw, 8rem);
}

@media (max-width: 40rem) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-3);
  }
}
</style>
