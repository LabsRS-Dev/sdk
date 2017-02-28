const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
  entry: process.env.ESM ? 'src/index.esm.js' : 'src/index.js',
  dest: process.env.ESM ? 'dist/dove.max.sdk.esm.js' : 'dist/dove.max.sdk.js',
  format: process.env.ESM ? 'es' : 'umd',
  moduleName: 'DoveMaxSDK',
  plugins: [
    replace({ __VERSION__: version }),
    buble()
  ],
  banner:
`/**
 * DoveMaxSDK v${version}
 * (c) ${new Date().getFullYear()} Romanysoft LAB.
 * @license MIT
 */`
}
