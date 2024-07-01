const express = require('express')
const { Server } = require('socket.io')
const http = require('http');
const tokenDetails = require('../helpers/tokenDetails');
const User = require('../models/user');
const Chat = require('../models/chat')
const Message = require('../models/message')
const getConversation = require('../helpers/getConversation');


const app = express();
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin : process.env.FRONTEND,
        methods:["GET","POST"],
        credentials:true
    }
})


const onlineUser = new Set()



io.on('connect',async(socket)=>{
    console.log("user connected",socket.id)
    const token = socket.handshake.auth.token;
    const user = await tokenDetails(token);
    console.log("connect-user",user);

    socket.join(user._id.toString())
    onlineUser.add(user?._id.toString())

    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page',async (userId)=>{
        console.log('userId',userId)
        const userDetails = await User.findById(userId).select("-password");

        const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        image:userDetails?.image,
        online: onlineUser.has(userId)
    }

    socket.emit('message-user',payload)

    const getMessage = await Chat.findOne({
        "$or":[
        {sender:user?._id,receiver:userId},
        {sender:userId,receiver:user?._id}
    ]
    }).populate('messages').sort({updatedAt:-1})

    socket.emit('message',getMessage?.messages || [])

    })

    socket.on('new message',async(data)=>{
        let chat = await Chat.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
        })

        if(!chat)
            {
                const createChat = await Chat({
                    sender: data?.sender,
                    receiver:data?.receiver
                })

                chat = await createChat.save();
            }

            const message = new Message({
                text:  data?.text,
                image: data?.image,
                video: data?.video,
                msgByUserId: data?.msgByUserId
            })

            const saveMessage = await message.save();

            const updateChat = await Chat.updateOne({_id:chat?._id},
                {
                    "$push": {messages:saveMessage?._id}
                })

            const getMessage = await Chat.findOne({
                "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
            }).populate('messages').sort({updatedAt:-1})

            io.to(data?.sender).emit('message',getMessage.messages);
            io.to(data?.receiver).emit('message',getMessage.messages);
            
            const conversationSender = await getConversation(data?.sender)
            const conversationReceiver = await getConversation(data?.receiver)

            io.to(data?.sender).emit('conversation',conversationSender)
            io.to(data?.receiver).emit('conversation',conversationReceiver)
    })

    socket.on('panel',async (currentUserId)=>{

        const conversation = await getConversation(currentUserId)
        socket.emit('conversation',conversation);
    })

    socket.on('seen',async(msgByUserId)=>{
        
        let conversation = await Chat.findOne({
            "$or" : [
                { sender : user?._id, receiver : msgByUserId },
                { sender : msgByUserId, receiver :  user?._id}
            ]
        })

        const conversationMessageId = conversation?.messages || []

        const updateMessages  = await Message.updateMany(
            { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
            { "$set" : { seen : true }}
        )

        //send conversation
        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)
    })
   
    socket.on('disconnect',()=>{
        onlineUser.delete(user._id.toString());
        console.log('disconnect user',socket.id)
    })
})


module.exports = {app,server};