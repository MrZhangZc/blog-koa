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
    logJson(500, 'register', 'blogzzc')
  }
}

export const login = async ctx => {
  try {
    await ctx.render('onstage/login', {
      title: '登录'
    })
  } catch (err) {
    logJson(500, 'login', blogzzc)
  }
}

//POST
export const registerPost = async ctx => {
  try{
    const opts = ctx.request.body.user
    const auser = await User.findOne({ nickname: opts.nickname })
    if(auser !== null){
      throw new Error('用户已存在,请更换用户名重新注册')
    }
    const user = new User(opts)
    await user.save()
    ctx.response.redirect('/login')
  }catch(err){
    logJson(500, 'register', 'blogzzc')
    await ctx.render('onstage/register', {
      errinfo: err.message
    })
  }
}

export const loginPost = async ctx => {
  try {
    const opts = ctx.request.body.user
    const nickname = opts.nickname
    const password = opts.password

    const _user = await User.findOne({ nickname: nickname })
    const trueuser = await _user.conparePassword(password)
    
    if (trueuser) {
      ctx.session.user = {
        _id: _user._id,
        nickname: _user.nickname,
        role: _user.role,
        sex : _user.sex
      }
      logJson(300, 'userloginsuccess', 'blogzzc')
      ctx.response.redirect('/')
    }else{
      throw new Error('用户名或密码出错,请重新填写')
    }
  } catch (err) {
      logJson(500, 'login', 'blogzzc')
      await ctx.render('onstage/login', {
        errinfo: err.message
      })
  }
}