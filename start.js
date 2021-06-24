if(process.env.NODE_ENV !== 'production') require('dotenv').config()
require('babel-core/register')()
require('babel-polyfill')
require('./src/index.js')