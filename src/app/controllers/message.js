import mongoose from 'mongoose'
import { logJson } from '../../util'

const Message = mongoose.model('Message')

export const adminMess = async ctx => {
  try {
    const messages = await Message.find().populate('from').sort({ '_id': -1 })
    await ctx.render('backstage/message', {
      title: '留言管理',
      messages: messages
    })
  }catch(err){
    logJson(500, 'adminmess', 'blogzzc')
  }
}

export const deleteMess = async ctx => {
  try {
    const messageId = ctx.params.id
    await Message.deleteOne({ _id: messageId})
    ctx.response.redirect('/admin/message')
  }catch(err){
    logJson(500, 'deletemess', 'blogzzc')
  }
}