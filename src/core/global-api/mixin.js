/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Blu: GlobalAPI) {
  Blu.mixin = function (mixin: Object) {
    Blu.options = mergeOptions(Blu.options, mixin)
  }
}
