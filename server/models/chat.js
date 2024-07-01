const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },

    receiver:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },

    messages:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Message'
        }
    ]
},{
    timestamps:true
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;