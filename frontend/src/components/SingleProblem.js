import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import {toast} from 'sonner';
import Navbar from "./Navbar";
import { backendurl } from "../backendurl";

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

  const authData = useContext(AuthContext);
  const isloggedin = authData.authData ? true : false;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = () => {
    setLoading(true);
    axios
      .post(`${backendurl}/coding/runproblem`, { code, language, input })
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
    if (!code) {
      setError("Code cannot be empty");
      return;
    }
    setSubmitted(true);
    const userId = authData.authData?.user._id;
    axios
      .post(`${backendurl}/coding/submit`, {
        questionId: id,
        userId,
        code,
        language,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
          setError(res.data.error);
        } else {
          console.log(res.data);
          setSubmittedOutput(res.data.results.verdict);
          if (res.data.results.verdict === "Fail") {
            toast.error("Failed in some test cases");
          } else {
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
          `${backendurl}/coding/getproblem/${id}`
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
      <Navbar />
      {isloggedin ? (
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
                <h3 className="text-xl font-semibold text-white mb-2">
                  Output
                </h3>
                {loading ? (
                  <div className="text-white text-center mt-4">
                    <ClipLoader color="#FFFFFF" size={35} />
                  </div>
                ) : (
                  <textarea
                    value={output}
                    className="w-full h-20 bg-white text-gray-800 p-4 rounded-lg focus:outline-none"
                    placeholder="Output from your code..."
                  ></textarea>
                )}
              </div>

              {error && (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Error
                  </h3>
                  <div className="text-red-500 bg-white p-4 rounded-lg ">
                    {error}
                  </div>
                </>
              )}

              {submittedOutput && (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Result
                  </h3>
                  <div
                    className={`p-4 rounded-lg ${
                      submittedOutput === "Pass"
                        ? "text-green-500 bg-white"
                        : "text-red-500 bg-white"
                    }`}
                  >
                    {submittedOutput}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Not Logged In</h1>
            <p className="text-gray-600 mb-4">
              Please log in to view this problem.
            </p>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProblemPage;
