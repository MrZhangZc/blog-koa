import mongoose from 'mongoose'
import { logJson } from '../../util'

const Article = mongoose.model('Article')
const Category = mongoose.model('Category')
const User = mongoose.model('User')
const Comment = mongoose.model('Comment')

export const showArticles = async ctx => {
  try{
    const articles = await Article.find().populate('author').populate('category')
    await ctx.render('backstage/article/index', {
      title: '文章列表',
      articles: articles
    })
  }catch(err){
    logJson(500, 'showarticles', 'blogzzc')
  }
}

export const addArticle = async ctx => {
  try {
    await ctx.render('backstage/article/add', {
        title: '添加文章',
        //posts: post.slice(0,13)
    })
  }catch(err){
    logJson(500, 'addarticle', 'blogzzc')
  }
}

export const postArticle = async ctx => {
  try {
    console.log(ctx.request.body)
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
    ctx.response.redirect('/admin/article')
  }catch(err){
    logJson(500, 'postArticle', 'blogzzc')
  }
}

export const editArticle = async ctx=> {
  try {
    const article_id = ctx.params.id
    const article = await Article.findById(article_id).populate('category')
    await ctx.render('backstage/article/edit', {
      title: '修改文章',
      article: article
    })
  }catch(err){
    logJson(500, 'editarticle', 'blogzzc')
  }
}

export const postEditArticle = async ctx => {
  try {
    const article_id = ctx.params.id
    const opts = ctx.request.body
    const upTitle = { $set: { title: opts.title } }
    const upCate  = { $set: { category: opts.category } }
    const upCon   = { $set: { content: opts.content } }
    await Article.updateOne({ _id:article_id }, upTitle)
    await Article.updateOne({ _id:article_id }, upCate)
    await Article.updateOne({ _id:article_id }, upCon)
    ctx.response.redirect('/admin/article')
  }catch(err){ 
    logJson(500, 'editarticle', 'blogzzc')
  }
}

export const deleteArticle = async ctx => {
  try {
    const article_id = ctx.params.id
    const upPub = { $set: { publishd: false } }
    await Article.updateOne({ _id:article_id }, upPub)
    ctx.response.redirect('/admin/article')
  }catch(err){
    logJson(500, 'deletearticle', 'blogzzc')
  }
}

export const publishdArticle = async ctx => {
  try {
    const article_id = ctx.params.id
    const upPub = { $set: { publishd: true } }
    await Article.updateOne({ _id:article_id }, upPub)
    ctx.response.redirect('/admin/article')
  }catch(err){
    logJson(500, 'publishdarticle', 'blogzzc')
  }
}

export const comment = async ctx => {
  try {
    const articleId = ctx.params.id
    const user = ctx.state.user
    const postComment = ctx.request.body.comment

    const comment = await new Comment({
      from: user._id,
      content: postComment
    })
    console.log(comment)
    await comment.save()
    const upComment = { $push: { comments: comment._id } }
    await Article.updateOne({ _id:articleId }, upComment)
    ctx.response.redirect('/article/' + articleId)
  }catch(err){
    logJson(500, 'comment', 'blogzzc')
  }
}