const Question = require("../models/question_model");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const Submission = require("../models/submission_model");

//get all problems controller
const allproblems_get = (req, res) => {
  // console.log("inside all problems controller");
  const userid=req.params.userid;
  console.log(userid)
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
  // Question.find()
  //   .then((questions) => {
  //     res.json({ questions });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.json({ message: "Error in fetching questions" });
  //   });
};

//single problem controller
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

// add problem controller
const addproblem_post = (req, res) => {
  const question = new Question(req.body);

  question
    .save()
    .then((question) => {
      res.status(200).json({ message: "Question added successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({ message: "Error in adding question" });
    });
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
  const { questionId, userId, code, language } = req.body;
  
  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const testCases = question.testCases;
    question.submissionsCount += 1;
    question.save();
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
            userid:userId,
            questionid:questionId,
            code,
            language,
            verdict: "Compilation Error",
          });
          submission.save();
          return res
            .status(500)
            .json({ error: "Compilation error", details: compileStderr });
        }
        runTestCases(
          userId,
          questionId,
          code,
          language,
          runCommand,
          testCases,
          tempCodeFilePath,
          res
        );
      });
    } else {
      runTestCases(
        userId,
        questionId,
        code,
        language,
        runCommand,
        testCases,
        tempCodeFilePath,
        res
      );
    }
  } catch (error) {
    console.error("Error submitting code:", error);
    return res.status(500).json({ error: "Error submitting code" });
  }
};

function runTestCases(
  userid,
  questionid,
  code,
  language,
  runCommand,
  testCases,
  tempCodeFilePath,
  res
) {
  
  let results = [];

  testCases.forEach((testCase, index) => {
    const inputFilePath = path.join(__dirname, `input${index}.txt`);
    fs.writeFileSync(inputFilePath, testCase.input);
    const options = { input: fs.readFileSync(inputFilePath) };
    const childProcess = exec(runCommand, options, (error, stdout, stderr) => {
      if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
      if (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: null,
          error: stderr,
          verdict: "Error",
        });
      } else {
        const normalize = (str) => str.replace(/\r\n/g, "\n").trim();
        const actualOutput = normalize(stdout);
        const expectedOutput = normalize(testCase.output);
        const verdict = actualOutput === expectedOutput ? "Pass" : "Fail";
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: stdout,
          error: stderr,
          verdict,
        });
      }

      if (results.length === testCases.length) {
        if (fs.existsSync(tempCodeFilePath)) fs.unlinkSync(tempCodeFilePath);
        if (
          runCommand.includes(".out") &&
          fs.existsSync(path.join(__dirname, "main.out"))
        ) {
          fs.unlinkSync(path.join(__dirname, "main.out"));
        } else if (
          runCommand.includes("java") &&
          fs.existsSync(tempCodeFilePath.replace(".java", ".class"))
        ) {
          fs.unlinkSync(tempCodeFilePath.replace(".java", ".class"));
        }

        verdict = "all tests passed";
        for (let i = 0; i < results.length; i++) {
          if (results[i].verdict === "Fail") {
            verdict = "failed on test case" + (i + 1);
            break;
          }
        }
        if (verdict === "all tests passed") {
          const submission = new Submission({
            userid,
            questionid,
            code,
            language,
            verdict,
            submissionStatus: true,
          });
          submission.save();
        } else {
          const submission = new Submission({
            userid,
            questionid,
            code,
            language,
            verdict,
          });
          submission.save();
        }
        res.json({ results });
      }
    });

  
    if (options.input) {
      childProcess.stdin.write(options.input);
      childProcess.stdin.end();
    }
  });
}

module.exports = {
  allproblems_get,
  singleproblem_get,
  addproblem_post,
  runproblem_post,
  submit_post,
};
