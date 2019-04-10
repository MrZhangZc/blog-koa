const Koa = require('koa')
const database = require('./database') 
const PORT = process.env.PORT || '8888'
const HOST = process.env.HOST || '127.0.0.1'

database()

const app = new Koa()

app.use(async ctx => {
  ctx.body = `<h1>zzchm</h1>`
})

app.listen(PORT, HOST, () => {
  console.log(`server Success on : ${HOST} : ${PORT}`)
})