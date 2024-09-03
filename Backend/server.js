
const express=require('express')
const app=express()
require('dotenv').config()
const  { notFound, errorHandler }=require('./Middleware/errorMiddlware')


const userRouter=require('./Router/userRouter')
const ChatRouter=require('./Router/chatRouter')
const MessageRoutr=require('./Router/messageRouter')

const db=require('./config/dbConnuction') 
const { Socket } = require('socket.io')
db()  
 
app.use(express.json())

app.use('/api/user',userRouter);
app.use('/api/chat',ChatRouter);
app.use('/api/message',MessageRoutr);

app.use(notFound);
app.use(errorHandler); 

const port=process.env.PORT
const server=app.listen(port,console.log(`server is running port is ${port}`));

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
  
    socket.on('setup',(userData)=>{ 
       
        socket.join(userData._id); 
        socket.emit('connected')
    })
    socket.on("join chat",(room)=>{
        socket.join(room);
        
    }) 

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))



    socket.on("new message",(newMesssageRescived)=>{  
      
        
        var chat=newMesssageRescived.chat;
        if(!chat.users)return console.log('chat.user not defained');

        chat.users.forEach((user)=>{

            if(user==newMesssageRescived.sender._id) return;

            
             
            socket.in(user).emit("message recieved",newMesssageRescived);
         
        })
        
    })

  });