import Blu from 'blu'
import { Promise } from 'es6-promise'

describe('Component async', () => {
  it('normal', done => {
    const vm = new Blu({
      template: '<div><test></test></div>',
      components: {
        test: (resolve) => {
          setTimeout(() => {
            resolve({
              template: '<div>hi</div>'
            })
            // wait for parent update
            Blu.nextTick(next)
          }, 0)
        }
      }
    }).$mount()
    expect(vm.$el.innerHTML).toBe('')
    expect(vm.$children.length).toBe(0)
    function next () {
      expect(vm.$el.innerHTML).toBe('<div>hi</div>')
      expect(vm.$children.length).toBe(1)
      done()
    }
  })

  it('as root', done => {
    const vm = new Blu({
      template: '<test></test>',
      components: {
        test: resolve => {
          setTimeout(() => {
            resolve({
              template: '<div>hi</div>'
            })
            // wait for parent update
            Blu.nextTick(next)
          }, 0)
        }
      }
    }).$mount()
    expect(vm.$el.nodeType).toBe(8)
    expect(vm.$children.length).toBe(0)
    function next () {
      expect(vm.$el.nodeType).toBe(1)
      expect(vm.$el.outerHTML).toBe('<div>hi</div>')
      expect(vm.$children.length).toBe(1)
      done()
    }
  })

  it('dynamic', done => {
    var vm = new Blu({
      template: '<component :is="view"></component>',
      data: {
        view: 'view-a'
      },
      components: {
        'view-a': resolve => {
          setTimeout(() => {
            resolve({
              template: '<div>A</div>'
            })
            Blu.nextTick(step1)
          }, 0)
        },
        'view-b': resolve => {
          setTimeout(() => {
            resolve({
              template: '<p>B</p>'
            })
            Blu.nextTick(step2)
          }, 0)
        }
      }
    }).$mount()
    var aCalled = false
    function step1 () {
      // ensure A is resolved only once
      expect(aCalled).toBe(false)
      aCalled = true
      expect(vm.$el.tagName).toBe('DIV')
      expect(vm.$el.textContent).toBe('A')
      vm.view = 'view-b'
    }
    function step2 () {
      expect(vm.$el.tagName).toBe('P')
      expect(vm.$el.textContent).toBe('B')
      vm.view = 'view-a'
      waitForUpdate(function () {
        expect(vm.$el.tagName).toBe('DIV')
        expect(vm.$el.textContent).toBe('A')
      }).then(done)
    }
  })

  it('warn reject', () => {
    new Blu({
      template: '<test></test>',
      components: {
        test: (resolve, reject) => {
          reject('nooooo')
        }
      }
    }).$mount()
    expect('Reason: nooooo').toHaveBeenWarned()
  })

  it('with v-for', done => {
    const vm = new Blu({
      template: '<div><test v-for="n in list" :n="n"></test></div>',
      data: {
        list: [1, 2, 3]
      },
      components: {
        test: resolve => {
          setTimeout(() => {
            resolve({
              props: ['n'],
              template: '<div>{{n}}</div>'
            })
            Blu.nextTick(next)
          }, 0)
        }
      }
    }).$mount()
    function next () {
      expect(vm.$el.innerHTML).toBe('<div>1</div><div>2</div><div>3</div>')
      done()
    }
  })

  it('returning Promise', done => {
    const vm = new Blu({
      template: '<div><test></test></div>',
      components: {
        test: () => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                template: '<div>hi</div>'
              })
              // wait for promise resolve and then parent update
              Promise.resolve().then(() => {
                Blu.nextTick(next)
              })
            }, 0)
          })
        }
      }
    }).$mount()
    expect(vm.$el.innerHTML).toBe('')
    expect(vm.$children.length).toBe(0)
    function next () {
      expect(vm.$el.innerHTML).toBe('<div>hi</div>')
      expect(vm.$children.length).toBe(1)
      done()
    }
  })
})
