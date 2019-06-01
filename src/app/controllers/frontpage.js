import mongoose from 'mongoose'
import { logJson } from '../../util'

const User = mongoose.model('User')
const Article = mongoose.model('Article')
const Message = mongoose.model('Message')
const Category = mongoose.model('Category')
//首页
export const home = async ctx => {
  try {
    logJson(300, 'someonein', 'blogzzc')
    const articles = await Article.find({ publishd: true }).populate('author').populate('category').sort({ '_id': -1 })
    await ctx.render('onstage/home', {
      title: 'zzc博客',
      articles: articles
    })
  }catch(err){
    logJson(500, 'home', 'blogzzc')
  }
}

export const article = async ctx => {
  try {
    const articleId = ctx.params.id
    const article = await Article.findById(articleId).populate('author').populate('category').populate({ path: 'comments' ,populate: {path: 'from'}}).sort({ '_id': -1 })
    if(article.abbreviation){
      logJson(300, article.abbreviation, 'blogzzc')
    }
    await ctx.render('onstage/article', {
      title: 'zzc博客',
      article: article
    })
    const addOne = { $inc: { lookTimes: 1} }
    await Article.updateOne({ _id: articleId }, addOne)
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
    const articles = await Article.find({ publishd: true,  category: categoryId}).populate('author').populate('category').sort({ '_id': -1 })
    await ctx.render('onstage/home', {
      title: `${category.name}类别`,
      articles: articles,
      cate: category
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