require('babel-core/register')()
require('babel-polyfill')
require('./src/index.js')

console.log('env: ', process.env.NODE_ENV)