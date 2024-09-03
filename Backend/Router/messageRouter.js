const express=require('express');
const {protect}=require('../Middleware/authMiddleware');
const { sendMessage,allmessage } = require('../Controller/messageController');

const messageRoutr=express.Router()


messageRoutr.route("/").post(protect, sendMessage)
messageRoutr.route("/:chatId").get(protect,allmessage)




module.exports=messageRoutr 