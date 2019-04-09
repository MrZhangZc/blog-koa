require('babel-core/register')({
  'presets': [
      'env'
  ]
})

require('babel-polyfill')
require('./src/index')