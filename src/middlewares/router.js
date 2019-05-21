import Router from 'koa-router'
import { home, article, personal, messageBoard, message, messageReply, reply } from '../app/controllers/page/frontpage'
import { login, loginPost, register, registerPost, logout, fixPassworrd, postFixPassworrd, userList, deleteUser, upUser, downUser, load } from '../app/controllers/user'
import { showArticles, addArticle, postArticle,editArticle, postEditArticle, publishdArticle, deleteArticle, comment} from '../app/controllers/article'
import { showCategory, addCategory, postCategory, editCategory, postEditCategory, deleteCategory} from '../app/controllers/category'
import { adminMess, deleteMess } from '../app/controllers/message'
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
  router.get('/personal', personal)
  router.get('/messageBoard', messageBoard)
  router.post('/message', message)
  router.get('/message/reply/:id', messageReply)
  router.post('/reply/:id', reply)

  //article
  router.get('/admin/article', adminRequired, showArticles)
  router.get('/admin/article/add', adminRequired, addArticle)
  router.post('/admin/article/add', adminRequired, postArticle)
  router.get('/admin/article/edit/:id', adminRequired, editArticle)
  router.post('/admin/article/edit/:id', adminRequired, postEditArticle)
  router.get('/admin/article/publishd/:id', adminRequired, publishdArticle)
  router.get('/admin/article/delete/:id', adminRequired, deleteArticle)
  router.post('/comment/:id', comment)

  // category
  router.get('/admin/category', adminRequired, showCategory)
  router.get('/admin/category/add', adminRequired, addCategory)
  router.post('/admin/category/add', adminRequired, postCategory)
  router.get('/admin/category/edit/:id', adminRequired, editCategory)
  router.post('/admin/category/edit/:id', adminRequired, postEditCategory)
  router.get('/admin/category/delete/:id', adminRequired, deleteCategory)

  //message
  router.get('/admin/message', adminRequired, adminMess)
  router.get('/admin/message/delete/:id', adminRequired, deleteMess)

  // user get
  router.get('/login', login)
  router.get('/register', register)
  router.get('/logout', logout)
  router.get('/admin/user/password', adminRequired, fixPassworrd)
  router.get('/admin/user', adminRequired, userList)
  router.get('/admin/user/delete/:id', adminRequired, deleteUser)
  router.get('/admin/user/up/:id', adminRequired, upUser)
  router.get('/admin/user/down/:id', adminRequired, downUser)

  // user post
  router.post('/login', loginPost)
  router.post('/register', registerPost)
  router.post('/admin/user/password', adminRequired, postFixPassworrd)
  router.post('/load', adminRequired, load)

  app.use(router.routes())
  app.use(router.allowedMethods())
}