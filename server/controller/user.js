const appError = require('../utilities/appError');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const tokenDetails = require('../helpers/tokenDetails');


module.exports.registerNewUser = async(req,res)=>{
    const {name,email,password,image} = req.body;

    const found= await User.findOne({email});

    if(found)
        {
            return res.status(400).json({
                message:"User Alrealdy Exists",
                error:true
            })
        }

    const hashedPassword = bcrypt.hashSync(password,10);

    const data = {
        name,
        email,
        image,
        password:hashedPassword
    }

    const newUser = new User(data);
    await newUser.save();

    return res.status(201).json({
        message:'User Created Successfully',
        success:true,
        data:found
    }) 
}

module.exports.findUser = async(req,res)=>{
    const {email} = req.body;
    const found = await User.findOne({email}).select("-password");

    if(!found)
        {
            return res.status(400).json({
                message:"User Not Registered",
                error:true
            })
        }
    
    return res.status(200).json({
        message:'email verified',
        success:true,
        data:found
    }) 
}

module.exports.checkPassword = async(req,res)=>{

    console.log(req.body);

    const { password, userId } = req.body;

    const user = await User.findById(userId);

    const verifyPassword = await bcrypt.compare(password,user.password);
    
    if(!verifyPassword)
        {
            return res.status(400).json({
                message:'Incorrect Password',
                error: true
            })
        }
        
        const tokenData = {
            id: user._id,
            email :user.email
        }


        const getToken = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn : '1d'});

        
        const cookieOptions = {
            http: true,
            secure:true
        }

        return res.cookie('token',getToken,cookieOptions).status(200).json({
            message:'Logged in Succesfully',
            token : getToken,
            success : true
        }) 
}

module.exports.userDetails = async(req,res)=>{
    const token = req.cookies.token
    const user  = await tokenDetails(token);
    return res.status(200).json({
        message: "User Details",
        data:user
    })
}

module.exports.logoutUser = async(req,res)=>{
    const cookieOptions = {
        http:true,
        secure:true
    }

    return res.cookie('token','',cookieOptions).status(200).json({
        message:'Session Ended',
        success:true
    })
}

module.exports.updateUser = async(req,res)=>{
    const token = req.cookies.token
    const user = await tokenDetails(token);
    const {name,image} = req.body;
    const updateUser =  await User.findByIdAndUpdate(user._id,{
        name,
        image
    })

    const data = await User.findById(user._id);

    return res.json({
        message:'Profile updated Successfully',
        data,
        success:true
    })
}

module.exports.searchUser = async(req,res)=>{
    const {search} = req.body;
    const query = new RegExp(search,"i","g")
    const user = await User.find({
        "$or":[
            {name : query },
            {email:query }
        ]
    }).select("-password")

    return res.json({
        message:"Results",
        data:user,
        success:true
    })
}

