import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../providers/authProvider';
import Navbar from './Navbar';
import { backendurl } from '../backendurl';

const CreateAssignmentPage = () => {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const authData = useContext(AuthContext);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        let userid;
        if (authData.authData) userid = authData.authData.user._id;
        if (userid !== undefined) {
          const response = await axios.get(`${backendurl}/coding/allproblems/` + userid);
          console.log("Fetched problems:", response.data.questions); // Log fetched problems
          setProblems(response.data.questions);
          setSolvedProblems(response.data.solvedQuestions);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [authData.authData]);

  const handleCheckboxChange = (problemId) => {
    setSelectedProblems(prevSelected =>
      prevSelected.includes(problemId)
        ? prevSelected.filter(id => id !== problemId)
        : [...prevSelected, problemId]
    );
  };

  const handleCreateAssignment = async () => {
    if (!assignmentTitle) {
      alert('Please enter an assignment title');
      return;
    }

    try {
      const response = await axios.post(`${backendurl}/assignments/create`, {
        title: assignmentTitle,
        problems: selectedProblems,
        createdBy: authData.authData.user._id,
      });
      alert('Assignment created successfully');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment');
    }
  };

  const filterProblems = (problems) => {
    return problems.filter((problem) => {
      const difficultyMatch = difficultyFilter
        ? problem.difficulty === difficultyFilter
        : true;
      const keywordMatch = keywordFilter
        ? problem.title.toLowerCase().includes(keywordFilter.toLowerCase())
        : true;
      console.log("Filtering problem:", problem.title, difficultyMatch, keywordMatch); // Log filtering criteria
      return difficultyMatch && keywordMatch;
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12 pt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Assignment</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Assignment Title"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
        />
        <div className="mb-4">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded"
            placeholder="Search by keyword"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded ml-2"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        {loading ? (
          <p>Loading problems...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filterProblems(problems).map(problem => (
              <div key={problem._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedProblems.includes(problem._id)}
                      onChange={() => handleCheckboxChange(problem._id)}
                    />
                    <span>{problem.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700"
          onClick={handleCreateAssignment}
        >
          Create Assignment
        </button>
      </div>
    </>
  );
};

export default CreateAssignmentPage;
