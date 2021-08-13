import mongoose from 'mongoose'
const Schema = mongoose.Schema

const BlogsyStemLogSchema = new Schema({
  type: String,
  article: String,
  ip: String,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

BlogsyStemLogSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = this.updatedAt = Date.now()
  } else {
    this.updatedAt = Date.now()
  }
  next()
})

mongoose.model('BlogsyStemLog', BlogsyStemLogSchema)
