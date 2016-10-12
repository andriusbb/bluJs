import Blu from 'blu'

describe('Global config', () => {
  it('should warn replacing config object', () => {
    const originalConfig = Blu.config
    Blu.config = {}
    expect(Blu.config).toBe(originalConfig)
    expect('Do not replace the Blu.config object').toHaveBeenWarned()
  })

  describe('silent', () => {
    it('should be false by default', () => {
      Blu.util.warn('foo')
      expect('foo').toHaveBeenWarned()
    })

    it('should work when set to true', () => {
      Blu.config.silent = true
      Blu.util.warn('foo')
      expect('foo').not.toHaveBeenWarned()
      Blu.config.silent = false
    })
  })

  describe('errorHandler', () => {
    it('should be called with correct args', () => {
      const spy = jasmine.createSpy('errorHandler')
      Blu.config.errorHandler = spy
      const err = new Error()
      const vm = new Blu({
        render () { throw err }
      }).$mount()
      expect(spy).toHaveBeenCalledWith(err, vm)
      Blu.config.errorHandler = null
    })

    it('should capture user watcher callback errors', done => {
      const spy = jasmine.createSpy('errorHandler')
      Blu.config.errorHandler = spy
      const err = new Error()
      const vm = new Blu({
        data: { a: 1 },
        watch: {
          a: () => {
            throw err
          }
        }
      }).$mount()
      vm.a = 2
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalledWith(err, vm)
        Blu.config.errorHandler = null
      }).then(done)
    })
  })

  describe('optionMergeStrategies', () => {
    it('should allow defining custom option merging strategies', () => {
      const spy = jasmine.createSpy('option merging')
      Blu.config.optionMergeStrategies.__test__ = (parent, child, vm) => {
        spy(parent, child, vm)
        return child + 1
      }
      const Test = Blu.extend({
        __test__: 1
      })
      expect(spy.calls.count()).toBe(1)
      expect(spy).toHaveBeenCalledWith(undefined, 1, undefined)
      expect(Test.options.__test__).toBe(2)
      const test = new Test({
        __test__: 2
      })
      expect(spy.calls.count()).toBe(2)
      expect(spy).toHaveBeenCalledWith(2, 2, test)
      expect(test.$options.__test__).toBe(3)
    })
  })
})
