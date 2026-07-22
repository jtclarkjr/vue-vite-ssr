<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
    closeLabel?: string
  }>(),
  { size: 'md', closeLabel: 'Close dialog' },
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="ui-dialog__overlay" />
      <DialogContent class="ui-dialog" :class="`ui-dialog--${size}`">
        <header class="ui-dialog__header">
          <div>
            <DialogTitle class="ui-dialog__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="ui-dialog__description">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose as-child>
            <Button :aria-label="closeLabel" size="sm" variant="ghost">×</Button>
          </DialogClose>
        </header>
        <div class="ui-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" class="ui-dialog__footer"><slot name="footer" /></footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped lang="scss">
.ui-dialog__overlay {
  position: fixed;
  inset: 0;
  background: rgb(2 7 15 / 72%);
  backdrop-filter: blur(5px);

  &[data-state='open'] {
    animation: ui-dialog-overlay-in 200ms ease-out both;
  }

  &[data-state='closed'] {
    animation: ui-dialog-overlay-out 160ms ease-in both;
  }
}

.ui-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: calc(100% - 2rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  transform: translate(-50%, -50%);
  transform-origin: center;
  will-change: opacity, transform;

  &[data-state='open'] {
    animation: ui-dialog-content-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  &[data-state='closed'] {
    animation: ui-dialog-content-out 160ms ease-in both;
  }

  &--sm {
    max-width: 28rem;
  }

  &--md {
    max-width: 38rem;
  }

  &--lg {
    max-width: 54rem;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
  }

  &__title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
  }

  &__description {
    margin: var(--space-2) 0 0;
    color: var(--color-text-muted);
  }

  &__body {
    padding-block: var(--space-6);
    color: var(--color-text-muted);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
  }
}

@keyframes ui-dialog-overlay-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes ui-dialog-overlay-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes ui-dialog-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -47%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes ui-dialog-content-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-dialog,
  .ui-dialog__overlay {
    animation: none !important;
  }
}
</style>
