<script setup lang="ts">
const model = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'url'
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { type: 'text', disabled: false, required: false },
)

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
</script>

<template>
  <label class="ui-input" :for="inputId">
    <span v-if="label" class="ui-input__label">{{ label }}</span>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="descriptionId"
    />
    <span v-if="help || error" :id="descriptionId" :class="{ 'ui-input__error': error }">
      {{ error ?? help }}
    </span>
  </label>
</template>

<style scoped lang="scss">
.ui-input {
  display: grid;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.875rem;

  input {
    width: 100%;
    min-height: 2.65rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
    color: var(--color-text);

    &:focus-visible {
      border-color: var(--color-primary);
      outline: 2px solid rgb(116 224 193 / 20%);
    }
  }

  &__label {
    color: var(--color-text);
    font-weight: 700;
  }

  &__error {
    color: var(--color-danger);
  }
}
</style>
