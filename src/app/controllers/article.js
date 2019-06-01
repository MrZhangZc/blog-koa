import mongoose from 'mongoose'
import { logJson } from '../../util'

const Article = mongoose.model('Article')
const User = mongoose.model('User')
const Comment = mongoose.model('Comment')

export const showArticles = async ctx => {
  try{
    let sortby = ctx.query.sortby ? ctx.query.sortby : 'meta.createdAt'
    let sortdir = ctx.query.sortdir ? ctx.query.sortdir : 'desc'
    if(['lookTimes', 'category', 'meta.createdAt', 'publishd'].indexOf(sortby) === -1){
      sortby = 'meta.createdAt'
    } 

    if(['desc', 'asc'].indexOf(sortdir) === -1){
      sortdir = 'desc'
    }

    let sortObj = {}
    sortObj[sortby] = sortdir

    const articles = await Article.find().sort(sortObj).populate('author').populate('category').sort({ '_id': -1 })
    await ctx.render('backstage/article/index', {
      title: '文章列表',
      articles: articles,
      sortdir:sortdir,
      sortby:sortby,
    })
  }catch(err){
    logJson(500, 'showarticles', 'blogzzc')
  }
}

export const addArticle = async ctx => {
  try {
    await ctx.render('backstage/article/add', {
        title: '添加文章',
    })
  }catch(err){
    logJson(500, 'addarticle', 'blogzzc')
  }
}

export const postArticle = async ctx => {
  try {
    const opts = ctx.request.body
    const title = opts.title.trim()
    const abbreviation = opts.abbreviation.trim()
    const userinfo = ctx.state.user
    const tags = opts.tags.split(',')
    const article = new Article({
      title: title,
      abbreviation: abbreviation,
      content: opts.content,
      tags: tags,
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
    const upImg   = { $set: { imgurl: opts.imgsrc } }
    await Article.updateOne({ _id:article_id }, upTitle)
    await Article.updateOne({ _id:article_id }, upCate)
    await Article.updateOne({ _id:article_id }, upCon)
    await Article.updateOne({ _id:article_id }, upImg)
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
    const article = await Article.findById(articleId)
    const comment = await new Comment({
      from: user._id,
      content: postComment
    })
    await comment.save()
    const upComment = { $push: { comments: comment._id } }
    await Article.updateOne({ _id:articleId }, upComment)
    logJson(300, 'newcomment', article.abbreviation)
    ctx.response.redirect('/article/' + articleId)
  }catch(err){
    logJson(500, 'comment', 'blogzzc')
  }
}