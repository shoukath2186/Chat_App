
const express=require('express');
const {protect}=require('../Middleware/authMiddleware');
const { accessChat ,fetchChats,createGroupChat,remaneGroup,addToGroup, removeToGroup} = require('../Controller/chatController');


const router=express.Router();

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChats);
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,remaneGroup);
router.route('/groupadd').put(protect,addToGroup);
router.route('/groupremove').put(protect,removeToGroup)



module.exports=router