const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    contact_number:{
        type:String,
        default:""
    },
    rank:{
        type:Number,
        default:0
    },
    
    
})
module.exports=mongoose.model('User', userSchema);