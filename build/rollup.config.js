const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const version = process.env.VERSION || require('../package.json').version

module.exports = {
  input: process.env.ESM ? 'src/index.esm.js' : 'src/index.js',
  dest: process.env.ESM ? 'dist/dovemax-sdk.esm.js' : 'dist/dovemax-sdk.js',
  format: process.env.ESM ? 'es' : 'umd',
  moduleName: 'DoveMaxSDK',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    replace({ __VERSION__: version }),
    buble({
      exclude: 'node_modules/**'
    })
  ],
  banner:
`/**
 * DoveMaxSDK v${version}
 * (c) ${new Date().getFullYear()} Gmagon,Inc. && Romanysoft LAB.
 * @license MIT
 */`
}
