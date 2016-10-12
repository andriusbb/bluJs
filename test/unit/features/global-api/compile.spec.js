import Blu from 'blu'

describe('Global API: compile', () => {
  it('should compile render functions', () => {
    const res = Blu.compile('<div><span>{{ msg }}</span></div>')
    const vm = new Blu({
      data: {
        msg: 'hello'
      },
      render: res.render,
      staticRenderFns: res.staticRenderFns
    }).$mount()
    expect(vm.$el.innerHTML).toContain('<span>hello</span>')
  })
})
