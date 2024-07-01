const mongoose=require("mongoose")

const SubmissionSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    questionid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required:true
    },
    code:{
        type:String,
        required:true
    },  
    language:{
        type:String,
        required:true

    },
    verdict:{
        type:String,
        required:true
    },
    submissionStatus:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})
module.exports=mongoose.model('Submission',SubmissionSchema);