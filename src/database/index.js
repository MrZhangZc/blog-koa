import mongoose from 'mongoose'

export const database = () => {
  //mongoose.set('debug', true)

  mongoose.connect('mongodb://mongo/blog-koa')

  mongoose.connection.on('disconnected', () => {
      mongoose.connect(config.dbUrl)
  })

  mongoose.connection.on('err', err => {
    console.log('连接数据库出错')
  })

  mongoose.connection.on('open', async () => {
    console.log('成功连接数据库：' + config.dbUrl)
  })
}