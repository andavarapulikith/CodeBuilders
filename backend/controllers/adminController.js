const mongoose = require("mongoose");
const Question = require("../models/question_model");
const User = require("../models/user_model");
const Submission = require("../models/submission_model");


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
         
          score += questionPoints[question.difficulty];
          problemsSolved += 1;
          if (questionDeductions[questionId]) {
            score += questionDeductions[questionId];
            delete questionDeductions[questionId];
          }

          solvedQuestions.add(questionId);
        }
      } else {
        if (!solvedQuestions.has(questionId)) {
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
const get_admin_data = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const questionsByDifficulty = await Question.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const questionsByDifficultyFormatted = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    questionsByDifficulty.forEach((q) => {
      questionsByDifficultyFormatted[q._id] = q.count;
    });

    const submissionStatistics = await Submission.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Fetch all users
    const users = await User.find();

    // Calculate scores for all users
    const userScores = await Promise.all(users.map(async (user) => {
      const { score, problemsSolved } = await calculateScore(user._id); // Assuming calculateScore function exists
      return {
        username: user.username,
        score: score,
        problemsSolved: problemsSolved
      };
    }));

    // Sort users by score in descending order
    userScores.sort((a, b) => b.score - a.score);

    // Get top 5 users based on score
    const topUsers = userScores.slice(0, 5);

    // Example structure for topUsers
    // const topUsers = [
    //   { username: 'User1', score: 100, problemsSolved: 50 },
    //   { username: 'User2', score: 95, problemsSolved: 48 },
    //   { username: 'User3', score: 90, problemsSolved: 45 },
    //   { username: 'User4', score: 85, problemsSolved: 42 },
    //   { username: 'User5', score: 80, problemsSolved: 40 },
    // ];

    const topSolvedQuestions = await Submission.aggregate([
      {
        $group: {
          _id: "$questionid",
          submissionCount: { $sum: 1 },
        },
      },
      { $sort: { submissionCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      {
        $unwind: "$questionDetails",
      },
      {
        $project: {
          _id: 0,
          questionId: "$_id",
          title: "$questionDetails.title",
          submissionCount: 1,
        },
      },
    ]);

    res.status(200).json({
      totalQuestions,
      totalUsers,
      totalSubmissions,
      questionsByDifficulty: questionsByDifficultyFormatted,
      submissionStatistics: submissionStatistics,
      topUsers, // Include top users in the response
      topSolvedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};



// get all submissions data for admin
const get_submissions_data=async (req,res)=>{
  try {
 
    const submissions = await Submission.find() 
    res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};



// get all users data for admin
const get_users_data=async (req,res)=>{
  try {
    const users = await User.find({},['-profilePicture','-password']) 
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
}

// get all problems data for admin
const get_problems_data=async(req,res)=>{
  try {
    const questions = await Question.find({},['-profilePicture','-password']) 
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
}

// delete question for admin (exclusive)
const delete_question=async (req,res)=>{
  const id = req.params.id;

    try {
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        await Question.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ success: false, message: 'Failed to delete question', error: error.message });
    }
}
module.exports = { get_admin_data,get_submissions_data,get_users_data,get_problems_data,delete_question };
