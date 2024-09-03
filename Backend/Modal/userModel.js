
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userModal=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,required:true},
    pic:{
        type:String,
        default:'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/corporate-user-icon.png'
    }
},{
    timestamps:true
})

userModal.methods.matchPassword=async function(enterPassword){
   return await bcrypt.compare(enterPassword,this.password);
}

userModal.pre('save',async function (next){
    if(!this.isModified){
        next()
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})



const User=mongoose.model("User",userModal)

module.exports=User