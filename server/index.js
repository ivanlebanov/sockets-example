const express = require('express')
const consola = require('consola')
const mongoose = require('mongoose').set('debug', true)
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
var Message = require('./models/Message.js')
let io = '';
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
mongoose.connect('your_connection_string')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  let server = app.listen(port, host)
  io = require('socket.io').listen(server)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) {
      console.log(err)
    }
    return res.status(200).json(messages)
  })
})

app.post('/message', (req, res) => {
  const message = new Message({
    username: req.body.username,
    message: req.body.message,
    send_at: new Date().toString()
  })

  message.save(function (err, message) {
    if (err) {
      console.log(err)
    }
    io.emit('newMessage', message)
    return res.status(200).json({})
  })
})
