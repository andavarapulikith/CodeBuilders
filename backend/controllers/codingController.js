const Question=require('../models/question_model');
const allproblems_get=(req,res)=>{
    Question.find().then((questions)=>{
       
        res.json({questions});
    }).catch((err)=>{
        console.log(err);
        res.json({message:"Error in fetching questions"});
    });

}
const singleproblem_get=(req,res)=>{
    const id=req.params.id;
    Question.findById(id).then((question)=>{
        console.log(question);
        res.json({question:question});
    }).catch((err)=>{
        console.log(err);
        res.json({message:"Error in fetching question"});
    });
}
const addproblem_post=(req,res)=>{
    const question=new Question(req.body);
    console.log(question)
    question.save().then((question)=>{
        res.status(200).json({message:"Question added successfully"});
    }).catch((err)=>{
        console.log(err);
        res.status(401).json({message:"Error in adding question"});
    });

}
module.exports={allproblems_get,singleproblem_get,addproblem_post}