import Blu from 'blu'
import {
  Observer,
  observe,
  set as setProp,
  del as delProp
} from 'core/observer/index'
import Dep from 'core/observer/dep'
import { hasOwn } from 'core/util/index'

describe('Observer', () => {
  it('create on non-observables', () => {
    // skip primitive value
    const ob1 = observe(1)
    expect(ob1).toBeUndefined()
    // avoid blu instance
    const ob2 = observe(new Blu())
    expect(ob2).toBeUndefined()
    // avoid frozen objects
    const ob3 = observe(Object.freeze({}))
    expect(ob3).toBeUndefined()
  })

  it('create on object', () => {
    // on object
    const obj = {
      a: {},
      b: {}
    }
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)
    // should've walked children
    expect(obj.a.__ob__ instanceof Observer).toBe(true)
    expect(obj.b.__ob__ instanceof Observer).toBe(true)
    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
  })

  it('create on null', () => {
    // on null
    const obj = Object.create(null)
    obj.a = {}
    obj.b = {}
    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)
    // should've walked children
    expect(obj.a.__ob__ instanceof Observer).toBe(true)
    expect(obj.b.__ob__ instanceof Observer).toBe(true)
    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)
  })

  it('create on already observed object', () => {
    // on object
    const obj = {}
    let val = 0
    let getCount = 0
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () {
        getCount++
        return val
      },
      set (v) { val = v }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    getCount = 0
    // Each read of 'a' should result in only one get underlying get call
    obj.a
    expect(getCount).toBe(1)
    obj.a
    expect(getCount).toBe(2)

    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    // should call underlying setter
    obj.a = 10
    expect(val).toBe(10)
  })

  it('create on property with only getter', () => {
    // on object
    const obj = {}
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () { return 123 }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    // should be able to read
    expect(obj.a).toBe(123)

    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    // since there is no setter, you shouldn't be able to write to it
    // PhantomJS throws when a property with no setter is set
    // but other real browsers don't
    try {
      obj.a = 101
    } catch (e) {}
    expect(obj.a).toBe(123)
  })

  it('create on property with only setter', () => {
    // on object
    const obj = {}
    let val = 10
    Object.defineProperty(obj, 'a', { // eslint-disable-line accessor-pairs
      configurable: true,
      enumerable: true,
      set (v) { val = v }
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)

    // reads should return undefined
    expect(obj.a).toBe(undefined)

    // should return existing ob on already observed objects
    const ob2 = observe(obj)
    expect(ob2).toBe(ob1)

    // writes should call the set function
    obj.a = 100
    expect(val).toBe(100)
  })

  it('create on property which is marked not configurable', () => {
    // on object
    const obj = {}
    Object.defineProperty(obj, 'a', {
      configurable: false,
      enumerable: true,
      val: 10
    })

    const ob1 = observe(obj)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(obj)
    expect(obj.__ob__).toBe(ob1)
  })

  it('create on array', () => {
    // on object
    const arr = [{}, {}]
    const ob1 = observe(arr)
    expect(ob1 instanceof Observer).toBe(true)
    expect(ob1.value).toBe(arr)
    expect(arr.__ob__).toBe(ob1)
    // should've walked children
    expect(arr[0].__ob__ instanceof Observer).toBe(true)
    expect(arr[1].__ob__ instanceof Observer).toBe(true)
  })

  it('observing object prop change', () => {
    const obj = { a: { b: 2 }}
    observe(obj)
    // mock a watcher!
    const watcher = {
      deps: [],
      addDep (dep) {
        this.deps.push(dep)
        dep.addSub(this)
      },
      update: jasmine.createSpy()
    }
    // collect dep
    Dep.target = watcher
    obj.a.b
    Dep.target = null
    expect(watcher.deps.length).toBe(3) // obj.a + a.b + b
    obj.a.b = 3
    expect(watcher.update.calls.count()).toBe(1)
    // swap object
    obj.a = { b: 4 }
    expect(watcher.update.calls.count()).toBe(2)
    watcher.deps = []
    Dep.target = watcher
    obj.a.b
    Dep.target = null
    expect(watcher.deps.length).toBe(3)
    // set on the swapped object
    obj.a.b = 5
    expect(watcher.update.calls.count()).toBe(3)
  })

  it('observing object prop change on defined property', () => {
    const obj = { val: 2 }
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get () { return this.val },
      set (v) {
        this.val = v
        return this.val
      }
    })

    observe(obj)
    // mock a watcher!
    const watcher = {
      deps: [],
      addDep: function (dep) {
        this.deps.push(dep)
        dep.addSub(this)
      },
      update: jasmine.createSpy()
    }
    // collect dep
    Dep.target = watcher
    expect(obj.a).toBe(2) // Make sure 'this' is preserved
    Dep.target = null
    obj.a = 3
    expect(obj.val).toBe(3) // make sure 'setter' was called
    obj.val = 5
    expect(obj.a).toBe(5) // make sure 'getter' was called
  })

  it('observing set/delete', () => {
    const obj1 = { a: 1 }
    const ob1 = observe(obj1)
    const dep1 = ob1.dep
    spyOn(dep1, 'notify')
    setProp(obj1, 'b', 2)
    expect(obj1.b).toBe(2)
    expect(dep1.notify.calls.count()).toBe(1)
    delProp(obj1, 'a')
    expect(hasOwn(obj1, 'a')).toBe(false)
    expect(dep1.notify.calls.count()).toBe(2)
    // set existing key, should be a plain set and not
    // trigger own ob's notify
    setProp(obj1, 'b', 3)
    expect(obj1.b).toBe(3)
    expect(dep1.notify.calls.count()).toBe(2)
    // set non-existing key
    setProp(obj1, 'c', 1)
    expect(obj1.c).toBe(1)
    expect(dep1.notify.calls.count()).toBe(3)
    // should ignore deleting non-existing key
    delProp(obj1, 'a')
    expect(dep1.notify.calls.count()).toBe(3)
    // should work on non-observed objects
    const obj2 = { a: 1 }
    delProp(obj2, 'a')
    expect(hasOwn(obj2, 'a')).toBe(false)
    // should work on Object.create(null)
    const obj3 = Object.create(null)
    obj3.a = 1
    const ob3 = observe(obj3)
    const dep3 = ob3.dep
    spyOn(dep3, 'notify')
    setProp(obj3, 'b', 2)
    expect(obj3.b).toBe(2)
    expect(dep3.notify.calls.count()).toBe(1)
    delProp(obj3, 'a')
    expect(hasOwn(obj3, 'a')).toBe(false)
    expect(dep3.notify.calls.count()).toBe(2)
  })

  it('warning set/delete on a Blu instance', done => {
    const vm = new Blu({
      template: '<div>{{a}}</div>',
      data: { a: 1 }
    }).$mount()
    expect(vm.$el.outerHTML).toBe('<div>1</div>')
    Blu.set(vm, 'a', 2)
    waitForUpdate(() => {
      expect(vm.$el.outerHTML).toBe('<div>2</div>')
      expect('Avoid adding reactive properties to a Blu instance').not.toHaveBeenWarned()
      Blu.delete(vm, 'a')
    }).then(() => {
      expect('Avoid deleting properties on a Blu instance').toHaveBeenWarned()
      expect(vm.$el.outerHTML).toBe('<div>2</div>')
      Blu.set(vm, 'b', 123)
      expect('Avoid adding reactive properties to a Blu instance').toHaveBeenWarned()
    }).then(done)
  })

  it('warning set/delete on Blu instance root $data', done => {
    const data = { a: 1 }
    const vm = new Blu({
      template: '<div>{{a}}</div>',
      data
    }).$mount()
    expect(vm.$el.outerHTML).toBe('<div>1</div>')
    Blu.set(data, 'a', 2)
    waitForUpdate(() => {
      expect(vm.$el.outerHTML).toBe('<div>2</div>')
      expect('Avoid adding reactive properties to a Blu instance').not.toHaveBeenWarned()
      Blu.delete(data, 'a')
    }).then(() => {
      expect('Avoid deleting properties on a Blu instance').toHaveBeenWarned()
      expect(vm.$el.outerHTML).toBe('<div>2</div>')
      Blu.set(data, 'b', 123)
      expect('Avoid adding reactive properties to a Blu instance').toHaveBeenWarned()
    }).then(done)
  })

  it('observing array mutation', () => {
    const arr = []
    const ob = observe(arr)
    const dep = ob.dep
    spyOn(dep, 'notify')
    const objs = [{}, {}, {}]
    arr.push(objs[0])
    arr.pop()
    arr.unshift(objs[1])
    arr.shift()
    arr.splice(0, 0, objs[2])
    arr.sort()
    arr.reverse()
    expect(dep.notify.calls.count()).toBe(7)
    // inserted elements should be observed
    objs.forEach(obj => {
      expect(obj.__ob__ instanceof Observer).toBe(true)
    })
  })
})
