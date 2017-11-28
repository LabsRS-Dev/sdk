import { Observable, SelfClass } from './dove.sdk/observable'

import b$ from './dove.sdk/bs/index'
import util from './dove.sdk/util/index'
import lodash from 'lodash'

try {
  if (window) {
    window.BS = b$
    window._ = lodash
    window.Romanysoft = {
      _: lodash,
      lodash: lodash,
      Util: util,
      Observable: Observable,
      SelfClass: SelfClass,
      BS: b$
    }
    window.DoveMax = window.Romanysoft
    window.GmagonSDK = window.Romanysoft
  }
} catch (error) {
  console.warn(error)
}

export default {
  _: lodash,
  Util: util,
  lodash: lodash,
  BS: b$,
  Observable: Observable,
  SelfClass: SelfClass,
  version: '__VERSION__'
}
