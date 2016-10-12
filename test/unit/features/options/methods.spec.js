import Blu from 'blu'

describe('Options methods', () => {
  it('should have correct context', () => {
    const vm = new Blu({
      data: {
        a: 1
      },
      methods: {
        plus () {
          this.a++
        }
      }
    })
    vm.plus()
    expect(vm.a).toBe(2)
  })

  it('should warn undefined methods', () => {
    new Blu({
      methods: {
        hello: undefined
      }
    })
    expect(`method "hello" has an undefined value in the component definition`).toHaveBeenWarned()
  })
})
