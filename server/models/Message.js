var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
  message: String,
  username: String,
  send_at: Date
})

module.exports = mongoose.model('Message', messageSchema, 'messages')
