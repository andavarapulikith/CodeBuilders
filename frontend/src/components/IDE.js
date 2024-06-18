import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../providers/authProvider';
import { useContext } from 'react';
const IDE = () => {
  const [code, setCode] = useState('c');
  const [language, setLanguage] = useState('cpp'); // Default language
  var isloggedin=false;
  const authData=useContext(AuthContext);
  if(authData)
    isloggedin=true;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

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

   
    <div className="flex flex-col items-center bg-gray-900 min-h-screen p-4">
      <div className="flex mb-4 space-x-2">
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
      <div className="w-full h-[90vh] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Editor
          
          height="100%"
          widht="80%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(newValue) => setCode(newValue)}
        />
      </div>
    </div>
    </>
  );
};

export default IDE;
