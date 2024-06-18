const app = require("./server");
const mongoose = require("mongoose");

const Question=require('./models/question_model');
const port = 27017;
const uri = "mongodb+srv://admin:likith123@cluster0.bouik5b.mongodb.net/codebuilders?retryWrites=true&w=majority&appName=Cluster0";

const questions=[
  {
  title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9, Only one valid answer exists.",
    inputFormat: "integer n denoting number of elements,array and target ",
    outputFormat: "Indices of the two numbers.",
    sampleTestCases: [
      {
        input: `4\n[2, 7, 11, 15]\n9`,
        output: `[0, 1]`,
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    testCases: [
      {
        input: `3\n[3, 2, 4]\n6`,
        output: `[1, 2]`
      },
      {
        input: `2\n[3, 3]\n6`,
        output: `[0, 1]`
      }
    ],
    topicTags: ["Array", "Hash Table"],
    companyTags: ["Amazon", "Google"]
}]


const connectionParams = {
  useNewUrlParser: true,
};

mongoose.connect(uri, connectionParams).then(() => {

    console.log("Connected to MongoDB Atlas & app listening on port " + port);
    // Question.insertMany(questions).then(function(){
    //   console.log("Data inserted") 
    //  }) // Success

  
})
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
