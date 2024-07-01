const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: 
    {
        type:String,
        required:[true,'Name cannot be empty']
    },

    email:{
        type:String,
        required:[true,'email cannot be empty'],
        unique:true
    },

    password:{
      type:String,
      required:[true,'password cannot be empty'],
  },

    image:{
        type:String,
        default:""
    }

  },{
    timestamps:true
  });

const User = mongoose.model('User', userSchema);

module.exports = User;