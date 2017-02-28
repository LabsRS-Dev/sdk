import util from './dove.sdk/util/index'
import b$ from './dove.sdk/bs/index'
import underscore from './dove.sdk/underscore'

window.BS = b$
window.Romanysoft = {
  _: underscore._,
  u$: util,
  b$: b$
}

export default {
  _: underscore._,
  util,
  b$,
  version: '__VERSION__'
}
