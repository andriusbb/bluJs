import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Blu (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Blu)) {
    warn('Blu is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Blu)
stateMixin(Blu)
eventsMixin(Blu)
lifecycleMixin(Blu)
renderMixin(Blu)

export default Blu
