import Blu from 'blu'

describe('Options name', () => {
  it('should contain itself in self components', () => {
    const vm = Blu.extend({
      name: 'SuperBlu'
    })

    expect(vm.options.components['SuperBlu']).toEqual(vm)
  })

  it('should warn when incorrect name given', () => {
    Blu.extend({
      name: 'Hyper*Blu'
    })

    /* eslint-disable */
    expect(`Invalid component name: "Hyper*Blu". Component names can only contain alphanumeric characaters and the hyphen.`)
      .toHaveBeenWarned()
    /* eslint-enable */
  })

  it('when incorrect name given it should not contain itself in self components', () => {
    const vm = Blu.extend({
      name: 'Hyper*Blu'
    })

    expect(vm.options.components['Hyper*Blu']).toBeUndefined()
  })

  it('id should not override given name when using Blu.component', () => {
    const SuperComponent = Blu.component('super-component', {
      name: 'SuperBlu'
    })

    expect(SuperComponent.options.components['SuperBlu']).toEqual(SuperComponent)
    expect(SuperComponent.options.components['super-component']).toEqual(SuperComponent)
  })
})
