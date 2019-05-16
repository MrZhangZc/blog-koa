import { logJson } from '../../../util'

//首页 '/'
export const home = async ctx => {
  try {
    logJson(300, 'someonein', 'blogzzc')
    // ctx.state.user = _user
    // ctx.state.moment = moment
    // ctx.state.truncate = truncate
    // let post = await Post.find().sort({ '_id': -1 })
    await ctx.render('onstage/home', {
        title: 'zzc博客',
        //posts: post.slice(0,13)
    })
  }catch(err){
    logJson(500, 'home', 'blogzzc')
  }
}

export const login = async ctx => {
  try {
    //logJson(300, '有人访问了', 'blogzzc')
    // console.log('user in session')
    // console.log(ctx.session.user)
    // let _user = ctx.session.user
    // ctx.state.user = _user
    // ctx.state.moment = moment
    // ctx.state.truncate = truncate
    // let post = await Post.find().sort({ '_id': -1 })
    await ctx.render('onstage/login', {
        title: '登陆',
        //posts: post.slice(0,13)
    })
  }catch(err){
    logJson(500, 'login', 'blogzzc')
  }
}
