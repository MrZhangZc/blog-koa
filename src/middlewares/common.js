import bodyParser from 'koa-body'
import logger from 'koa-logger'
import views from 'koa-views'
import serve from 'koa-static'
import { resolve } from 'path'

const r = path => resolve(__dirname, path)

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addLogger = app => {
  app.use(logger())
}

export const view = async app => {
  app.use(views(r('../app/views'), {
    extension: 'pug'
  }))
}

export const serves = async app => {
  app.use(serve(r('../../public')))
}