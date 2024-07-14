const Question = require("../models/question_model");
const User=require("../models/user_model")
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Submission = require("../models/submission_model");
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
const fetch=require("node-fetch")
dotenv.config();

// get all problems
const allproblems_get = (req, res) => {
  const userid=req.params.userid;

  if(userid == undefined ){
    return res.status(401).json({message:"User not authenticated"});
  }
  Submission.find({userid:userid,submissionStatus:true}).then((submissions)=>{
    const solvedQuestions=submissions.map(submission=>submission.questionid);
    Question.find()
    .then((questions) => {
      res.json({ questions,solvedQuestions });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Error in fetching questions" });
    });
  })
  
};

// get single problem
const singleproblem_get = (req, res) => {
  const id = req.params.id;
  Question.findById(id)
    .then((question) => {
      res.json({ question: question });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Error in fetching question" });
    });
};



//S3 client for file upload
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// add problem
const addproblem_post = async (req, res) => {
  try {
    const { title, description, difficulty, constraints, inputFormat, outputFormat, sampleTestCases, topicTags, companyTags,userid } = req.body;
    const { inputFile, outputFile } = req.files;

    let inputFileUrl = '';
    let outputFileUrl = '';

    if (inputFile && inputFile.length > 0) {
      const inputFileData = inputFile[0];
      const inputKey = `uploads/user-uploads/${Date.now()}_${inputFileData.originalname}`;
      const inputParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: inputKey,
        Body: inputFileData.buffer,
        ContentType: inputFileData.mimetype,
      };
      await s3Client.send(new PutObjectCommand(inputParams));
      inputFileUrl = inputKey;
    }

    if (outputFile && outputFile.length > 0) {
      const outputFileData = outputFile[0];
      const outputKey = `uploads/user-uploads/${Date.now()}_${outputFileData.originalname}`;
      const outputParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: outputKey,
        Body: outputFileData.buffer,
        ContentType: outputFileData.mimetype,
      };
      await s3Client.send(new PutObjectCommand(outputParams));
      outputFileUrl = outputKey;
   
    }

    const newQuestion = new Question({
      userid: userid,
      title,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      sampleTestCases:sampleTestCases,
      inputFile: inputFileUrl,
      outputFile: outputFileUrl,
      topicTags: topicTags,
      companyTags: companyTags,
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Problem added successfully', question: newQuestion });

  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ error: 'An error occurred while adding the problem' });
  }
};


// run problem
const runproblem_post = (req, res) => {
  const { code, language, input } = req.body;

  let fileExtension, compileCommand, runCommand, mainFileName;

  if (language === "python") {
    fileExtension = ".py";
    mainFileName = "main.py";
    runCommand = `python ${path.join(__dirname, mainFileName)}`;
  } else if (language === "cpp") {
    fileExtension = ".cpp";
    mainFileName = "main.cpp";
    compileCommand = `g++ ${path.join(__dirname, mainFileName)} -o ${path.join(
      __dirname,
      "main.out"
    )}`;
    runCommand = `${path.join(__dirname, "main.out")}`;
  } else if (language === "java") {
    fileExtension = ".java";
    mainFileName = "Main.java";
    compileCommand = `javac ${path.join(__dirname, mainFileName)}`;
    runCommand = `java -cp ${__dirname} Main`;
  } else {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const tempCodeFilePath = path.join(__dirname, mainFileName);
  try {
    fs.writeFileSync(tempCodeFilePath, code);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to write code to file", details: error.message });
  }

  let inputFilePath = null;
  if (input) {
    inputFilePath = path.join(__dirname, "input.txt");
    try {
      fs.writeFileSync(inputFilePath, input);
    } catch (error) {
      fs.unlinkSync(tempCodeFilePath);
      return res.status(500).json({
        error: "Failed to write input to file",
        details: error.message,
      });
    }
  }

  if (compileCommand) {
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        fs.unlinkSync(tempCodeFilePath);
        if (inputFilePath) fs.unlinkSync(inputFilePath);
        return res.json({ output: null, error: compileStderr });
      }
      executeCode(runCommand, inputFilePath, tempCodeFilePath, res);
    });
  } else {
    executeCode(runCommand, inputFilePath, tempCodeFilePath, res);
  }
};

function executeCode(command, inputFilePath, tempCodeFilePath, res) {
  const options = inputFilePath
    ? { input: fs.readFileSync(inputFilePath) }
    : {};
  const childProcess = exec(command, options, (error, stdout, stderr) => {
    if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);
    if (
      command.includes(".out") &&
      fs.existsSync(path.join(__dirname, "main.out"))
    ) {
      fs.unlinkSync(path.join(__dirname, "main.out"));
    } else if (
      command.includes("java") &&
      fs.existsSync(tempCodeFilePath.replace(".java", ".class"))
    ) {
      fs.unlinkSync(tempCodeFilePath.replace(".java", ".class"));
    }
    if (inputFilePath && fs.existsSync(inputFilePath))
      fs.unlinkSync(inputFilePath);

    if (error) {
      res.json({ output: null, error: stderr });
    } else {
      res.json({ output: stdout, error: stderr });
    }
  });

  if (options.input) {
    childProcess.stdin.write(options.input);
    childProcess.stdin.end();
  }
}


// submit problem
const submit_post = async (req, res) => {
  const { questionId, userId, language } = req.body;
  console.log(language)
  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const inputFileKey = question.inputFile; 
    const outputFileKey = question.outputFile; 
    question.submissionsCount+=1;
    await question.save();

    const code = req.body.code; 
    console.log(code)
    const inputUrl = await getObjectURL(inputFileKey);
    const inputResponse = await fetch(inputUrl);
    if (!inputResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch input file from S3" });
    }
    const inputText = await inputResponse.text();

    const outputUrl = await getObjectURL(outputFileKey);
    const outputResponse = await fetch(outputUrl);
    if (!outputResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch output file from S3" });
    }

    const outputText = await outputResponse.text();

    let fileExtension, compileCommand, runCommand, mainFileName;

    if (language === "python") {
      fileExtension = ".py";
      mainFileName = "main.py";
      runCommand = `python ${path.join(__dirname, mainFileName)}`;
    } else if (language === "cpp") {
      fileExtension = ".cpp";
      mainFileName = "main.cpp";
      compileCommand = `g++ ${path.join(
        __dirname,
        mainFileName
      )} -o ${path.join(__dirname, "main.out")}`;
      runCommand = `${path.join(__dirname, "main.out")}`;
    } else if (language === "java") {
      fileExtension = ".java";
      mainFileName = "Main.java";
      compileCommand = `javac ${path.join(__dirname, mainFileName)}`;
      runCommand = `java -cp ${__dirname} Main`;
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const tempCodeFilePath = path.join(__dirname, mainFileName);
    try {
      fs.writeFileSync(tempCodeFilePath, code);
    } catch (error) {
      return res
        .status(500)
        .json({
          error: "Failed to write code to file",
          details: error.message,
        });
    }

    if (compileCommand) {
      exec(compileCommand, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          console.log("compile error occured")
          fs.unlinkSync(tempCodeFilePath);
          const submission = new Submission({
            userid: userId,
            questionid: questionId,
            code,
            language,
            verdict: "Compilation Error",
          });
          submission.save();
          return res
            .status(500)
            .json({ error: "Compilation error", details: compileStderr });
        }
        compareOutput(
          userId,
          questionId,
          code,
          language,
          runCommand,
          inputText,
          outputText,
          tempCodeFilePath,
          res
        );
      });
    } else {
      compareOutput(
        userId,
        questionId,
        code,
        language,
        runCommand,
        inputText,
        outputText,
        tempCodeFilePath,
        res
      );
    }
  } catch (error) {
    console.error("Error submitting code:", error);
    return res.status(500).json({ error: "Error submitting code" });
  }
};

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

function compareOutput(
  userId,
  questionId,
  code,
  language,
  runCommand,
  inputText,
  outputText,
  tempCodeFilePath,
  res
) {
  const options = { input: inputText };
  const childProcess = exec(runCommand, options, (error, stdout, stderr) => {
    if (error) {
      const submission = new Submission({
        userid: userId,
        questionid: questionId,
        code,
        language,
        verdict: "Execution Error",
      });
      submission.save();
      return res.status(500).json({ error: "Execution error", details: stderr });
    }

    const normalize = (str) => str.replace(/\r\n/g, "\n").trim();
    const actualOutput = normalize(stdout);
    const expectedOutput = normalize(outputText);
    const verdict = actualOutput === expectedOutput ? "Pass" : "Fail";
    let submissionstatus=false
    if(verdict==="Pass")
      submissionstatus=true
    const submission = new Submission({
      userid: userId,
      questionid: questionId,
      code,
      language,
      verdict,
      submissionStatus:submissionstatus
    });
    submission.save();

    if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);

    res.json({
      results: {
        input: inputText,
        expectedOutput: outputText,
        actualOutput,
        error: stderr,
        verdict,

      },
    });
  });

  if (options.input) {
    childProcess.stdin.write(options.input);
    childProcess.stdin.end();
  }
}
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
      if (!question) return;
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

const calculateAllUserScores = async () => {
  try {
    const users = await User.find();
    const userScores = await Promise.all(users.map(async (user) => {
      const {score,problemsSolved} = await calculateScore(user._id);
      return {
        user: user.username,
        score: score,
        problemsSolved: problemsSolved
      };
    }));
    userScores.sort((a, b) => b.score - a.score);

    return userScores;
  } catch (error) {
    console.error('Error calculating scores for all users:', error);
    return [];
  }
};


const get_scores=async(req,res)=>{
  try {
    const userScores = await calculateAllUserScores();
    res.json({ userScores });
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ error: 'Failed to fetch user scores' });
  }
}

const user_submissions_get=async (req,res)=>{
  
  const { questionid, userid } = req.params;
  try {
    const submissions = await Submission.find({ questionid: questionid, userid: userid });
    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ error: 'Failed to fetch user submissions' });
  }
}
const updateProblem_post = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      sampleTestCases,
      topicTags,
      companyTags,
      userid
    } = req.body;
    const { inputFile, outputFile } = req.files;

    let inputFileUrl = '';
    let outputFileUrl = '';
    if (inputFile && inputFile.length > 0) {
      const inputFileData = inputFile[0];
      const inputKey = `uploads/user-uploads/${Date.now()}_${inputFileData.originalname}`;
      const inputParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: inputKey,
        Body: inputFileData.buffer,
        ContentType: inputFileData.mimetype,
      };
      await s3Client.send(new PutObjectCommand(inputParams));
      inputFileUrl = inputKey;
    }

    if (outputFile && outputFile.length > 0) {
      const outputFileData = outputFile[0];
      const outputKey = `uploads/user-uploads/${Date.now()}_${outputFileData.originalname}`;
      const outputParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: outputKey,
        Body: outputFileData.buffer,
        ContentType: outputFileData.mimetype,
      };
      await s3Client.send(new PutObjectCommand(outputParams));
      outputFileUrl = outputKey;
    }

    const updatedData = {
      title,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      sampleTestCases,
      topicTags,
      companyTags,
    };

    if (inputFileUrl) updatedData.inputFile = inputFileUrl;
    if (outputFileUrl) updatedData.outputFile = outputFileUrl;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Problem updated successfully', question: updatedQuestion });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ error: 'An error occurred while updating the problem' });
  }
};

module.exports = {
  allproblems_get,
  singleproblem_get,
  addproblem_post,
  runproblem_post,
  submit_post,
  get_scores,user_submissions_get,updateProblem_post
};
