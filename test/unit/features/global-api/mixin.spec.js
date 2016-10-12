import Blu from 'blu'

describe('Global API: mixin', () => {
  let options
  beforeEach(() => { options = Blu.options })
  afterEach(() => { Blu.options = options })

  it('should work', () => {
    const spy = jasmine.createSpy('global mixin')
    Blu.mixin({
      created () {
        spy(this.$options.myOption)
      }
    })
    new Blu({
      myOption: 'hello'
    })
    expect(spy).toHaveBeenCalledWith('hello')
  })

  it('should work for constructors created before mixin is applied', () => {
    const calls = []
    const Test = Blu.extend({
      name: 'test',
      beforeCreate () {
        calls.push(this.$options.myOption + ' local')
      }
    })
    Blu.mixin({
      beforeCreate () {
        calls.push(this.$options.myOption + ' global')
      }
    })
    expect(Test.options.name).toBe('test')
    new Test({
      myOption: 'hello'
    })
    expect(calls).toEqual(['hello global', 'hello local'])
  })
})
