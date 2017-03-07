import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'
import { Observable, SelfClass } from './dove.sdk/observable'
import util from './dove.sdk/util/index'

window.BS = b$
window.Romanysoft = {
  _: underscore._,
  Util: util,
  Observable: Observable,
  SelfClass: SelfClass,
  BS: b$
}
window.DoveMax = window.Romanysoft

export default {
  _: underscore._,
  Util: util,
  BS: b$,
  Observable: Observable,
  SelfClass: SelfClass,
  version: '__VERSION__'
}
