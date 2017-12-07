import 'babel-polyfill'

// 模拟web
// see: http://airbnb.io/enzyme/docs/guides/jsdom.html
const { Script } = require('vm')
const { JSDOM } = require('jsdom')
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'dangerously' })
const { window } = jsdom

function copyProps (src, target) {
  const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .reduce((result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop)
      }), {})
  Object.defineProperties(target, props)
}

global.require = require
global.module = module
global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}
copyProps(window, global)

window.eval = function (s) {
  jsdom.runVMScript(new Script(s))
}
window.jQuery = require('jquery')
window.$ = require('jquery') // unless jQuery?
window.require = require
window.module = module
