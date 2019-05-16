import Router from 'koa-router'
import { home,  } from '../app/controllers/page/frontpage'
import { addArticle, postArticle } from '../app/controllers/page/backpage'
import { login, loginPost, register, registerPost, logout } from '../app/controllers/post'
import url from 'url'
import moment from 'moment'

export const router = app => {
  const router = new Router()
  router.use(async (ctx,next)=>{
    const pathName = url.parse(ctx.request.url).pathname
    ctx.state.pathName = pathName
    ctx.state.moment = moment
    ctx.state.user = ctx.session.user
    await next()
  })
  
  //get page front
  router.get('/', home)

  //get brck page
  router.get('/article/add', addArticle)
  router.post('/article/add', postArticle)

  // user get
  router.get('/login', login)
  router.get('/register', register)
  router.get('/logout', logout)

  // user post
  router.post('/login', loginPost)
  router.post('/register', registerPost)
 
  app.use(router.routes())
  app.use(router.allowedMethods())
}