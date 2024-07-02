const mongoose = require("mongoose");
const Question = require("../models/question_model");
const User = require("../models/user_model");
const Submission = require("../models/submission_model");


//get admin dashboard data
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

    const formattedSubmissionStatistics = {
      labels: submissionStatistics.map((stat) => stat._id),
      datasets: [
        {
          label: "Submissions",
          data: submissionStatistics.map((stat) => stat.count),
          borderColor: "#3182CE",
          backgroundColor: "rgba(49, 130, 206, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    };

    const topRankers = await User.find()
      .sort({ rank: 1 })
      .limit(5)
      .select("username rank");

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
      topRankers,
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
