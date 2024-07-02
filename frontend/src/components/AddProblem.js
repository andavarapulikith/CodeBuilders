import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../providers/authProvider";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Navbar from './Navbar';
window.katex = katex;


const AddProblemPage = () => {
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    sampleTestCases: [{ input: '', output: '', explanation: '' }],
    topicTags: [''],
    companyTags: [''],
    inputFile: null,
    outputFile: null,
  });

  const authData = useContext(AuthContext);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData({ ...problemData, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    setProblemData({ ...problemData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = [...problemData[arrayName]];
    if (field === 'tag') {
      newArray[index] = e.target.value;
    } else {
      newArray[index][field] = e.target.value;
    }
    setProblemData({ ...problemData, [arrayName]: newArray });
  };

  const handleAddSampleTestCase = () => {
    setProblemData({
      ...problemData,
      sampleTestCases: [...problemData.sampleTestCases, { input: '', output: '', explanation: '' }],
    });
  };

  const handleAddTag = (arrayName) => {
    setProblemData({ ...problemData, [arrayName]: [...problemData[arrayName], ''] });
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
    let userid=authData.authData.user._id;
     const data={
      title: problemData.title,
      description: problemData.description,
      difficulty: problemData.difficulty,
      constraints: problemData.constraints,
      inputFormat: problemData.inputFormat,
      outputFormat: problemData.outputFormat,
      sampleTestCases: problemData.sampleTestCases,
      topicTags: problemData.topicTags,
      companyTags: problemData.companyTags,
      inputFile: problemData.inputFile,
      outputFile: problemData.outputFile,
      userid:userid  
      
     }
     console.log(problemData.inputFile)
    try {
      const response = await axios.post('http://localhost:5000/coding/addproblem', data, { headers: { 
        'Content-Type': 'multipart/form-data',
      } });
      if (response.status === 200) {
        setProblemData({
          title: '',
          description: '',
          difficulty: 'easy',
          constraints: '',
          inputFormat: '',
          outputFormat: '',
          sampleTestCases: [{ input: '', output: '', explanation: '' }],
          topicTags: [''],
          companyTags: [''],
          inputFile: null,
          outputFile: null,
        });
      }
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

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
     
      <Navbar/>
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-4xl font-bold mb-6 text-yellow-800">Add a New Problem</h1>
        <form onSubmit={handleSubmit} encType='multipart/form-data'  className="p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-yellow-700 font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={problemData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-yellow-400 rounded"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-yellow-700 font-bold mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={problemData.description}
              onChange={(value) => handleEditorChange('description', value)}
              modules={modules}
              formats={formats}
              className="h-64 mb-2"
            />
          </div>
          <div className="mb-4 mt-20">
            <label className="block text-yellow-700 font-bold mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={problemData.difficulty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-yellow-400 rounded"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-8">
            <label className="block text-yellow-700 font-bold mb-2">Constraints</label>
            <ReactQuill
              theme="snow"
              value={problemData.constraints}
              onChange={(value) => handleEditorChange('constraints', value)}
              modules={modules}
              formats={formats}
              className="h-30 mb-2"
            />
          </div>
          <div className="mb-8">
            <label className="block text-yellow-700 font-bold mb-2">Input Format</label>
            <ReactQuill
              theme="snow"
              value={problemData.inputFormat}
              onChange={(value) => handleEditorChange('inputFormat', value)}
              modules={modules}
              formats={formats}
              className="h-30 mb-2"
            />
          </div>
          <div className="mb-8">
            <label className="block text-yellow-700 font-bold mb-2">Output Format</label>
            <ReactQuill
              theme="snow"
              value={problemData.outputFormat}
              onChange={(value) => handleEditorChange('outputFormat', value)}
              modules={modules}
              formats={formats}
              className="h-30 mb-2"
            />
          </div>
          <div className="mb-8">
            <label className="block text-yellow-700 font-bold mb-2">Sample Test Cases</label>
            {problemData.sampleTestCases.map((testCase, index) => (
              <div key={index} className="mb-4 bg-yellow-100 p-3 rounded">
                <textarea
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) => handleArrayChange(e, index, 'input', 'sampleTestCases')}
                  className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
                  required
                />
                <textarea
                  placeholder="Output"
                  value={testCase.output}
                  onChange={(e) => handleArrayChange(e, index, 'output', 'sampleTestCases')}
                  className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
                  required
                />
                <textarea
                  placeholder="Explanation"
                  value={testCase.explanation}
                  onChange={(e) => handleArrayChange(e, index, 'explanation', 'sampleTestCases')}
                  className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSampleTestCase}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Add Another Test Case
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-yellow-700 font-bold mb-2">Topic Tags</label>
            {problemData.topicTags.map((tag, index) => (
              <div key={index} className="mb-2 flex">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange(e, index, 'tag', 'topicTags')}
                  className="w-full px-3 py-2 border border-yellow-400 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, 'topicTags')}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTag('topicTags')}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Add Another Tag
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-yellow-700 font-bold mb-2">Company Tags</label>
            {problemData.companyTags.map((tag, index) => (
              <div key={index} className="mb-2 flex">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange(e, index, 'tag', 'companyTags')}
                  className="w-full px-3 py-2 border border-yellow-400 rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, 'companyTags')}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddTag('companyTags')}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Add Another Tag
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-yellow-700 font-bold mb-2">Input File</label>
            <input
              type="file"
              name="inputFile"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-yellow-400 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-700 font-bold mb-2">Output File</label>
            <input
              type="file"
              name="outputFile"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-yellow-400 rounded"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProblemPage;
