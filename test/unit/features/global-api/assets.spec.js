import Blu from 'blu'

describe('Global API: assets', () => {
  const Test = Blu.extend()

  it('directive / filters', () => {
    const assets = ['directive', 'filter']
    assets.forEach(function (type) {
      const def = {}
      Test[type]('test', def)
      expect(Test.options[type + 's'].test).toBe(def)
      expect(Test[type]('test')).toBe(def)
      // extended registration should not pollute global
      expect(Blu.options[type + 's'].test).toBeUndefined()
    })
  })

  describe('Blu.component', () => {
    it('should register a component', () => {
      Blu.component('foo', {
        template: '<span>foo</span>'
      })
      Blu.component('bar', {
        template: '<span>bar</span>'
      })
      const vm = new Blu({
        template: '<div><foo></foo><bar></bar></div>'
      }).$mount()
      expect(vm.$el.innerHTML).toBe('<span>foo</span><span>bar</span>')
      // unregister them
      delete Blu.options.components.foo
      delete Blu.options.components.bar
    })
  })

  it('component on extended constructor', () => {
    const def = { a: 1 }
    Test.component('test', def)
    const component = Test.options.components.test
    expect(typeof component).toBe('function')
    expect(component.super).toBe(Blu)
    expect(component.options.a).toBe(1)
    expect(component.options.name).toBe('test')
    expect(Test.component('test')).toBe(component)
    // already extended
    Test.component('test2', component)
    expect(Test.component('test2')).toBe(component)
    // extended registration should not pollute global
    expect(Blu.options.components.test).toBeUndefined()
  })
})
