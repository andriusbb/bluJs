import Blu from 'blu'
import { UA } from 'core/util/env'

describe('Options components', () => {
  it('should accept plain object', () => {
    const vm = new Blu({
      template: '<test></test>',
      components: {
        test: {
          template: '<div>hi</div>'
        }
      }
    }).$mount()
    expect(vm.$el.tagName).toBe('DIV')
    expect(vm.$el.textContent).toBe('hi')
  })

  it('should accept extended constructor', () => {
    const Test = Blu.extend({
      template: '<div>hi</div>'
    })
    const vm = new Blu({
      template: '<test></test>',
      components: {
        test: Test
      }
    }).$mount()
    expect(vm.$el.tagName).toBe('DIV')
    expect(vm.$el.textContent).toBe('hi')
  })

  it('should accept camelCase', () => {
    const myComp = {
      template: '<div>hi</div>'
    }
    const vm = new Blu({
      template: '<my-comp></my-comp>',
      components: {
        myComp
      }
    }).$mount()
    expect(vm.$el.tagName).toBe('DIV')
    expect(vm.$el.textContent).toBe('hi')
  })

  it('should accept PascalCase', () => {
    const MyComp = {
      template: '<div>hi</div>'
    }
    const vm = new Blu({
      template: '<my-comp></my-comp>',
      components: {
        MyComp
      }
    }).$mount()
    expect(vm.$el.tagName).toBe('DIV')
    expect(vm.$el.textContent).toBe('hi')
  })

  it('should warn native HTML elements', () => {
    new Blu({
      components: {
        div: { template: '<div></div>' }
      }
    })
    expect('Do not use built-in or reserved HTML elements as component').toHaveBeenWarned()
  })

  it('should warn built-in elements', () => {
    new Blu({
      components: {
        component: { template: '<div></div>' }
      }
    })
    expect('Do not use built-in or reserved HTML elements as component').toHaveBeenWarned()
  })

  // the HTMLUnknownElement check doesn't work in Android 4.2
  // but since it doesn't support custom elements nor will any dev use it
  // as their primary debugging browser, it doesn't really matter.
  if (!(UA && /android 4\.2/.test(UA))) {
    it('warn non-existent', () => {
      new Blu({
        template: '<test></test>'
      }).$mount()
      expect('Unknown custom element: <test>').toHaveBeenWarned()
    })
  }
})
