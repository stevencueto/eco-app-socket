const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    data: {
      type: Schema.Types.Mixed,
    },
    users: [String]
},{timestamps: true})


const Chat = mongoose.model('chat', chatSchema)
module.exports = Chat;