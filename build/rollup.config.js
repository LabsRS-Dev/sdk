const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
  entry: process.env.ESM ? 'src/index.esm.js' : 'src/index.js',
  dest: process.env.ESM ? 'dist/dovemax-sdk.esm.js' : 'dist/dovemax-sdk.js',
  format: process.env.ESM ? 'es' : 'umd',
  moduleName: 'DoveMaxSDK',
  plugins: [
    replace({ __VERSION__: version }),
    buble()
  ],
  banner:
`/**
 * DoveMaxSDK v${version}
 * (c) ${new Date().getFullYear()} Gmagon Inc. && Romanysoft LAB.
 * @license MIT
 */`
}
