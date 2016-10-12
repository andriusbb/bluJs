/* @flow */

import { toArray } from '../util/index'

export function initUse (Blu: GlobalAPI) {
  Blu.use = function (plugin: Function | Object) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else {
      plugin.apply(null, args)
    }
    plugin.installed = true
    return this
  }
}
