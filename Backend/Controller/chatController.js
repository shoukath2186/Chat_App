

const asyncHandiler = require('express-async-handler')
const Chat = require('../Modal/chatModal');
const User = require('../Modal/userModel');
const { default: mongoose } = require('mongoose');


const accessChat = asyncHandiler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log('userId param not sent with request');
        return res.sendStatus(400)
    }
    
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ],
    }).populate("users", "-password").populate('LastMessage');

   
    

    isChat = await User.populate(isChat, {
        path: 'LastMessage.sender',
        select: "name pic email"
    })
    
    if (isChat.length > 0) {

        res.send(isChat[0]);
        
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
                "users", "-password"
            );
            res.status(200).send(fullChat)
             
        } catch (error) {
            
            
            res.status.apply(4000);
            throw new Error(error.message) 
        }
    }

})

const fetchChats = asyncHandiler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "_password")
            .populate("LastMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "LastMessage.sender",
                    select: "name pic email",
                })
                res.status(200).send(results) 
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
const createGroupChat = asyncHandiler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "please Fill All Field" })
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400).send('More than 2 users are required to form a group chat')
    }
    users.push(req.user)
    try {


        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})

const remaneGroup=asyncHandiler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },{new:true}
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!updatedChat){
       res.status(400);
       throw new Error('Chat Not found')

    }else{
        res.json(updatedChat)
    }
})

const addToGroup=asyncHandiler(async(req,res)=>{

    const {chatId,userId}=req.body
   
    const added=await Chat.findByIdAndUpdate(chatId,{
         $push:{users:userId}
    },{new:true}).populate("users", "-password")
    .populate("groupAdmin", "-password");



    if(!added){
        res.status(400);
        throw new Error('chat Not found')
    }else{
        res.json(added)
    }
})




const removeToGroup=asyncHandiler(async(req,res)=>{
    const {chatId,userId}=req.body
  
    const remove=await Chat.findByIdAndUpdate(chatId,{
         $pull:{users:userId}
    },{new:true}).populate("users", "-password")
    .populate("groupAdmin", "-password");

  

    if(!remove){
        res.status(400);
        throw new Error('chat Not found')
    }else{
        res.json(remove)
    }
})


module.exports = { accessChat, fetchChats, createGroupChat,remaneGroup ,addToGroup,removeToGroup}