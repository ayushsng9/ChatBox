const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenDetails = async(token)=>{
    if(!token){
        return{
            message: "session ended",
            logout:true
        }
    }
    
    const userData = await jwt.verify(token,process.env.TOKEN_SECRET);
    const user = await User.findById(userData.id).select('-password');
    return user;
}

module.exports = tokenDetails;

