import Blu from 'blu'
import config from 'core/config'
import { queueWatcher } from 'core/observer/scheduler'

describe('Scheduler', () => {
  let spy
  beforeEach(() => {
    spy = jasmine.createSpy('scheduler')
  })

  it('queueWatcher', done => {
    queueWatcher({
      run: spy
    })
    waitForUpdate(() => {
      expect(spy.calls.count()).toBe(1)
    }).then(done)
  })

  it('dedup', done => {
    queueWatcher({
      id: 1,
      run: spy
    })
    queueWatcher({
      id: 1,
      run: spy
    })
    waitForUpdate(() => {
      expect(spy.calls.count()).toBe(1)
    }).then(done)
  })

  it('allow duplicate when flushing', done => {
    const job = {
      id: 1,
      run: spy
    }
    queueWatcher(job)
    queueWatcher({
      id: 2,
      run () { queueWatcher(job) }
    })
    waitForUpdate(() => {
      expect(spy.calls.count()).toBe(2)
    }).then(done)
  })

  it('call user watchers before component re-render', done => {
    const calls = []
    const vm = new Blu({
      data: {
        a: 1
      },
      template: '<div>{{ a }}</div>',
      watch: {
        a () { calls.push(1) }
      },
      beforeUpdate () {
        calls.push(2)
      }
    }).$mount()
    vm.a = 2
    waitForUpdate(() => {
      expect(calls).toEqual([1, 2])
    }).then(done)
  })

  it('call user watcher triggered by component re-render immediately', done => {
    // this happens when a component re-render updates the props of a child
    const calls = []
    const vm = new Blu({
      data: {
        a: 1
      },
      watch: {
        a () {
          calls.push(1)
        }
      },
      beforeUpdate () {
        calls.push(2)
      },
      template: '<div><test :a="a"></test></div>',
      components: {
        test: {
          props: ['a'],
          template: '<div>{{ a }}</div>',
          watch: {
            a () {
              calls.push(3)
            }
          },
          beforeUpdate () {
            calls.push(4)
          }
        }
      }
    }).$mount()
    vm.a = 2
    waitForUpdate(() => {
      expect(calls).toEqual([1, 2, 3, 4])
    }).then(done)
  })

  it('warn against infinite update loops', function (done) {
    let count = 0
    const job = {
      id: 1,
      run () {
        count++
        queueWatcher(job)
      }
    }
    queueWatcher(job)
    waitForUpdate(() => {
      expect(count).toBe(config._maxUpdateCount + 1)
      expect('infinite update loop').toHaveBeenWarned()
    }).then(done)
  })

  it('should call newly pushed watcher after current watcher is done', done => {
    const callOrder = []
    queueWatcher({
      id: 1,
      user: true,
      run () {
        callOrder.push(1)
        queueWatcher({
          id: 2,
          run () {
            callOrder.push(3)
          }
        })
        callOrder.push(2)
      }
    })
    waitForUpdate(() => {
      expect(callOrder).toEqual([1, 2, 3])
    }).then(done)
  })
})
