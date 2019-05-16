import { logJson } from '../../../util'

export const addArticle = async ctx => {
  try {
    //console.log(ctx.request.body)
    // ctx.state.user = _user
    // ctx.state.moment = moment
    // ctx.state.truncate = truncate
    // let post = await Post.find().sort({ '_id': -1 })
    await ctx.render('backstage/addacticle', {
        title: '添加文章',
        //posts: post.slice(0,13)
    })
  }catch(err){
    console.log(err)
    logJson(500, 'addarticle', 'blogzzc')
  }
}

export const postArticle = async ctx => {
  try {
    console.log(ctx.request.body)
    // ctx.state.user = _user
    // ctx.state.moment = moment
    // ctx.state.truncate = truncate
    // let post = await Post.find().sort({ '_id': -1 })
    // await ctx.render('backstage/addacticle', {
    //     title: '添加文章',
    //     //posts: post.slice(0,13)
    // })
  }catch(err){
    console.log(err)
    logJson(500, 'addarticle', 'blogzzc')
  }
}