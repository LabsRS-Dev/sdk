const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const node_resolve = require('rollup-plugin-node-resolve')
const flow = require('rollup-plugin-flow-no-whitespace')
const commonjs = require('rollup-plugin-commonjs')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
 * DoveMaxSDK ABI v${version}
 * (c) ${new Date().getFullYear()} Romanysoft LAB. && GMagon Inc. 
 * @license MIT
 */`

const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const builds = {
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

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
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
      flow(),
      buble({
        exclude: 'node_modules/**'
      }),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: banner,
      name: opts.moduleName || 'DoveMaxSDK'
    }
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
