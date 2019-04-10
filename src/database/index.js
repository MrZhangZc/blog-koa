const mongoose = require('mongoose')
const config = require('../config')

const database = () => {
  if(process.env.NODE_ENV === 'development'){
    mongoose.set('debug', true)
  }

  mongoose.connect(config.dbURL, { useNewUrlParser: true })

  mongoose.connection.on('disconnected', () => {
      mongoose.connect(config.dbURL, { useNewUrlParser: true })
  })

  mongoose.connection.on('err', err => {
    console.log('连接数据库出错')
  })

  mongoose.connection.on('open', async () => {
    console.log('成功连接数据库：' + config.dbURL)
  })
}

module.exports = database