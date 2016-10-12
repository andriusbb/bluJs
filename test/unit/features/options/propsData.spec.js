import Blu from 'blu'

describe('Options propsData', () => {
  it('should work', done => {
    const A = Blu.extend({
      props: ['a'],
      template: '<div>{{ a }}</div>'
    })
    const vm = new A({
      propsData: {
        a: 123
      }
    }).$mount()
    expect(vm.a).toBe(123)
    expect(vm.$el.textContent).toBe('123')
    vm.a = 234
    waitForUpdate(() => {
      expect(vm.$el.textContent).toBe('234')
    }).then(done)
  })

  it('warn non instantiation usage', () => {
    Blu.extend({
      propsData: {
        a: 123
      }
    })
    expect('option "propsData" can only be used during instance creation').toHaveBeenWarned()
  })
})
