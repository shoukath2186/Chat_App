const expressAsyncHandler = require("express-async-handler");
const Message = require('../Modal/messageModat');
const User = require("../Modal/userModel");
const Chat = require("../Modal/chatModal");


const  sendMessage=expressAsyncHandler(async(req,res)=>{
    const {content,chatId}=req.body
    if(!content||!chatId){
        console.log("invalid data passed in request");
        return res.sendStatus(400)
        
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    }
    try {
        var message=await Message.create(newMessage)
        message=await message.populate('sender','name pic')
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.userId",
            select:'name pic email'
        })
       await Chat.findByIdAndUpdate(req.body.chatId,{
        LastMessage:message,

       })  
       res.json(message)
 
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }


})

const allmessage=expressAsyncHandler(async(req,res)=>{
    try {
       
        
        const message=await Message.find({chat:req.params.chatId})

        .populate('sender',"name pic email")
        .populate("chat")

        res.json(message) 
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})


module.exports={sendMessage,allmessage}