import mongoose from 'mongoose'
import { logJson } from '../../../util'

const Article = mongoose.model('Article')
const Category = mongoose.model('Category')
const User = mongoose.model('User')

export const addArticle = async ctx => {
  try {
    await ctx.render('backstage/acticle/add', {
        title: '添加文章',
        //posts: post.slice(0,13)
    })
  }catch(err){
    logJson(500, 'addarticle', 'blogzzc')
  }
}

export const postArticle = async ctx => {
  try {
    const opts = ctx.request.body
    const title = opts.title.trim()
    const userinfo = ctx.state.user
    const article = new Article({
      title: title,
      content: opts.content,
      imgurl: opts.imgsrc,
      category: opts.category,
      author: userinfo._id
    })
    await article.save()
    ctx.response.redirect('/article/add')
  }catch(err){
    logJson(500, 'postArticle', 'blogzzc')
  }
}

export const addCategory = async ctx => {
  try {
    await ctx.render('backstage/addcategory', {
      title: '添加文章类别',
    })
  }catch(err){
    logJson(500, 'addcategory', 'blogzzc')
  }
}

export const postCategory = async ctx => {
  try {
    const opts = ctx.request.body
    const category = new Category({
      name: opts.name
    })
    await category.save()
    ctx.response.redirect('/article/category/add')
  }catch(err){
    logJson(500, 'postCategory', 'blogzzc')
  }
}