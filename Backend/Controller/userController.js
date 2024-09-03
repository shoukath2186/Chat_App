const asyncHandiler=require('express-async-handler');
const User=require('../Modal/userModel');
const gerateToken = require('../config/jenerateToken');


const registerUser=asyncHandiler(async(req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name||!email||!password){
        res.status(400);
        throw new Error('Please Enter the all fields')
        
    }
    const userExists=await User.findOne({email:email})
    if(userExists){
        res.status(400);
        throw new Error('User already exists')
    }
    
    const user=await User.create({
        name,
        email,
        password,
        pic
    })
    const token= gerateToken(user._id)
    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:token
        })
        
    }else{
       res.status(400);
       throw new Error('Failed to create the User')
    }
})

const loginUser=asyncHandiler(async(req,res)=>{

    const {email,password}=req.body
   
    if(!email||!password){
        res.status(400);
        throw new Error('Please Enter the all fields')
    }
    const existsUser=await User.findOne({email})

    
    if(existsUser && (await existsUser.matchPassword(password))){
        const token= gerateToken(existsUser._id)
        res.status(200).json({
            _id:existsUser._id,
            name:existsUser.name,
            email:existsUser.email,
            pic:existsUser.pic,
            token:token
        })
    }else{
       
            res.status(400);
            throw new Error('User data did not match.')
        
    }
})

const allUsers=asyncHandiler(async (req,res)=>{
    const keyWord=req.query.search
    ?{
        $or:[
            {name:{$regex:req.query.search,$options:'i'}},
            {email:{$regex:req.query.search,$options:'i'}}

        ]
    }:{};

    // console.log(1212,keyWord);
    
    
    const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } }).select('name email pic');;

 
    // console.log(9999,users);
    
    res.send(users)
})


module.exports={registerUser,loginUser,allUsers}