import { logJson } from '../../../util'

//首页
export const home = async ctx => {
  try {
    logJson(300, 'someonein', 'blogzzc')
    await ctx.render('onstage/home', {
      title: 'zzc博客'
    })
  }catch(err){
    logJson(500, 'home', 'blogzzc')
  }
}