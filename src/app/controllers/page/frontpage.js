import mongoose from 'mongoose'
import { logJson } from '../../../util'

const Article = mongoose.model('Article')
//首页
export const home = async ctx => {
  try {
    logJson(300, 'someonein', 'blogzzc')
    const articles = await Article.find().populate('author').populate('category').sort({ '_id': -1 })
    await ctx.render('onstage/home', {
      title: 'zzc博客',
      articles: articles
    })
  }catch(err){
    logJson(500, 'home', 'blogzzc')
  }
}