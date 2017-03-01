import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'
import util from './dove.sdk/util/index'

var _ = underscore._

window.BS = b$
window.Romanysoft = {
  _: underscore._,
  Util: util,
  BS: b$
}
window.DoveMax = window.Romanysoft

export default {
  _: _,
  Util: util,
  BS: b$,
  version: '__VERSION__'
}

export {
  _,
  util,
  b$
}
