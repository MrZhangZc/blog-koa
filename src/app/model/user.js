import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  nickname: String,
  password: String,
  email: String,
  headimg: {
    type: String,
    default: '/images/head.jpg'
  },
  sex: {
    type: String,
    default: '男'
  },
  role: {
    type:String,
    default: '普通用户'
  },
  autograph: {
    type: String,
    default: '暂时还没有签名'
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

UserSchema.pre('save', function (next) {
  let user = this
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  async conparePassword(_password) {
    let userpassword = await bcrypt.compare(_password, this.password)
    return userpassword
  }
}

mongoose.model('User', UserSchema)