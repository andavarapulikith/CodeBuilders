import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { backendurl } from '../backendurl';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../providers/authProvider';
import { ClipLoader } from 'react-spinners';
const SingleAssignmentPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const authData = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`${backendurl}/assignments/${id}`);
        setAssignment(response.data);
        if (authData.authData) {
          const userid = authData.authData.user._id;
          const solvedResponse = await axios.get(
            `${backendurl}/coding/allproblems/${userid}`
          );
          setSolvedProblems(solvedResponse.data.solvedQuestions);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      }
    };

    fetchAssignment();
  }, [id, authData.authData]);


  

  return (
    <>
      <Navbar />
      {loading?<div className="text-white text-center mt-4">
            <ClipLoader color="#000000" size={60} />
          </div>:<div className="container mx-auto px-6 py-12 pt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{assignment.title}</h2>
        <div className="grid grid-cols-1 gap-8">
          {assignment.problems.map((problem) => {
            const isSolved = solvedProblems.includes(problem._id);
            let difficultyColor = '';

            if (problem.difficulty === 'easy') {
              difficultyColor = 'bg-green-200';
            } else if (problem.difficulty === 'medium') {
              difficultyColor = 'bg-yellow-200';
            } else if (problem.difficulty === 'hard') {
              difficultyColor = 'bg-red-200';
            }

            return (
              <div
                key={problem._id}
                className={`bg-white rounded-lg shadow-md p-6 mb-4 ${isSolved ? 'bg-green-100' : ''} ${difficultyColor}`}
              >
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <div className="flex justify-between items-center">
                  <p >
                    Difficulty: {<span className={`${difficultyColor} px-2 py-1 rounded-lg font-semibold`}>{problem.difficulty} </span>}
                  </p>
                  <Link
                    to={`/problem/${problem._id}`}
                    className={`ml-4 px-4 py-2 rounded-lg shadow-lg ${
                      isSolved
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {isSolved ? 'Solved' : 'Solve Problem'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>}
    </>
  );
};

export default SingleAssignmentPage;
