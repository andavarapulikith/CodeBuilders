const Submission = require('../models/submission_model');
const Question=require('../models/question_model');
const User=require('../models/user_model');

const get_user=async (req,res)=>{
    try {
        const userId = req.params.id;
       
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

const get_submissions=async (req,res)=>{
    try {
        const userId = req.params.id;
        
        // Fetch all submissions for the user
        const submissions = await Submission.find({ userid: userId });

        // Initialize counters for easy, medium, and hard questions
        let easyCount = 0;
        let mediumCount = 0;
        let hardCount = 0;

        // Prepare array to store processed submissions
        const submissionsData = [];

        // Track already counted questionIds and their verdicts
        const countedQuestionIds = new Map();

        // Process each submission to fetch question details
        for (const submission of submissions) {
            // Find question details by questionid
            const question = await Question.findById(submission.questionid);

            if (question && submission.verdict === 'Pass' && !countedQuestionIds.has(question._id.toString())) {
                // Count question difficulty
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
                    problem: question.title,
                    difficulty: question.difficulty,
                    language: submission.language,
                    verdict: submission.verdict
                });

                // Mark question as counted
               
            
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