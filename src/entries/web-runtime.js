/* @flow */

import Blu from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { devtools, inBrowser } from 'core/util/index'
import { patch } from 'web/runtime/patch'
import platformDirectives from 'web/runtime/directives/index'
import platformComponents from 'web/runtime/components/index'
import {
  query,
  isUnknownElement,
  isReservedTag,
  getTagNamespace,
  mustUseProp
} from 'web/util/index'

// install platform specific utils
Blu.config.isUnknownElement = isUnknownElement
Blu.config.isReservedTag = isReservedTag
Blu.config.getTagNamespace = getTagNamespace
Blu.config.mustUseProp = mustUseProp

// install platform runtime directives & components
extend(Blu.options.directives, platformDirectives)
extend(Blu.options.components, platformComponents)

// install platform patch function
Blu.prototype.__patch__ = config._isServer ? noop : patch

// wrap mount
Blu.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && !config._isServer ? query(el) : undefined
  return this._mount(el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
setTimeout(() => {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Blu)
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Blu Devtools for a better development experience:\n' +
        'https://github.com/blujs/blu-devtools'
      )
    }
  }
}, 0)

export default Blu
