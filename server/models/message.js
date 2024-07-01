const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text:{
        type:String,
        default:true
    },

    image:{
        type:String,
        default : ""
    },

    video:{
        type:String,
        default : ""
        },
    
    seen:{
        type:Boolean,
        default:false
    },
    msgByUserId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"

    }
},{
    timestamps:true
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;