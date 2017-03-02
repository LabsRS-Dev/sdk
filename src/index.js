import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'
import { Observable } from './dove.sdk/observable'
import util from './dove.sdk/util/index'

window.BS = b$
window.Romanysoft = {
  _: underscore._,
  Util: util,
  Observable: Observable,
  BS: b$
}
window.DoveMax = window.Romanysoft

export default {
  _: underscore._,
  Util: util,
  BS: b$,
  Observable: Observable,
  version: '__VERSION__'
}
