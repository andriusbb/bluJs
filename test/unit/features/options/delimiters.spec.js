import Blu from 'blu'

describe('Delimiters', () => {
  it('default delimiters should work', () => {
    const vm = new Blu({
      data: {
        a: 1
      },
      template: '<div>{{ a }}</div>'
    }).$mount()
    expect(vm.$el.textContent).toEqual('1')
  })

  it('custom delimiters should work', () => {
    const vm = new Blu({
      delimiters: ['[[', ']]'],
      template: '<div>[[ a ]]</div>',
      data: {
        a: 1
      }
    }).$mount()

    expect(vm.$el.textContent).toEqual('1')
  })

  it('default delimiters should be ignored when custom delimiters defined', () => {
    const vm = new Blu({
      delimiters: ['[[', ']]'],
      template: '<div>{{ a }}</div>',
      data: {
        a: 1
      }
    }).$mount()

    expect(vm.$el.textContent).toEqual('{{ a }}')
  })

  it('delimiters should only affect vm', () => {
    const Component = Blu.extend({
      data: function () {
        return {
          b: 2
        }
      },
      template: '<span>[[ b ]]</span>'
    })

    const vm = new Blu({
      delimiters: ['[[', ']]'],
      template: '<div>[[ a ]] - <test-component></test-component></div>',
      data: {
        a: 2
      },
      components: {
        'test-component': Component
      }
    }).$mount()

    expect(vm.$el.textContent).toEqual('2 - [[ b ]]')
  })

  it('delimiters defined globally should work on all vms', () => {
    Blu.options.delimiters = ['[[', ']]']

    const Component = Blu.extend({
      template: '<span>[[ a ]]</span>',
      data: function () {
        return {
          a: 2
        }
      }
    })

    const vm = new Blu({
      data: {
        b: 1
      },
      template: '<div>[[ b ]] - <test-component></test-component></div>',
      components: {
        'test-component': Component
      }
    }).$mount()

    expect(vm.$el.textContent).toEqual('1 - 2')
      // restore default options
    delete Blu.options.delimiters
  })

  it('component specific delimiters should override global delimiters', () => {
    Blu.options.delimiters = ['[[', ']]']

    const Component = Blu.extend({
      delimiters: ['@{{', '}}'],
      template: '<span>@{{ a }}</span>',
      data: function () {
        return {
          a: 2
        }
      }
    })

    const vm = new Blu({
      data: {
        b: 1
      },
      template: '<div>[[ b ]] - <test-component></test-component></div>',
      components: {
        'test-component': Component
      }
    }).$mount()

    expect(vm.$el.textContent).toEqual('1 - 2')
      // restore default options
    delete Blu.options.delimiters
  })
})
