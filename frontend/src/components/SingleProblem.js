import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import Editor from "@monaco-editor/react";
const SingleProblemPage = () => {
  const [language, setLanguage] = useState("python");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error,setError]=useState("");
  const [submittedOutput,setSubmittedOutput]=useState("");

  var isloggedin = false;
  const authData = useContext(AuthContext);
  if (authData.authData) isloggedin = true;

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  const runCode = () => {
    // console.log(code,input);
    axios
      .post("http://localhost:5000/coding/runproblem", { code,language, input })
      .then((res) => {
        
        if(res.data.output!==""){
        setOutput(res.data.output);
        setError("")
        }
        if(res.data.error!=="")
          {
          setError(res.data.error)
          
          }

      })
      .catch((err) => {
        console.log(err);
      });
  };
 const onSubmit=()=>{
    let userId=authData.authData.user._id;
    console.log(userId)
    axios.post("http://localhost:5000/coding/submit",{questionId:id,userId,code,language}).then((res)=>{
      console.log(res.data);
     if(res.data.error){
        setError(res.data.error)
     }
     else
     {
       let results=res.data.results;
       let flag=0
       for(let i=0;i<results.length;i++)
       {
        // console.log(results[i].verdict)
         if(results[i].verdict=="Fail")
         {
          flag=1
          setSubmittedOutput("failed in test case "+(i+1))
           break;
         }
       }
       if(flag==0)
       setSubmittedOutput("All test cases passed")

     }
    }).catch((err)=>{
      console.log(err);
    })
  
 }
  useEffect(() => {
    // Fetch problem details based on the problem ID
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/coding/getproblem/${id}`
        ); // Update with your backend endpoint
        setProblem(response.data.question);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, []);

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

      <div className="w-screen h-screen  overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Section - Problem Description */}
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
                    {/* Format input array and target on separate lines */}
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
                    {/* Format output array on separate lines */}
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

          {/* Right Section - Code Editor */}
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
              <button onClick={onSubmit} className="px-4 py-2  bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700">
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
              <textarea
              value={output}
                className="w-full h-20 bg-white text-gray-800 p-4 rounded-lg focus:outline-none"
                placeholder="Output from your code..."
              ></textarea>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {submittedOutput && <div className="text-blue-500 text-lg">{submittedOutput}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProblemPage;
