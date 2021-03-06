import Blu from 'blu'

describe('Directive v-model radio', () => {
  it('should work', done => {
    const vm = new Blu({
      data: {
        test: '1'
      },
      template: `
        <div>
          <input type="radio" value="1" v-model="test" name="test">
          <input type="radio" value="2" v-model="test" name="test">
        </div>
      `
    }).$mount()
    document.body.appendChild(vm.$el)
    expect(vm.$el.children[0].checked).toBe(true)
    expect(vm.$el.children[1].checked).toBe(false)
    vm.test = '2'
    waitForUpdate(() => {
      expect(vm.$el.children[0].checked).toBe(false)
      expect(vm.$el.children[1].checked).toBe(true)
      vm.$el.children[0].click()
      expect(vm.$el.children[0].checked).toBe(true)
      expect(vm.$el.children[1].checked).toBe(false)
      expect(vm.test).toBe('1')
    }).then(() => {
      document.body.removeChild(vm.$el)
    }).then(done)
  })

  it('should respect value bindings', done => {
    const vm = new Blu({
      data: {
        test: 1
      },
      template: `
        <div>
          <input type="radio" :value="1" v-model="test" name="test">
          <input type="radio" :value="2" v-model="test" name="test">
        </div>
      `
    }).$mount()
    document.body.appendChild(vm.$el)
    expect(vm.$el.children[0].checked).toBe(true)
    expect(vm.$el.children[1].checked).toBe(false)
    vm.test = 2
    waitForUpdate(() => {
      expect(vm.$el.children[0].checked).toBe(false)
      expect(vm.$el.children[1].checked).toBe(true)
      vm.$el.children[0].click()
      expect(vm.$el.children[0].checked).toBe(true)
      expect(vm.$el.children[1].checked).toBe(false)
      expect(vm.test).toBe(1)
    }).then(() => {
      document.body.removeChild(vm.$el)
    }).then(done)
  })

  it('should respect value bindings (object loose equal)', done => {
    const vm = new Blu({
      data: {
        test: { a: 1 }
      },
      template: `
        <div>
          <input type="radio" :value="{ a: 1 }" v-model="test" name="test">
          <input type="radio" :value="{ a: 2 }" v-model="test" name="test">
        </div>
      `
    }).$mount()
    document.body.appendChild(vm.$el)
    expect(vm.$el.children[0].checked).toBe(true)
    expect(vm.$el.children[1].checked).toBe(false)
    vm.test = { a: 2 }
    waitForUpdate(() => {
      expect(vm.$el.children[0].checked).toBe(false)
      expect(vm.$el.children[1].checked).toBe(true)
      vm.$el.children[0].click()
      expect(vm.$el.children[0].checked).toBe(true)
      expect(vm.$el.children[1].checked).toBe(false)
      expect(vm.test).toEqual({ a: 1 })
    }).then(() => {
      document.body.removeChild(vm.$el)
    }).then(done)
  })

  it('warn inline checked', () => {
    const vm = new Blu({
      template: `<input v-model="test" type="radio" value="1" checked>`,
      data: {
        test: '2'
      }
    }).$mount()
    expect(vm.$el.checked).toBe(false)
    expect('inline checked attributes will be ignored when using v-model').toHaveBeenWarned()
  })
})
