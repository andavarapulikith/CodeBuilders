import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../providers/authProvider";
import Navbar from './Navbar';
import { backendurl } from '../backendurl';
import { ClipLoader } from "react-spinners";
const LeaderboardPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,setLoading]=useState(false)
  const pageSize = 10; 

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${backendurl}/coding/getscores`);
        const userScores = response.data.userScores;
        
        const rankedUsers = userScores.map((user, index) => ({
          rank: index + 1,
          name: user.user,
          score: user.score,
          problemsSolved: user.problemsSolved
        }));
        
        setAllUsers(rankedUsers);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
      setLoading(false)
    };

    fetchScores();
  }, []);

  // Calculate indexes for pagination
  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="w-screen h-screen overflow-auto bg-yellow-50 p-6">
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-yellow-900 mb-4">Leaderboard</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-yellow-900">Rank</th>
                  <th className="px-4 py-2 text-yellow-900">Name</th>
                  <th className="px-4 py-2 text-yellow-900">Score</th>
                  <th className="px-4 py-2 text-yellow-900">Problems Solved</th>
                </tr>
              </thead>
              {loading ?<div className="text-white text-center mt-4">
            <ClipLoader color="#000000" size={60} />
          </div>:<tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-yellow-100">
                    <td className="border px-4 py-2">{user.rank}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.score}</td>
                    <td className="border px-4 py-2">{user.problemsSolved}</td>
                  </tr>
                ))}
              </tbody>}
            </table>
          </div>
          {/* Pagination */}
          <div className="mt-4">
            <ul className="flex">
              {Array.from({ length: Math.ceil(allUsers.length / pageSize) }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded-md mx-1 focus:outline-none ${
                      currentPage === i + 1
                        ? 'bg-yellow-600 text-white'
                        : 'text-yellow-600 hover:bg-yellow-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
