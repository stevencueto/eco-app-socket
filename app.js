
   
require('dotenv').config()
const Server = require('socket.io')
const PORT = process.env.PORT || 3002;
const io = Server(PORT, {
    cors: {
        origin: ["*"],
        methods: ["GET", "POST"],

        // allowedHeaders: ["my-custom-header"],
        // credentials: true
      }
});


const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, { useNewUrlParser: true},
    () => console.log('MongoDB connection established:', mongoURI)
    )
    
    // Error / Disconnection
const db = mongoose.connection
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected', mongoURI))
io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})
