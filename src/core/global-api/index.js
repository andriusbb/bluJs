/* @flow */

import config from '../config'
import * as util from '../util/index'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import builtInComponents from '../components/index'

export function initGlobalAPI (Blu: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      util.warn(
        'Do not replace the Blu.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Blu, 'config', configDef)
  Blu.util = util
  Blu.set = set
  Blu.delete = del
  Blu.nextTick = util.nextTick

  Blu.options = Object.create(null)
  config._assetTypes.forEach(type => {
    Blu.options[type + 's'] = Object.create(null)
  })

  util.extend(Blu.options.components, builtInComponents)

  initUse(Blu)
  initMixin(Blu)
  initExtend(Blu)
  initAssetRegisters(Blu)
}
