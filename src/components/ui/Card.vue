<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    variant?: 'default' | 'accent' | 'subtle'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <article class="ui-card" :class="`ui-card--${variant}`">
    <header v-if="title || $slots.header" class="ui-card__header">
      <slot name="header"
        ><h2>{{ title }}</h2></slot
      >
    </header>
    <div class="ui-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="ui-card__footer"><slot name="footer" /></footer>
  </article>
</template>

<style scoped lang="scss">
.ui-card {
  display: flex;
  min-height: 15rem;
  flex-direction: column;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);

  &--accent {
    border-color: rgb(116 224 193 / 60%);
  }

  &--subtle {
    background: rgb(255 255 255 / 3%);
  }

  &__header h2 {
    margin-bottom: var(--space-4);
    font-size: 1.2rem;
  }

  &__body {
    color: var(--color-text-muted);
  }

  &__footer {
    margin-top: auto;
    padding-top: var(--space-6);
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
}
</style>
