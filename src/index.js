import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'
import util from './dove.sdk/util/index'

window.BS = b$
window.Romanysoft = {
  _: underscore._,
  Util: util,
  BS: b$
}
window.DoveMax = window.Romanysoft

export default {
  _: underscore._,
  Util: util,
  BS: b$,
  version: '__VERSION__'
}
