import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import {toast} from 'sonner';

const SingleProblemPage = () => {
  const [language, setLanguage] = useState("python");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [submittedOutput, setSubmittedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  var isloggedin = false;
  const authData = useContext(AuthContext);
  if (authData.authData) isloggedin = true;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = () => {
    setLoading(true); // Set loading state to true
    axios
      .post("http://localhost:5000/coding/runproblem", { code, language, input })
      .then((res) => {
        if (res.data.output !== "") {
          setOutput(res.data.output);
          setError("");
        }
        if (res.data.error !== "") {
          setError(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = () => {
    if(!code){
      setError("Code cannot be empty");
      return;
    }
    setSubmitted(true);
    let userId = authData.authData.user._id;
    axios
      .post("http://localhost:5000/coding/submit", {
        questionId: id,
        userId,
        code,
        language,
      })
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          console.log(res.data)
          setSubmittedOutput(res.data.results.verdict);
          if(res.data.results.verdict==="Fail"){
            toast.error("Failed in some test cases");
        }
        else{
          toast.success("All testcases passed");
        }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSubmitted(false);
      });
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/coding/getproblem/${id}`
        );
        setProblem(response.data.question);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, [id]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className="bg-yellow-200 text-yellow-600 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Codebuilders
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-yellow-300">
                Home
              </Link>
            </li>
            <li>
              <Link
                to={isloggedin ? "/allproblems" : "/login"}
                className="hover:text-yellow-300"
              >
                All problems
              </Link>
            </li>
            <li>
              <Link
                to={isloggedin ? "/leaderboard" : "/login"}
                className="hover:text-yellow-300"
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/texteditor" className="hover:text-yellow-300">
                TextEditor
              </Link>
            </li>
            <li>
              <Link to="/ide" className="hover:text-yellow-300">
                Online IDE
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="w-screen h-screen overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 h-full overflow-auto bg-white p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {problem.title}
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: problem.description }}
              ></div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Constraints
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: problem.constraints }}
              ></div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Input Format
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: problem.inputFormat }}
              ></div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Output Format
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: problem.outputFormat }}
              ></div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sample Test Cases
              </h3>
              {problem.sampleTestCases &&
                problem.sampleTestCases.map((testCase) => (
                  <div
                    key={testCase._id}
                    className="bg-gray-100 p-4 rounded-lg mb-4"
                  >
                    <p className="text-gray-600 mb-2">
                      <strong>Input:</strong>
                    </p>
                    <p className="text-gray-600 mb-2">
                      {testCase.input.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="text-gray-600">
                      <strong>Output:</strong>
                    </p>
                    <p className="text-gray-600 mb-2">
                      {testCase.output.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Topic Tags
              </h3>
              <p className="text-gray-600 mb-4">
                {problem.topicTags ? problem.topicTags.join(", ") : ""}
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Company Tags
              </h3>
              <p className="text-gray-600 mb-4">
                {problem.companyTags ? problem.companyTags.join(", ") : ""}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-full overflow-auto bg-gray-800 p-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-white mr-2">Language:</label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="p-2 rounded-lg"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <Editor
                height="70vh"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(newValue) => setCode(newValue)}
                className="bg-black text-white p-4 rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={runCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
              >
                Run
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">Input</h3>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="w-full h-20 bg-white text-gray-800 p-4 rounded-lg focus:outline-none"
                placeholder="Input for your code..."
              ></textarea>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-white mb-2">Output</h3>
              {loading?(
              <div className="text-white text-center mt-4">
                <ClipLoader color="#FFFFFF" size={35} />
              </div>
            ):<textarea
                value={output}
                className="w-full h-20 bg-white text-gray-800 p-4 rounded-lg focus:outline-none"
                placeholder="Output from your code..."
              ></textarea>}
            </div>
            
            {error &&<><h3 className="text-xl font-semibold text-white mb-2">Error</h3> <div className="text-red-500 bg-white p-4 rounded-lg ">{error}</div></>}
            {submitted && <> <h3 className="text-xl font-bold text-white mb-2">Submission status</h3><div className="text-white text-center mt-4">
                <ClipLoader color="#FFFFFF" size={35} />
              </div> </>}
            {submittedOutput && (<>
              <h3 className="text-xl font-bold text-white mb-2">Submission status</h3>
              {submittedOutput==="Fail"?<div className="text-white bg-red-700 p-3 rounded-lg font-semibold  text-lg">Failed in some test cases</div>:<div className="text-white bg-green-500 p-3 rounded-lg font-semibold text-lg">All testcases passed</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProblemPage;
