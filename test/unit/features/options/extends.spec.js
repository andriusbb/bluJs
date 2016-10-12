import Blu from 'blu'

describe('Options extends', () => {
  it('should work on objects', () => {
    const A = {
      data () {
        return { a: 1 }
      }
    }
    const B = {
      extends: A,
      data () {
        return { b: 2 }
      }
    }
    const vm = new Blu({
      extends: B,
      data: {
        c: 3
      }
    })
    expect(vm.a).toBe(1)
    expect(vm.b).toBe(2)
    expect(vm.c).toBe(3)
  })

  it('should work on extended constructors', () => {
    const A = Blu.extend({
      data () {
        return { a: 1 }
      }
    })
    const B = Blu.extend({
      extends: A,
      data () {
        return { b: 2 }
      }
    })
    const vm = new Blu({
      extends: B,
      data: {
        c: 3
      }
    })
    expect(vm.a).toBe(1)
    expect(vm.b).toBe(2)
    expect(vm.c).toBe(3)
  })
})
