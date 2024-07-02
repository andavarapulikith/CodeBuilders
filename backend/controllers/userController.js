const Submission = require('../models/submission_model');
const Question=require('../models/question_model');
const User=require('../models/user_model');


const calculateScore = async (userId) => {
    try {
      const submissions = await Submission.find({ userid: userId }).populate('questionid');
      let score = 0;
      let problemsSolved = 0;
      const solvedQuestions = new Set();
      const questionPoints = {
        easy: 50,
        medium: 100,
        hard: 150
      };
      const deductionPoints = {
        easy: -2,
        medium: -5,
        hard: -8
      };
  
      const questionDeductions = {};
  
      submissions.forEach(submission => {
        const { questionid: question, verdict } = submission;
        const questionId = question._id.toString();
  
        if (verdict === 'Pass') {
          if (!solvedQuestions.has(questionId)) {
            // Add score for correct submission and increment problemsSolved
            score += questionPoints[question.difficulty];
            problemsSolved += 1;
  
            // Deduct the accumulated penalties for incorrect submissions if any
            if (questionDeductions[questionId]) {
              score += questionDeductions[questionId];
              delete questionDeductions[questionId];
            }
  
            solvedQuestions.add(questionId);
          }
        } else {
          if (!solvedQuestions.has(questionId)) {
            // Track deductions for the question
            if (!questionDeductions[questionId]) {
              questionDeductions[questionId] = 0;
            }
            questionDeductions[questionId] += deductionPoints[question.difficulty];
          }
        }
      });
  
      return { score, problemsSolved };
    } catch (error) {
      console.error('Error calculating score:', error);
      return { score: 0, problemsSolved: 0 };
    }
  };

const get_user=async (req,res)=>{
    try {
        const userId = req.params.id;
       
        const user = await User.findById(userId).select('-password');
       

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let data=await calculateScore(userId);
        
        user.score=data.score;
       
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

const get_submissions=async (req,res)=>{
    try {
        const userId = req.params.id;
        const submissions = await Submission.find({ userid: userId });
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;
        const submissionsData = [];
        const countedQuestionIds = new Map();
        for (const submission of submissions) {
            const question = await Question.findById(submission.questionid);
            if (question && submission.verdict === 'Pass' && !countedQuestionIds.has(question._id.toString())) {
                if (question.difficulty === 'easy') {
                    easyCount++;
                } else if (question.difficulty === 'medium') {
                    mediumCount++;
                } else if (question.difficulty === 'hard') {
                    hardCount++;
                }
                countedQuestionIds.set(question._id.toString(), true);
            }

                // Add processed submission data
                submissionsData.push({
                    date: submission.createdAt,
                    code:submission.code,
                    problem: question.title,
                    difficulty: question.difficulty,
                    language: submission.language,
                    verdict: submission.verdict
                });

               
            
        }

        // Prepare response object
        const responseData = {
            submissions: submissionsData,
            questionsSolved: {
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount
            }
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching user submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


const edit_user = async (req, res) => {
    const userid = req.params.id;
    const { username, contact_number } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.username = username;
        user.contact_number = contact_number;

        // Save the updated user
        await user.save();

        // Return updated user details
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};

module.exports = { edit_user };


module.exports={
    get_user,get_submissions,edit_user
}