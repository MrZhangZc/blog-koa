import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'
import config from './config'

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
  const { port } = config
  await userMiddlewares(app)(MIDDLEWARES)

  app.listen(port)
  console.log('服务已经运行在' + '<' +port+ '>' + '端口')
}

start()