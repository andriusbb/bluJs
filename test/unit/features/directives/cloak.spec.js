import Blu from 'blu'

describe('Directive v-cloak', () => {
  it('should be removed after compile', () => {
    const el = document.createElement('div')
    el.setAttribute('v-cloak', '')
    const vm = new Blu({ el })
    expect(vm.$el.hasAttribute('v-cloak')).toBe(false)
  })
})
