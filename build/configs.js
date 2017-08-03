const path = require('path')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const node_resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
 * DoveMaxSDK v${version}
 * (c) ${new Date().getFullYear()} Gmagon Inc. && Romanysoft LAB.
 * @license MIT
 */`

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  umdDev: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/dovemax-sdk.js'),
    format: 'umd',
    env: 'development'
  },
  umdProd: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/dovemax-sdk.min.js'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    entry: resolve('src/index.js'),
    dest: resolve('dist/dovemax-sdk.common.js'),
    format: 'cjs'
  },
  esm: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/dovemax-sdk.esm.js'),
    format: 'es'
  }
}

function genConfig (opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    format: opts.format,
    banner,
    moduleName: 'DoveMaxSDK',
    plugins: [
      node_resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      replace({
        __VERSION__: version
      }),
      buble({
        exclude: 'node_modules/**'
      })
    ]
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)
