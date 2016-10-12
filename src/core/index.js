import config from './config'
import { initGlobalAPI } from './global-api/index'
import Blu from './instance/index'

initGlobalAPI(Blu)

Object.defineProperty(Blu.prototype, '$isServer', {
  get: () => config._isServer
})

Blu.version = '2.0.2'

export default Blu
