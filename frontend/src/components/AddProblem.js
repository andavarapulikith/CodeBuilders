import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../providers/authProvider";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Link } from "react-router-dom";
window.katex = katex;

const AddProblemPage = () => {
    var isloggedin=false;
    var user;
    const authData=useContext(AuthContext);
    if(authData!==null)
      {
        isloggedin=true;
        console.log(authData)
     
      }
     
    

  

  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    constraints: '',
    inputFormat: '',
    outputFormat: '',
    sampleTestCases: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', output: '' }],
    topicTags: [''],
    companyTags: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblemData({ ...problemData, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    setProblemData({ ...problemData, [name]: value });
  };

  const handleArrayChange = (e, index, field, arrayName) => {
    const newArray = [...problemData[arrayName]];
    // Check if the field is 'tag' and handle it accordingly
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

  const handleAddTestCase = () => {
    setProblemData({
      ...problemData,
      testCases: [...problemData.testCases, { input: '', output: '' }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(authData.authData!==null)
      {
      user=authData.authData.user;
      problemData.userid=user._id;
      }
    
    console.log(problemData)
    try {
      const response = await axios.post('http://localhost:5000/coding/addproblem', problemData);
      if (response.status === 200) {
        setProblemData({
          title: '',
          description: '',
          difficulty: 'easy',
          constraints: '',
          inputFormat: '',
          outputFormat: '',
          sampleTestCases: [{ input: '', output: '', explanation: '' }],
          testCases: [{ input: '', output: '' }],
          topicTags: [''],
          companyTags: [''],
        })
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
      ['clean']
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'color', 'background',
    'link',
    'code-block',
    'formula'
  ];

  return (
    <>
    <nav className="bg-yellow-200 text-yellow-600 shadow-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
            Codebuilders
        </Link>
        <ul className="flex space-x-4">
            <li>
                <Link to='/' className="hover:text-yellow-300">
                    Home
                </Link>
            </li>
            <li>
                <Link to={isloggedin ? '/allproblems' : '/login'} className="hover:text-yellow-300">
                    All problems
                </Link>
            </li>
            <li>
                <Link to={isloggedin ? '/leaderboard' : '/login'} className="hover:text-yellow-300">
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

    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-4xl font-bold mb-6 text-yellow-800">Add a New Problem</h1>
      <form onSubmit={handleSubmit} className=" p-6 rounded shadow-md">
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
            className="w-full px-3 py-2  border border-yellow-400 rounded"
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
              <input
                type="text"
                placeholder="Explanation"
                value={testCase.explanation}
                onChange={(e) => handleArrayChange(e, index, 'explanation', 'sampleTestCases')}
                className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveTag(index, 'sampleTestCases')}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove Test Case
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSampleTestCase}
            className="bg-yellow-600 text-white px-3 py-2 rounded"
          >
            Add Sample Test Case
          </button>
        </div>
        <div className="mb-8">
          <label className="block text-yellow-700 font-bold mb-2">Test Cases</label>
          {problemData.testCases.map((testCase, index) => (
            <div key={index} className="mb-4 bg-yellow-100 p-3 rounded">
              <textarea
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => handleArrayChange(e, index, 'input', 'testCases')}
                className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
                required
              />
              <textarea
                placeholder="Output"
                value={testCase.output}
                onChange={(e) => handleArrayChange(e, index, 'output', 'testCases')}
                className="w-full px-3 py-2 border border-yellow-400 rounded mb-2"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveTag(index, 'testCases')}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove Test Case
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTestCase}
            className="bg-yellow-600 text-white px-3 py-2 rounded"
          >
            Add Test Case
          </button>
        </div>
        <div className="mb-8">
          <label className="block text-yellow-700 font-bold mb-2">Topic Tags</label>
          {problemData.topicTags.map((tag, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange(e, index, 'tag', 'topicTags')}
                className="px-3 py-2 border border-yellow-400 rounded mr-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveTag(index, 'topicTags')}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTag('topicTags')}
            className="bg-yellow-600 text-white px-3 py-2 rounded"
          >
            Add Topic Tag
          </button>
        </div>
        <div className="mb-8">
          <label className="block text-yellow-700 font-bold mb-2">Company Tags</label>
          {problemData.companyTags.map((tag, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayChange(e, index, 'tag', 'companyTags')}
                className="px-3 py-2 border border-yellow-400 rounded mr-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveTag(index, 'companyTags')}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddTag('companyTags')}
            className="bg-yellow-600 text-white px-3 py-2 rounded"
          >
            Add Company Tag
          </button>
        </div>
        <button
          type="submit"
          className="bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Submit Problem
        </button>
      </form>
    </div>
    </>
  );
};

export default AddProblemPage;
