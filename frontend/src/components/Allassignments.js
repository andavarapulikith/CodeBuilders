import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { backendurl } from '../backendurl';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
const AllAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignmentsPerPage] = useState(10);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
        setLoading(true);
      try {
        const response = await axios.get(`${backendurl}/assignments/allassignments`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
        setLoading(false);
    };

    fetchAssignments();
  }, []);

  // Pagination logic
  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      {loading?<div className="text-white text-center mt-4">
            <ClipLoader color="#000000" size={60} />
          </div>:<div className="container mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Assignments</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 py-3 w-[70%] mx-auto">
          {currentAssignments.map((assignment) => (
            <Link key={assignment._id} to={`/assignments/${assignment._id}`}>
              <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
                </div>
                <div className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full">
                  {assignment.problems.length} Problems
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Pagination
          assignmentsPerPage={assignmentsPerPage}
          totalAssignments={assignments.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>}
    </>
  );
};

const Pagination = ({ assignmentsPerPage, totalAssignments, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAssignments / assignmentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex list-none">
          {pageNumbers.map((number) => (
            <li key={number} className={`mx-1 ${currentPage === number ? 'font-bold' : ''}`}>
              <button
                onClick={() => paginate(number)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition duration-300 ease-in-out"
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AllAssignmentsPage;
