import Blu from 'blu'

describe('Initialization', () => {
  it('without new', () => {
    try { Blu() } catch (e) {}
    expect('Blu is a constructor and should be called with the `new` keyword').toHaveBeenWarned()
  })

  it('with new', () => {
    expect(new Blu() instanceof Blu).toBe(true)
  })
})
