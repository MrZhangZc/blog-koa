import Router from 'koa-router'
import { home,  } from '../app/controllers/page/frontpage'
import { login, loginPost, register, registerPost } from '../app/controllers/post'
import url from 'url'

export const router = app => {
  const router = new Router()
  router.use(async (ctx,next)=>{
    const pathName=url.parse(ctx.request.url).pathname
    ctx.state.pathName=pathName
    await next()
  })

  router.get('/', home)

  // user get
  router.get('/login', login)
  router.get('/register', register)

  // user post
  router.post('/login', loginPost)
  router.post('/register', registerPost)
 
  app.use(router.routes())
  app.use(router.allowedMethods())
}