import Blu from 'blu'

describe('ref', () => {
  const components = {
    test: {
      id: 'test',
      template: '<div>test</div>'
    },
    test2: {
      id: 'test2',
      template: '<div>test2</div>'
    }
  }

  it('should work', () => {
    const vm = new Blu({
      data: {
        value: 'bar'
      },
      template: `<div>
        <test ref="foo"></test>
        <test2 :ref="value"></test2>
      </div>`,
      components
    })
    vm.$mount()
    expect(vm.$refs.foo).toBeTruthy()
    expect(vm.$refs.foo.$options.id).toBe('test')
    expect(vm.$refs.bar).toBeTruthy()
    expect(vm.$refs.bar.$options.id).toBe('test2')
  })

  it('should dynamically update refs', done => {
    const vm = new Blu({
      data: {
        value: 'foo'
      },
      template: '<div :ref="value"></div>'
    }).$mount()
    expect(vm.$refs.foo).toBe(vm.$el)
    vm.value = 'bar'
    waitForUpdate(() => {
      expect(vm.$refs.foo).toBeUndefined()
      expect(vm.$refs.bar).toBe(vm.$el)
    }).then(done)
  })

  it('should work as a hyperscript prop', () => {
    const vm = new Blu({
      components,
      render (h) {
        return h('div', null, [
          h('test', { ref: 'test' })
        ])
      }
    })
    vm.$mount()
    expect(vm.$refs.test).toBeTruthy()
    expect(vm.$refs.test.$options.id).toBe('test')
  })

  it('should accept HOC component', () => {
    const vm = new Blu({
      template: '<test ref="test"></test>',
      components
    })
    vm.$mount()
    expect(vm.$refs.test).toBeTruthy()
    expect(vm.$refs.test.$options.id).toBe('test')
  })

  it('should accept dynamic component', done => {
    const vm = new Blu({
      template: `<div>
        <component :is="test" ref="test"></component>
      </div>`,
      components,
      data: { test: 'test' }
    })
    vm.$mount()
    expect(vm.$refs.test.$options.id).toBe('test')
    vm.test = 'test2'
    waitForUpdate(() => {
      expect(vm.$refs.test.$options.id).toBe('test2')
      vm.test = ''
    }).then(() => {
      expect(vm.$refs.test).toBeUndefined()
    }).then(done)
  })

  it('should register as Array when used with v-for', done => {
    const vm = new Blu({
      data: {
        items: [1, 2, 3]
      },
      template: `
        <div>
          <div v-for="n in items" ref="list">{{n}}</div>
        </div>
      `
    }).$mount()
    assertRefs()
    // updating
    vm.items.push(4)
    waitForUpdate(assertRefs)
      .then(() => { vm.items = [] })
      .then(assertRefs)
      .then(done)

    function assertRefs () {
      expect(Array.isArray(vm.$refs.list)).toBe(true)
      expect(vm.$refs.list.length).toBe(vm.items.length)
      expect(vm.$refs.list.every((item, i) => item.textContent === String(i + 1))).toBe(true)
    }
  })

  it('should register as Array when used with v-for (components)', done => {
    const vm = new Blu({
      data: {
        items: [1, 2, 3]
      },
      template: `
        <div>
          <test v-for="n in items" ref="list" :n="n"></test>
        </div>
      `,
      components: {
        test: {
          props: ['n'],
          template: '<div>{{ n }}</div>'
        }
      }
    }).$mount()
    assertRefs()
    // updating
    vm.items.push(4)
    waitForUpdate(assertRefs)
      .then(() => { vm.items = [] })
      .then(assertRefs)
      .then(done)

    function assertRefs () {
      expect(Array.isArray(vm.$refs.list)).toBe(true)
      expect(vm.$refs.list.length).toBe(vm.items.length)
      expect(vm.$refs.list.every((comp, i) => comp.$el.textContent === String(i + 1))).toBe(true)
    }
  })

  it('should register on component with empty roots', () => {
    const vm = new Blu({
      template: '<child ref="test"></child>',
      components: {
        child: {
          template: '<div v-if="false"></div>'
        }
      }
    }).$mount()
    expect(vm.$refs.test).toBe(vm.$children[0])
  })
})
