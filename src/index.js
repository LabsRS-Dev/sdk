import { Observable, SelfClass } from './dove.sdk/observable'

import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'
import util from './dove.sdk/util/index'
import lodash from 'lodash'

try {
  if (window) {
    window.BS = b$
    window.Romanysoft = {
      _: underscore._,
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
  _: underscore._,
  lodash: lodash,
  Util: util,
  BS: b$,
  Observable: Observable,
  SelfClass: SelfClass,
  version: '__VERSION__'
}
