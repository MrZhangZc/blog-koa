import Router from 'koa-router'
import { home, article, personal, messageBoard, aboutMe, message, messageReply, reply, getCategoryPost, uv } from '../app/controllers/frontpage'
import { login, loginPost, register, registerPost, logout, fixPassworrd, postFixPassworrd, userList, deleteUser, upUser, downUser, load } from '../app/controllers/user'
import { showArticles, addArticle, postArticle,editArticle, postEditArticle, publishdArticle, upload, deleteArticle, comment, trueDeleteArticle} from '../app/controllers/article'
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
  router.get('/article/:slug', article)
  router.get('/personal', personal)
  router.get('/messageBoard', messageBoard)
  router.get('/aboutMe', aboutMe)
  router.post('/message', message)
  router.get('/message/reply/:id', messageReply)
  router.post('/reply/:id', reply)

  router.post('/upload', upload)

  //article
  router.get('/admin/article', signinRequired, adminRequired, showArticles)
  router.get('/admin/article/add', signinRequired, adminRequired, addArticle)
  router.post('/admin/article/add', signinRequired, adminRequired, postArticle)
  router.get('/admin/article/edit/:id', signinRequired, adminRequired, editArticle)
  router.post('/admin/article/edit/:id', signinRequired, adminRequired, postEditArticle)
  router.get('/admin/article/publishd/:id', signinRequired, adminRequired, publishdArticle)
  router.get('/admin/article/delete/:id', signinRequired, adminRequired, deleteArticle)
  router.get('/admin/article/trueDelete/:id', signinRequired, adminRequired, trueDeleteArticle)
  router.post('/comment/:id', comment)

  // category front
  router.get('/category/:id', getCategoryPost)

  // category admin
  router.get('/admin/category', signinRequired, adminRequired, showCategory)
  router.get('/admin/category/add', signinRequired, adminRequired, addCategory)
  router.post('/admin/category/add', signinRequired, adminRequired, postCategory)
  router.get('/admin/category/edit/:id', signinRequired, adminRequired, editCategory)
  router.post('/admin/category/edit/:id', signinRequired, adminRequired, postEditCategory)
  router.get('/admin/category/delete/:id', signinRequired, adminRequired, deleteCategory)

  //message
  router.get('/admin/message', signinRequired, adminRequired, adminMess)
  router.get('/admin/message/delete/:id', signinRequired, adminRequired, deleteMess)

  // user get
  router.get('/login', login)
  router.get('/register', register)
  router.get('/logout', logout)
  router.get('/admin/user/password', signinRequired, adminRequired, fixPassworrd)
  router.get('/admin/user/cog', signinRequired, adminRequired, fixPassworrd)
  router.get('/admin/user', signinRequired, adminRequired, userList)
  router.get('/admin/user/delete/:id', signinRequired, adminRequired, deleteUser)
  router.get('/admin/user/up/:id', signinRequired, adminRequired, upUser)
  router.get('/admin/user/down/:id', signinRequired, adminRequired, downUser)

  // user post
  router.post('/login', loginPost)
  router.post('/register', registerPost)
  router.post('/admin/user/password', signinRequired, adminRequired, postFixPassworrd)
  router.post('/load', signinRequired, adminRequired, load)

  router.get('/admin/uv', signinRequired, adminRequired, uv)

  app.use(router.routes())
  app.use(router.allowedMethods())
}
