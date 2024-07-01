const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const {app,server} = require('./sockets/index');

app.use(cors({
  origin : process.env.FRONTEND,
  credentials : true
}))

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ChatBox');
}

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use('/',userRoutes);

const PORT =  8000;

server.listen(PORT,()=>{
    console.log('on port 8000');
})