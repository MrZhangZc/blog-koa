import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'

const r = url => resolve(__dirname,url)
const MIDDLEWARES = ['mongo', 'common', 'router']

const userMiddlewares = app => {
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middlewares')}/${i}`
  ))
}

async function start (){
  const app = new Koa()
  await userMiddlewares(app)(MIDDLEWARES)
  app.listen(process.env.PORT)
}

start()