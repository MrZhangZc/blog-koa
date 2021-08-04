const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MessageSchema = new mongoose.Schema({
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

MessageSchema.pre('save', function(next) {
	if(this.isNew) {
		this.createAt = this.updateAt = Date.now()
	}else{
		this.updateAt = Date.now()
	}
	next()
})

mongoose.model('Message', MessageSchema)