const express=require('express')

const userRouter=express.Router()
const {protect}=require('../Middleware/authMiddleware')

const {registerUser,loginUser,allUsers} =require('../Controller/userController');


userRouter.route('/').post(registerUser).get(protect,allUsers);

userRouter.post('/login',loginUser)



module.exports=userRouter