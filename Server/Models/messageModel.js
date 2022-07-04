const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    message: {type: String, required: [true,"Please enter a message"]},
    Sender: {type: mongoose.SchemaTypes.ObjectId, ref:"users"},
    Receiver: {type: mongoose.SchemaTypes.ObjectId, ref: "doctors"},
    replier: {type: mongoose.SchemaTypes.ObjectId, ref:"doctors"},
    recipient: {type: mongoose.SchemaTypes.ObjectId, ref: "users"}
}, {timestamp: true})


const messageModel = mongoose.model("Message", messageSchema)
module.exports = messageModel