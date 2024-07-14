import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { backendurl } from "../backendurl";
import SubmissionModal from "./SubmissionModal"; // Import the SubmissionModal component

const SingleProblemPage = () => {
  const [language, setLanguage] = useState("python");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState({
    python: `# Python initial code\n\n`,
    cpp: `// C++ initial code\n\n#include <bits/stdc++.h>
using namespace std;

int main() {

  cout << "Hello World";

  return 0;

}`,
    java: `
  // Java initial code\n\n 
  public class Main {
  public static void main(String[] args) {

    System.out.println("Hello World");

  }
}`
  });
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [submittedOutput, setSubmittedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [viewMode, setViewMode] = useState("problem");
  const [selectedSubmission, setSelectedSubmission] = useState(null); // State for selected submission
  const authData = useContext(AuthContext);
  const isloggedin = authData.authData ? true : false;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = () => {
    setLoading(true);
    axios
      .post(`${backendurl}/coding/runproblem`, { code: code[language], language, input })
      .then((res) => {
        
        if (res.data.output !== "") {
          setOutput(res.data.output);
          setError("");
        }
        if (res.data.error !== "") {
          setError(res.data.error);
          setOutput("");
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
    if (!code[language]) {
      setError("Code cannot be empty");
      return;
    }
    setSubmitted(true);
    const userId = authData.authData?.user._id;
    axios
      .post(`${backendurl}/coding/submit`, {
        questionId: id,
        userId,
        code: code[language],
        language,
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.error) {
          console.log(res.data.error);
          setError(res.data.error);
          setSubmittedOutput("");
        } else {
          console.log(res.data);
          setSubmittedOutput(res.data.results.verdict);
          setError("");
          if (res.data.results.verdict === "Fail") {
            toast.error("Failed in some test cases");
          } else {
            toast.success("All testcases passed");
          }
        }
      })
      .catch((err) => {

        console.log(err.response.data);
        setError(err.response.data.error);
      })
      .finally(() => {
        setSubmitted(false);
        fetchUserSubmissions(); // Refresh user submissions after submission
      });
  };

  const fetchUserSubmissions = async () => {
    const userId = authData.authData?.user._id;
    try {
      const response = await axios.get(
        `${backendurl}/coding/usersubmissions/${id}/${userId}`
      );
      setUserSubmissions(response.data.submissions);
    } catch (error) {
      console.error("Error fetching user submissions:", error);
    }
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
    if (isloggedin) {
      fetchUserSubmissions();
    }
  }, [id, isloggedin]);

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const openSubmissionModal = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeSubmissionModal = () => {
    setSelectedSubmission(null);
  };

  return (
    <>
      <Navbar />
      {isloggedin && problem ? (
        <div className="w-screen h-screen overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 h-full overflow-auto bg-white p-6">
              <div className="flex items-center justify-between mb-4 mr-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {problem.title}
                </h2>
                <h2
                  className={`px-2 py-1 font-bold text-xl rounded ${
                    problem.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : problem.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : problem.difficulty === "hard"
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                >
                  {problem.difficulty}
                </h2>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => toggleViewMode("problem")}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === "problem"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    Problem
                  </button>
                  <button
                    onClick={() => toggleViewMode("submissions")}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === "submissions"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    Submissions
                  </button>
                </div>

                {viewMode === "problem" && (
                  <>
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
                            {testCase.input
                              .split("\n")
                              .map((line, index) => (
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
                            {testCase.output
                              .split("\n")
                              .map((line, index) => (
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
                  </>
                )}

                {viewMode === "submissions" && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Your Submissions
                    </h3>
                    {userSubmissions.length > 0 ? (
                      userSubmissions.map((submission) => (
                        <div
                          key={submission._id}
                          className="bg-gray-700 p-4 rounded-lg mb-4"
                        >
                          <p className="text-gray-300 mb-2">
                            <strong>Date:</strong>{" "}
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                          <p className="text-gray-300 mb-2">
                            <strong>Language:</strong> {submission.language}
                          </p>
                          <p className="text-gray-300 mb-2">
                            <strong>Verdict:</strong>{" "}
                            <span
                              className={`font-semibold ${
                                submission.verdict === "Pass"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {submission.verdict}
                            </span>
                          </p>
                          <button
                            onClick={() => openSubmissionModal(submission)} // Open modal on button click
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 mt-2"
                          >
                            View Code
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-300">No submissions yet.</p>
                    )}
                  </div>
                )}
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
                  value={code[language]}
                  onChange={(newValue) => setCode({ ...code, [language]: newValue })}
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

              {submitted ? <div className="text-white text-center mt-4 mr-auto ml-auto">
          <ClipLoader color="#FFFFFF" size={60} />
        </div>: submittedOutput && (
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
        <div className="text-white text-center mt-4 mr-auto ml-auto">
          <ClipLoader color="#FFFFFF" size={60} />
        </div>
      )}

      {/* Modal for displaying submission code */}
      {selectedSubmission && (
        <SubmissionModal
          isOpen={selectedSubmission !== null}
          closeModal={closeSubmissionModal}
          submission={selectedSubmission}
        />
      )}
    </>
  );
};

export default SingleProblemPage;
