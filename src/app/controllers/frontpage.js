import mongoose from 'mongoose'
import { logJson } from '../../util'
import redisClient from '../../redis'

import { KEY } from '../../util/key'

const User = mongoose.model('User')
const Article = mongoose.model('Article')
const Message = mongoose.model('Message')
const Category = mongoose.model('Category')

export const home = async ctx => {
  try {
    logJson(300, 'someonein', 'blogzzc')
    const conditions = { publishd:true }
    if(ctx.query.keyword){
      Object.assign(conditions, { content: new RegExp(ctx.query.keyword.trim(), 'i') })
    }
    const articles = await Article.find(conditions).populate('author').populate('category').sort({ '_id': -1 })
    const scores = await redisClient.zrange(KEY.Article_LookTime, 0, -1, "WITHSCORES");
    const articleRank = await redisClient.zrevrange(KEY.Article_LookTime, 0, 4, "WITHSCORES")

    let pageNum = Math.abs(parseInt(ctx.query.page || 1, 10))
    const pageSize = 5
    const totalCount = articles.length
    let pageCount = Math.ceil(totalCount / pageSize)
    await ctx.render('onstage/home', {
      title: 'zzc博客',
      articles: articles.slice((pageNum -1) * pageSize,pageNum * pageSize),
      allarticles: articles,
      pageNum:pageNum,
      pageCount:pageCount,
      watch: scores,
      articleRank: articleRank
    })
  }catch(err){
    logJson(500, 'home', 'blogzzc')
  }
}

export const article = async ctx => {
  try {
    const articleSlug = ctx.params.slug
    const conditions = { slug: articleSlug }
    const article = await Article.findOne(conditions).populate('author').populate('category').populate({ path: 'comments' ,populate: {path: 'from'}}).sort({ '_id': -1 })
    if(article.abbreviation){
      logJson(300, article.abbreviation, 'blogzzc')
    }
    const score = await redisClient.zscore(KEY.Article_LookTime, article.title) || 0;
    const newScore = await redisClient.multi().zadd(KEY.Article_LookTime, Number(score) + 1, article.title).zscore(KEY.Article_LookTime, article.title).exec();
    await ctx.render('onstage/article', {
      title: 'zzc博客',
      article: article,
      watch: newScore[1][1]
    })
  }catch(err){
    logJson(500, 'article', 'blogzzc')
  }
}

export const aboutMe = async ctx => {
  try {
    await ctx.render('onstage/aboutme', {
      title: '关于我'
    })
  }catch(err){
    logJson(500, 'aboutme', 'blogzzc')
  }
}

export const personal = async ctx => {
  try {
    const cuser = ctx.session.user
    const user = await User.findById(cuser._id)
    await ctx.render('onstage/personal', {
      title: '个人中心',
      tuser: user
    })
  }catch(err){
    logJson(500, 'personal', 'blogzzc')
  }
}

export const messageBoard = async ctx => {
  try {
    const messages = await Message.find().populate('from').populate('reply.from').sort({ '_id': -1 })
    const action = '/message'
    await ctx.render('onstage/messageBoard', {
      title: '留言板',
      messages: messages,
      action: action
    })
  }catch(err){
    logJson(500, 'messageboard', 'blogzzc')
  }
}

export const getCategoryPost = async ctx => {
  try{
    const categoryId = ctx.params.id
    const category = await Category.findById(categoryId)
    const conditions = { publishd:true, category: categoryId }
    if(ctx.query.keyword){
      Object.assign(conditions, { content: new RegExp(ctx.query.keyword.trim(), 'i') })
    }
    const articles = await Article.find(conditions).populate('author').populate('category').sort({ '_id': -1 })
    let pageNum = Math.abs(parseInt(ctx.query.page || 1, 10))
    const pageSize = 5
    const totalCount = articles.length
    let pageCount = Math.ceil(totalCount / pageSize)
    await ctx.render('onstage/home', {
      title: `${category.name}类别`,
      cate: category,
      articles: articles.slice((pageNum -1) * pageSize,pageNum * pageSize),
      allarticles: articles,
      pageNum:pageNum,
      pageCount:pageCount
    })
  }catch(err){
    logJson(500, 'getcategorypost', 'blogzzc')
  }
}

export const message = async ctx => {
  try {
    const userId = ctx.session.user._id
    const content = ctx.request.body.content
    const message = await new Message({
      from: userId,
      content: content
    })
    await message.save()
    logJson(300, 'newmessage', 'blogzzc')
    ctx.response.redirect('/messageBoard')
  }catch(err){
    logJson(500, 'message', 'blogzzc')
  }
}

export const messageReply = async ctx => {
  try {
    const messageId = ctx.params.id
    const messages = await Message.find().populate('from').populate('reply.from').sort({ '_id': -1 })
    const action = `/reply/${messageId}`
    await ctx.render('onstage/messageBoard', {
      title: '留言板',
      messages: messages,
      action: action
    })
  }catch(err){
    logJson(500, 'messagereply', 'blogzzc')
  }
}

export const reply = async ctx => {
  try {
    const userId = ctx.session.user._id
    const replyContent = ctx.request.body.content
    const messageId = ctx.params.id
    const upReply = { $push: { reply: { from: userId , content: replyContent } } }
    await Message.updateOne({ _id: messageId }, upReply)
    ctx.response.redirect('/messageBoard')
  }catch(err){
    logJson(500, 'messagereply', 'blogzzc')
  }
}
