import mongoose from 'mongoose'
import { logJson } from '../../util'

const Article = mongoose.model('Article')
const Category = mongoose.model('Category')

export const showCategory = async ctx => {
  try{
    const articles = await Article.find().populate('author').populate('category')
    await ctx.render('backstage/category/index', {
      title: '文章类别',
      articles: articles
    })
  }catch(err){
    logJson(500, 'showcategory', 'blogzzc')
  }
}

export const addCategory = async ctx => {
  try {
    await ctx.render('backstage/category/add', {
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
      name: opts.name,
      abbreviation: opts.abbreviation
    })
    await category.save()
    ctx.response.redirect('/admin/category')
  }catch(err){
    logJson(500, 'postCategory', 'blogzzc')
  }
}

export const editCategory = async ctx=> {
  try {
    const category_id = ctx.params.id
    const category = await Category.findById(category_id)
    await ctx.render('backstage/category/edit', {
      title: '修改分类',
      category: category
    })
  }catch(err){
    logJson(500, 'editcategory', 'blogzzc')
  }
}

export const postEditCategory = async ctx => {
  try {
    const category_id = ctx.params.id
    const category_name = ctx.request.body.name
    const abbreviation = ctx.request.body.abbreviation
    const update = { $set: { name: category_name, abbreviation: abbreviation } }
    await Category.updateOne({ _id:category_id }, update)
    ctx.response.redirect('/admin/category')
  }catch(err){ 
    logJson(500, 'editcategory', 'blogzzc')
  }
}

export const deleteCategory = async ctx => {
  try {
    const category_id = ctx.params.id
    const article = await Article.find({ category: category_id})
    if(article.length !== 0){
      throw new Error('该分类下存在文章，分类不可删除')
    }else{
      await Category.deleteOne({ _id: category_id})
      const info = '删除成功'
      await ctx.render('backstage/category/index', {
        title: '文章分类',
        info: info
      })
      ctx.response.redirect('/admin/category')
    }
  }catch(err){
    await ctx.render('backstage/category/index', {
      title: '文章分类',
      info: err.message
    })
    logJson(500, 'deletecategory', 'blogzzc')
  }
}