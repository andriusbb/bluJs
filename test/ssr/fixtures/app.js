import Blu from '../../../dist/blu.common.js'

export default context => {
  return new Promise(resolve => {
    context.msg = 'hello'
    resolve(new Blu({
      render (h) {
        return h('div', context.url)
      }
    }))
  })
}
