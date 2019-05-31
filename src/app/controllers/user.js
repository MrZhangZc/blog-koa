import mongoose from 'mongoose'
import { logJson } from '../../util'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
const User = mongoose.model('User')

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
    logJson(500, 'login', 'blogzzc')
  }
}

export const fixPassworrd = async ctx => {
  try {
    await ctx.render('backstage/user/fixpassword', {
      title: '更改密码'
    })
  } catch (err) {
    logJson(500, 'fixpassworrd', 'blogzzc')
  }
}

export const userList = async ctx => {
  try {
    const users = await User.find().sort({ '_id': -1 })
    await ctx.render('backstage/user/list', {
      title: '用户列表',
      users: users
    })
  } catch (err) {
    logJson(500, 'userlist', 'blogzzc')
  }
}

export const upUser = async ctx => {
  try {
    const userId = ctx.params.id
    const user = await User.findById(userId)
    if(user.role === '管理员'){
      const upUser = { $set: { role: '普通用户' } }
      await User.updateOne({ _id: userId }, upUser)
    }else{
      const upUser = { $set: { role: '管理员', headimg: '/images/me.jpg'} }
      await User.updateOne({ _id: userId }, upUser)
    }
    ctx.response.redirect('/admin/user')
  }catch(err){
    logJson(500, 'upuser', 'blogzzc')
  }
}

export const downUser = async ctx => {
  try {
    const userId = ctx.params.id
    const upUser = { $set: { role: '管理员' } }
    await User.updateOne({ _id: userId }, upUser)
    ctx.response.redirect('/admin/user')
  }catch(err){
    logJson(500, 'upuser', 'blogzzc')
  }
}

export const logout = async ctx => {
  delete ctx.session.user
  delete ctx.state.user

  ctx.response.redirect('/')
}

export const deleteUser = async ctx => {
  try {
    const userId = ctx.params.id
    await User.deleteOne({ _id: userId })
    ctx.response.redirect('/admin/user')
  } catch (err) {
    logJson(500, 'deleteuser', 'blogzzc')
  }
}

//POST
export const registerPost = async ctx => {
  try{
    const opts = ctx.request.body
    const sex = opts.sex
    let imgurl = ''
    if(sex === '男'){
      imgurl = '/images/boy.png'
    }else{
      imgurl = '/images/girl.png'
    }
    const auser = await User.findOne({ nickname: opts.nickname })
    if(auser !== null){
      throw new Error('用户已存在,请更换用户名重新注册')
    }
    if(opts.password !== opts.cpassword){
      throw new Error('两次输入密码不同，请检查后重试')
    }else{
      const user = new User({
        nickname: opts.nickname,
        sex: opts.sex,
        password: opts.password,
        email: opts.email,
        headimg: imgurl,
        autograph: opts.autograph
      })
      await user.save()
      logJson(300, 'registersucess', 'blogzzc')
      ctx.response.redirect('/login')
    }
  }catch(err){
    logJson(500, 'register', 'blogzzc')
    await ctx.render('onstage/register', {
      err: err.message
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
        err: err.message
      })
  }
}

export const postFixPassworrd = async ctx => {
  try {
    const opts = ctx.request.body
    const userId = ctx.session.user._id
    const user = await User.findById(userId)
    if(!await user.conparePassword(opts.oldpassword)){
      throw new Error('原密码错误，请检查后重新输入')
    }else{
      if(opts.newpassword !== opts.fixpassword){
        throw new Error('两次设置密码不相同，请检查后重新输入')
      }
      const salt = await bcrypt.genSalt(10)
      const md5Password = await bcrypt.hash(opts.newpassword, salt)
      const upPass = { $set: { password: md5Password } }
      await User.updateOne({ _id:userId }, upPass)
      const info = '密码修改成功'
      await ctx.render('backstage/user/fixpassword', {
        title: '更改密码',
        info: info
      })
    }
  } catch (err) {
    const errInfo = err.message
    await ctx.render('backstage/user/fixpassword', {
      title: '更改密码',
      err: errInfo
    })
  }
}
export const load = async ctx => {
  try {
    const file = ctx.request.body.file
    const filename = ctx.request.body.filename

    const render = fs.createReadStream('./');
    let filePath = path.join('/upload/',filename+'.png');
    const fileDir = path.join('/upload/');
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, err => {
      });
    }
    // 创建写入流
    const upStream = fs.createWriteStream(filePath);
    render.pipe(upStream);
    //console.log('上传成功')
    // const userId = ctx.params.id
    // await User.deleteOne({ _id: userId })
    // ctx.response.redirect('/admin/user')
  } catch (err) {
    logJson(500, 'deleteuser', 'blogzzc')
  }
}
//权限
export const signinRequired = async (ctx, next) => {
  let user = ctx.session.user
  if(user){
    await next()
  }else{
    ctx.response.redirect('/')
  }
}

export const adminRequired = async (ctx,next) => {
  let user = ctx.session.user
  if(user.role === '管理员'){
    await next()
  }else{
    ctx.response.redirect('/')
  }
}

