import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const VisitorSchema = new Schema({
  ip: String,
  province: {
    type: String,
    default: '未知'
  },
  city: {
    type: String,
    default: '未知'
  },
  adcoce: String,
  agent: String,
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

VisitorSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Visitor', VisitorSchema)
