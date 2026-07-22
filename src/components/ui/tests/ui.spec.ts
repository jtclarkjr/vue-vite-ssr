import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import Button from '../Button.vue'
import Input from '../Input.vue'
import Spinner from '../Spinner.vue'

describe('UI primitives', () => {
  it('renders button variants and loading semantics', () => {
    const wrapper = mount(Button, {
      props: { loading: true, variant: 'secondary' },
      slots: { default: 'Save' },
    })
    expect(wrapper.classes()).toContain('ui-button--secondary')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes()).toHaveProperty('disabled')
  })

  it('connects input labels, help text, and invalid state', async () => {
    const wrapper = mount(Input, { props: { label: 'Email', error: 'Required' } })
    const input = wrapper.get('input')
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
    await input.setValue('user@example.com')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['user@example.com'])
  })

  it('gives non-decorative spinners a status role', () => {
    expect(mount(Spinner, { props: { label: 'Loading results' } }).attributes()).toMatchObject({
      role: 'status',
      'aria-label': 'Loading results',
    })
  })
})
