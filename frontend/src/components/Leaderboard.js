import React, { useState } from 'react';
import { AuthContext } from "../providers/authProvider";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
const LeaderboardPage = () => {
  // Dummy data for leaderboard (considering more than 20 users for pagination example)
  var isloggedin=false;
  const authData=useContext(AuthContext);
  if(authData.authData)
    isloggedin=true;
  const allUsers = [
    { rank: 1, name: 'Alice', score: 1500, problemsSolved: 50 },
    { rank: 2, name: 'Bob', score: 1400, problemsSolved: 45 },
    { rank: 3, name: 'Charlie', score: 1300, problemsSolved: 40 },
    { rank: 4, name: 'David', score: 1200, problemsSolved: 35 },
    { rank: 5, name: 'Eve', score: 1100, problemsSolved: 30 },
    { rank: 6, name: 'Frank', score: 1050, problemsSolved: 29 },
    { rank: 7, name: 'Grace', score: 1000, problemsSolved: 28 },
    { rank: 8, name: 'Henry', score: 950, problemsSolved: 27 },
    { rank: 9, name: 'Ivy', score: 900, problemsSolved: 26 },
    { rank: 10, name: 'Jack', score: 850, problemsSolved: 25 },
    { rank: 11, name: 'Kelly', score: 800, problemsSolved: 24 },
    { rank: 12, name: 'Liam', score: 750, problemsSolved: 23 },
    { rank: 13, name: 'Mia', score: 700, problemsSolved: 22 },
    { rank: 14, name: 'Noah', score: 650, problemsSolved: 21 },
    { rank: 15, name: 'Olivia', score: 600, problemsSolved: 20 },
    { rank: 16, name: 'Paul', score: 550, problemsSolved: 19 },
    { rank: 17, name: 'Quinn', score: 500, problemsSolved: 18 },
    { rank: 18, name: 'Ryan', score: 450, problemsSolved: 17 },
    { rank: 19, name: 'Sophia', score: 400, problemsSolved: 16 },
    { rank: 20, name: 'Thomas', score: 350, problemsSolved: 15 },
    // Add more users as needed...
    { rank: 21, name: 'Ursula', score: 300, problemsSolved: 14 },
    { rank: 22, name: 'Vincent', score: 250, problemsSolved: 13 },
    { rank: 23, name: 'Wendy', score: 200, problemsSolved: 12 },
    { rank: 24, name: 'Xavier', score: 150, problemsSolved: 11 },
    { rank: 25, name: 'Yvonne', score: 100, problemsSolved: 10 },
    { rank: 26, name: 'Zack', score: 50, problemsSolved: 5 },
    // Add more users as needed...
  ];

  const pageSize = 10; // Number of users per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate indexes for pagination
  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar></Navbar>
  
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
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={index} className="hover:bg-yellow-100">
                  <td className="border px-4 py-2">{user.rank}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.score}</td>
                  <td className="border px-4 py-2">{user.problemsSolved}</td>
                </tr>
              ))}
            </tbody>
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
