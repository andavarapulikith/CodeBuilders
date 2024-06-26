const Question = require("../models/question_model");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Submission = require("../models/submission_model");
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
dotenv.config();

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




const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
    // Clean up the temporary files
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

const submit_post = async (req, res) => {
  const { questionId, userId, language } = req.body;
  
  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const inputFileKey = question.inputFile; 
    const outputFileKey = question.outputFile; 

    const code = req.body.code; 
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


module.exports = {
  allproblems_get,
  singleproblem_get,
  addproblem_post,
  runproblem_post,
  submit_post,
};
