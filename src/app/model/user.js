import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  nikename: String,
  password: String,
  headimg: {
    type: String,
    default: '/images/head.jpg'
  },
  rank: {
    type: Number,
    default: 0
  },
  sex: {
    type: String,
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

UserSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

UserSchema.pre('save', next => {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(this.password, salt, function (err, hash) {
      if (err) return next(err)

      this.password = hash
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