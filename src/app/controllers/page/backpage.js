// import mongoose from 'mongoose'
// import { logJson } from '../../../util'

// const Article = mongoose.model('Article')
// const Category = mongoose.model('Category')
// const User = mongoose.model('User')

// export const showArticles = async ctx => {
//   try{
//     const articles = await Article.find().populate('author').populate('category')
//     await ctx.render('backstage/acticle/index', {
//       title: '文章列表',
//       articles: articles
//     })
//   }catch(err){
//     console.log(err)
//     logJson(500, 'showarticles', 'blogzzc')
//   }
// }

// export const addArticle = async ctx => {
//   try {
//     await ctx.render('backstage/acticle/add', {
//         title: '添加文章',
//         //posts: post.slice(0,13)
//     })
//   }catch(err){
//     logJson(500, 'addarticle', 'blogzzc')
//   }
// }

// export const postArticle = async ctx => {
//   try {
//     console.log(ctx.request.body)
//     const opts = ctx.request.body
//     const title = opts.title.trim()
//     const userinfo = ctx.state.user
//     const article = new Article({
//       title: title,
//       content: opts.content,
//       imgurl: opts.imgsrc,
//       category: opts.category,
//       author: userinfo._id
//     })
//     await article.save()
//     ctx.response.redirect('/admin/article')
//   }catch(err){
//     logJson(500, 'postArticle', 'blogzzc')
//   }
// }