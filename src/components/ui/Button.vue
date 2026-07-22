<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: PrimitiveProps['as']
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <Primitive
    :as="as"
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :aria-busy="loading || undefined"
    :disabled="as === 'button' ? disabled || loading : undefined"
    :type="as === 'button' ? type : undefined"
  >
    <Spinner v-if="loading" decorative size="sm" />
    <slot />
  </Primitive>
</template>

<style scoped lang="scss">
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: 140ms ease;

  &:focus-visible {
    outline: 3px solid rgb(116 224 193 / 35%);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &--sm {
    min-height: 2rem;
    padding: 0.45rem 0.7rem;
    font-size: 0.82rem;
  }

  &--md {
    min-height: 2.65rem;
    padding: 0.7rem 1rem;
  }

  &--lg {
    min-height: 3.2rem;
    padding: 0.9rem 1.3rem;
    font-size: 1.08rem;
  }

  &--primary {
    background: var(--color-primary);
    color: #06231b;

    &:hover {
      background: #98ecd5;
    }
  }

  &--secondary {
    border-color: var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);

    &:hover {
      background: var(--color-surface-raised);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-text-muted);

    &:hover {
      background: rgb(255 255 255 / 7%);
      color: var(--color-text);
    }
  }

  &--danger {
    background: var(--color-danger);
    color: #2c0710;
  }
}
</style>
