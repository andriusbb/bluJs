import Blu from 'blu'

describe('Global API: use', () => {
  const def = {}
  const options = {}
  const pluginStub = {
    install: (Blu, opts) => {
      Blu.directive('plugin-test', def)
      expect(opts).toBe(options)
    }
  }

  it('should apply Object plugin', () => {
    Blu.use(pluginStub, options)
    expect(Blu.options.directives['plugin-test']).toBe(def)
    delete Blu.options.directives['plugin-test']
  })

  it('should apply Function plugin', () => {
    Blu.use(pluginStub.install, options)
    expect(Blu.options.directives['plugin-test']).toBe(def)
    delete Blu.options.directives['plugin-test']
  })
})
