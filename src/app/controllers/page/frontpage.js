import mongoose from 'mongoose'
import { logJson } from '../../../util'

const User = mongoose.model('User')
const Article = mongoose.model('Article')
const Message = mongoose.model('Message')
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

export const message = async ctx => {
  try {
    const userId = ctx.session.user._id
    const content = ctx.request.body.content
    const message = await new Message({
      from: userId,
      content: content
    })
    await message.save()
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
    // const messages = await Message.find().populate('from')
    const upReply = { $push: { reply: { from: userId , content: replyContent } } }
    await Message.updateOne({ _id: messageId }, upReply)
    ctx.response.redirect('/messageBoard')
    // const articleId = ctx.params.id
    // const user = ctx.state.user
    // const postComment = ctx.request.body.comment

    // const comment = await new Comment({
    //   from: user._id,
    //   content: postComment
    // })
    // console.log(comment)
    // await comment.save()
    // const upComment = { $push: { comments: comment._id } }
    // await Article.updateOne({ _id:articleId }, upComment)
    
  }catch(err){
    logJson(500, 'messagereply', 'blogzzc')
  }
}