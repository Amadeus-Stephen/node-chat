const mongoose = require("mongoose")
const moment = require('moment');
let now = moment().format('h:mm a')
const messageSchema = new mongoose.Schema({
    chat: { type : String , required: true},
    username: {type : String , required : true},
    text: {type: String , required : true},
    time: {type:String , default: now , required: true}
})
module.exports = mongoose.model("Message", messageSchema )