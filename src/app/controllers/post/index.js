import mongoose from 'mongoose'
const User = mongoose.model('User')
import { logJson } from '../../../util'

// GET
export const register = async ctx => {
  try {
    await ctx.render('onstage/register', {
      title: '注册'
    })
  } catch (err) {
    logJson(500, '注册出错', 'blogzzc')
  }
}

export const login = async ctx => {
  try {
    await ctx.render('onstage/login', {
      title: '登录'
    })
  } catch (err) {
    logJson(500, '登录出错', blogzzc)
  }
}

//POST
export const registerPost = async ctx => {
  try{
    const opts = ctx.request.body.user
    const auser = await User.findOne({ name: opts.name })
    if(auser !== null){
      throw new Error('用户已存在')
    }
    const user = new User(opts)
    await user.save()
    ctx.response.redirect('/login')
  }catch(err){
    logJson(500, '博客注册页出错', 'blogzzc')
    const errinfo = '用户已存在'
    await ctx.render('onstage/register', {
      title: '注册',
      errinfo: errinfo
    })
  }
}

export const loginPost = async ctx => {
  try {
    const opts = ctx.request.body.user
    const name = opts.name
    const password = opts.password

    const _user = await User.findOne({ name: name })
    const trueuser = await _user.conparePassword(password)

    if (trueuser) {
      // ctx.session.user = {
      //   _id: zzc._id,
      //   name: zzc.name,
      //   role: zzc.role,
      //   sex : zzc.sex
      // }
      // console.log('session中的用户', ctx.session)
      ctx.response.redirect('/')
    }else{
      throw new Error('用户名或密码出错,请重新填写')
    }

} catch (err) {
    logJson(500, '登录出错', blogzzc)
    const errinfo = '用户名或密码出错,请重新填写'
    await ctx.render('onstage/login', {
      errinfo: errinfo
    })
  }
}