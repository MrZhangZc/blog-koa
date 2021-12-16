const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BannerSchema = new Schema({
  title: String,
  desc: String,
  pic_path: String,
  post_path: String,
  rank: String,
  createdAt: Date,
  updatedAt: Date
})

mongoose.model('Banner', BannerSchema)