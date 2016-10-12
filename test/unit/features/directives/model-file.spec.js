import Blu from 'blu'

describe('Directive v-model file', () => {
  it('warn to use @change instead', () => {
    new Blu({
      data: {
        file: ''
      },
      template: '<input v-model="file" type="file">'
    }).$mount()
    expect('Use a v-on:change listener instead').toHaveBeenWarned()
  })
})
