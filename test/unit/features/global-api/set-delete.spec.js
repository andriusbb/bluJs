import Blu from 'blu'

describe('Global API: set/delete', () => {
  describe('Blu.set', () => {
    it('should update a blu object', done => {
      const vm = new Blu({
        template: '<div>{{x}}</div>',
        data: { x: 1 }
      }).$mount()
      expect(vm.$el.innerHTML).toBe('1')
      Blu.set(vm, 'x', 2)
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('2')
      }).then(done)
    })

    it('should update a observing object', done => {
      const vm = new Blu({
        template: '<div>{{foo.x}}</div>',
        data: { foo: { x: 1 }}
      }).$mount()
      expect(vm.$el.innerHTML).toBe('1')
      Blu.set(vm.foo, 'x', 2)
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('2')
      }).then(done)
    })

    it('should update a observing array', done => {
      const vm = new Blu({
        template: '<div><div v-for="v,k in list">{{k}}-{{v}}</div></div>',
        data: { list: ['a', 'b', 'c'] }
      }).$mount()
      expect(vm.$el.innerHTML).toBe('<div>0-a</div><div>1-b</div><div>2-c</div>')
      Blu.set(vm.list, 1, 'd')
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('<div>0-a</div><div>1-d</div><div>2-c</div>')
      }).then(done)
    })

    it('should update a blu object with nothing', done => {
      const vm = new Blu({
        template: '<div>{{x}}</div>',
        data: { x: 1 }
      }).$mount()
      expect(vm.$el.innerHTML).toBe('1')
      Blu.set(vm, 'x', null)
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('')
        Blu.set(vm, 'x')
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('')
      }).then(done)
    })
  })

  describe('Blu.delete', () => {
    it('should delete a key', done => {
      const vm = new Blu({
        template: '<div>{{obj.x}}</div>',
        data: { obj: { x: 1 }}
      }).$mount()
      expect(vm.$el.innerHTML).toBe('1')
      vm.obj.x = 2
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('2')
        Blu.delete(vm.obj, 'x')
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('')
        vm.obj.x = 3
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('')
      }).then(done)
    })
  })
})
