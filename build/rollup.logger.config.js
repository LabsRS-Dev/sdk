const buble = require('rollup-plugin-buble')

module.exports = {
  input: 'src/plugins/logger.js',
  dest: 'dist/logger.js',
  format: 'umd',
  moduleName: 'createVuexLogger',
  plugins: [buble()]
}
