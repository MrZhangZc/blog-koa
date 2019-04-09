const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  ctx.body = 'zzc'
})

app.listen(8888, () => {
  console.log('sucess')
})