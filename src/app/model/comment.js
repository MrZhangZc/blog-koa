const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new mongoose.Schema({
	content: String,
	email: String,
	createdAt:{
		type:Date,
		default: Date.now()
	},
	updatedAt:{
		type:Date,
		default: Date.now()
	}
})

CommentSchema.pre('save', function(next) {
	if(this.isNew) {
		this.createdAt = this.updatedAt = Date.now()
	}else{
		this.updatedAt = Date.now()
	}
	next()
})

mongoose.model('Comment', CommentSchema)