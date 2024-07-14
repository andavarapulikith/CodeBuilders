import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../providers/authProvider";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Navbar from "./Navbar";
import { backendurl } from "../backendurl.js";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
window.katex = katex;
const UpdateProblemPage = () => {
  const [problemData, setProblemData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    topicTags: [""],
    companyTags: [""],
    inputFile: null,
    outputFile: null,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const authData = useContext(AuthContext);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendurl}/coding/getproblem/${id}`
        );
        const data = response.data.question;
        setProblemData({
          ...data,
          sampleTestCases: data.sampleTestCases.length
            ? data.sampleTestCases
            : [{ input: "", output: "", explanation: "" }],
          topicTags: data.topicTags.length ? data.topicTags : [""],
          companyTags: data.companyTags.length ? data.companyTags : [""],
        });
      } catch (error) {
        console.error("Error fetching problem details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData({ ...problemData, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    setProblemData({ ...problemData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = [...problemData[arrayName]];
    if (field === "tag") {
      newArray[index] = e.target.value;
    } else {
      newArray[index][field] = e.target.value;
    }
    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleAddSampleTestCase = () => {
    setProblemData({
      ...problemData,
      sampleTestCases: [
        ...problemData.sampleTestCases,
        { input: "", output: "", explanation: "" },
      ],
    });
  };

  const handleAddTag = (arrayName) => {
    setProblemData({
      ...problemData,
      [arrayName]: [...problemData[arrayName], ""],
    });
  };

  const handleRemoveTag = (index, arrayName) => {
    const newArray = [...problemData[arrayName]];
    newArray.splice(index, 1);
    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProblemData({ ...problemData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userid = authData.authData.user._id;
    const sanitizedSampleTestCases = problemData.sampleTestCases.map(({ _id, ...rest }) => rest);

  const data = {
    title: problemData.title,
    description: problemData.description,
    difficulty: problemData.difficulty,
    constraints: problemData.constraints,
    inputFormat: problemData.inputFormat,
    outputFormat: problemData.outputFormat,
    sampleTestCases: sanitizedSampleTestCases, // Use sanitized sample test cases
    topicTags: problemData.topicTags,
    companyTags: problemData.companyTags,
    inputFile: problemData.inputFile,
    outputFile: problemData.outputFile,
    userid: userid,
  };

 

    console.log(problemData)

    try {
      const response = await axios.post(
        `${backendurl}/coding/updateproblem/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        navigate("/allquestions");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  if (loading) {
    return <div>
    <Navbar></Navbar>
    <div className="text-white text-center mt-4 mr-auto ml-auto">
            <ClipLoader color="#000000" size={60} />
          </div>
    </div>; 
  }
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['code-block'],
      ['formula'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'color', 'background', 'link', 'code-block', 'formula',
  ];
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Update Problem</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={problemData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <ReactQuill
              value={problemData.description}
              modules={modules}
              formats={formats}
              onChange={(value) => handleEditorChange("description", value)}
              className="rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={problemData.difficulty}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="constraints"
            >
              Constraints
            </label>
            <ReactQuill
            modules={modules}
            formats={formats}
              value={problemData.constraints}
              onChange={(value) => handleEditorChange("constraints", value)}
              className="rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="inputFormat"
            >
              Input Format
            </label>
            <ReactQuill
              value={problemData.inputFormat}
              modules={modules}
              formats={formats}
              onChange={(value) => handleEditorChange("inputFormat", value)}
              className="rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="outputFormat"
            >
              Output Format
            </label>
            <ReactQuill
              value={problemData.outputFormat}
              modules={modules}
              formats={formats}
              onChange={(value) => handleEditorChange("outputFormat", value)}
              className="rounded"
            />
          </div>
          {problemData.sampleTestCases.map((testCase, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Sample Test Case {index + 1}
              </label>
              <textarea
                name="input"
                value={testCase.input}
                onChange={(e) =>
                  handleArrayChange(e, index, "input", "sampleTestCases")
                }
                placeholder="Input"
                className="w-full border border-gray-300 p-2 rounded mb-2"
                required
              />
              <textarea
                name="output"
                value={testCase.output}
                onChange={(e) =>
                  handleArrayChange(e, index, "output", "sampleTestCases")
                }
                placeholder="Output"
                className="w-full border border-gray-300 p-2 rounded mb-2"
                required
              />
              <textarea
                name="explanation"
                value={testCase.explanation}
                onChange={(e) =>
                  handleArrayChange(e, index, "explanation", "sampleTestCases")
                }
                placeholder="Explanation"
                className="w-full border border-gray-300 p-2 rounded"
                
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSampleTestCase}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Sample Test Case
          </button>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Topic Tags
            </label>
            {problemData.topicTags.map((tag, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    handleArrayChange(e, index, "tag", "topicTags")
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, "topicTags")}
                  className="ml-2 bg-red-500 text-white px-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTag("topicTags")}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Topic Tag
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Company Tags
            </label>
            {problemData.companyTags.map((tag, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    handleArrayChange(e, index, "tag", "companyTags")
                  }
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, "companyTags")}
                  className="ml-2 bg-red-500 text-white px-2 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTag("companyTags")}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Company Tag
            </button>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="inputFile"
            >
              Input File
            </label>
            <input
              type="file"
              id="inputFile"
              name="inputFile"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="outputFile"
            >
              Output File
            </label>
            <input
              type="file"
              id="outputFile"
              name="outputFile"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Update Problem
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProblemPage;
