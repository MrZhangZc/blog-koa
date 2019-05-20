import Router from 'koa-router'
import { home, article } from '../app/controllers/page/frontpage'
import { login, loginPost, register, registerPost, logout, fixPassworrd, postFixPassworrd, userList, deleteUser, upUser, downUser } from '../app/controllers/user'
import { showArticles, addArticle, postArticle,editArticle, postEditArticle, publishdArticle, deleteArticle} from '../app/controllers/article'
import { showCategory, addCategory, postCategory, editCategory, postEditCategory, deleteCategory} from '../app/controllers/category'
import { signinRequired, adminRequired } from '../app/controllers/user'
import url from 'url'
import moment from 'moment'
import mongoose from 'mongoose'
import truncate from 'truncate'
const Category = mongoose.model('Category')

export const router = async app => {
  const router = new Router()
  router.use(async (ctx,next)=>{
    const categories = await Category.find({}).sort('-created')
    const pathName = url.parse(ctx.request.url).pathname
    ctx.state.categories = categories
    ctx.state.pathName = pathName 
    ctx.state.moment = moment
    ctx.state.truncate = truncate
    ctx.state.user = ctx.session.user
    await next()
  })
  
  //get page front
  router.get('/', home)
  router.get('/article/:id', article)

  //article
  router.get('/admin/article', showArticles)
  router.get('/admin/article/add', addArticle)
  router.post('/admin/article/add', postArticle)
  router.get('/admin/article/edit/:id', editArticle)
  router.post('/admin/article/edit/:id', postEditArticle)
  router.get('/admin/article/publishd/:id', publishdArticle)
  router.get('/admin/article/delete/:id', deleteArticle)

  // category
  router.get('/admin/category', showCategory)
  router.get('/admin/category/add', addCategory)
  router.post('/admin/category/add', postCategory)
  router.get('/admin/category/edit/:id', editCategory)
  router.post('/admin/category/edit/:id', postEditCategory)
  router.get('/admin/category/delete/:id', deleteCategory)

  // user get
  router.get('/login', login)
  router.get('/register', register)
  router.get('/logout', logout)
  router.get('/admin/user/password', fixPassworrd)
  router.get('/admin/user', userList)
  router.get('/admin/user/delete/:id', deleteUser)
  router.get('/admin/user/up/:id', upUser)
  router.get('/admin/user/down/:id', downUser)

  // user post
  router.post('/login', loginPost)
  router.post('/register', registerPost)
  router.post('/admin/user/password', postFixPassworrd)

  app.use(router.routes())
  app.use(router.allowedMethods())
}