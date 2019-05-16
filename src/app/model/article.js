import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title: String,
  content: String,
  imgurl: String,
  slug: String,
  category: { 
    type: ObjectId, 
    ref:'Category' 
  },
  author: { 
    type: ObjectId, 
    ref:'User' 
  },
  comments: {
    type: ObjectId, 
    ref:'Comment'
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

ArticleSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Article', ArticleSchema)