import React, { useState, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../providers/authProvider';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import Navbar from './Navbar';
import { backendurl } from '../backendurl';
const IDE = () => {
  const [code, setCode] = useState(''); // Default code
  const [language, setLanguage] = useState('cpp'); // Default language
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const authData = useContext(AuthContext);
  const [error,setError]=useState("")
  const isLoggedIn = authData.authData ? true : false;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const runCode = () => {
    setLoading(true); // Set loading state to true
    axios
      .post(`${backendurl}/coding/runproblem`, { code, language, input })
      .then((res) => {
        if (res.data.output !== '') {
          setError("")
          setOutput(res.data.output);
          toast.success('Code executed successfully!');
        }
        if (res.data.error !== '') {
          setError(res.data.error)
          toast.error("error in your code check");
        }
      })
      .catch((err) => {
        console.log(err);

        toast.error('Failed to run code. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
    <Navbar />

      <div className="flex flex-col items-center bg-gray-900 min-h-screen p-4">
        <div className="flex mb-4 space-x-2 w-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              language === 'python' ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleLanguageChange('python')}
          >
            Python
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              language === 'cpp' ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleLanguageChange('cpp')}
          >
            C++
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              language === 'java' ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleLanguageChange('java')}
          >
            Java
          </button>
        </div>

        <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Editor
            height="70vh"
            width="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(newValue) => setCode(newValue)}
          />
        </div>
        <div className="flex w-full space-x-4 mb-4 mt-4">
          <div className="w-1/2 bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-yellow-400 text-lg mb-2">Input</h2>
            <textarea
              className="w-full h-40 bg-gray-700 text-white p-2 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <div className="w-1/2 bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-yellow-400 text-lg mb-2">Output</h2>
            <div className="w-full h-40 bg-gray-700 text-white p-2 rounded overflow-auto">
              {isLoading ? (
                <p className="text-gray-300">Running code...</p>
              ) : (
                <pre className="whitespace-pre-wrap">{output} {error}</pre>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition hover:bg-yellow-600"
            onClick={runCode}
          >
            Run Code
          </button>
        </div>

      </div>
    </>
  );
};

export default IDE;
