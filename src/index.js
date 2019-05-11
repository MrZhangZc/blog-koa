const Koa = require('koa')
const database = require('./database')
//const redis = require('./redis')()
const PORT = process.env.PORT || '8888'

database()

// redis.set('foo', 'bar');
// redis.get('foo', function (err, result) {
//   console.log(result);
// });

const app = new Koa()

app.use(async ctx => {
  ctx.body = `<h1>zzcandhm</h1>`
})

app.listen(PORT, () => {
  console.log(`server Success on : ${PORT}`)
})