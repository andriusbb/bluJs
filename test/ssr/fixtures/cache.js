import Blu from '../../../dist/blu.common.js'

const app = {
  name: 'app',
  props: ['id'],
  serverCacheKey: props => props.id,
  render (h) {
    return h('div', '/test')
  }
}

export default () => {
  return Promise.resolve(new Blu({
    render: h => h(app, { props: { id: 1 }})
  }))
}
