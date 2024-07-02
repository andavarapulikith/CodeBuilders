import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { backendurl } from "../backendurl";
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendurl}/admin/users?page=${currentPage}&limit=${usersPerPage}`
      );
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination logic
  const totalUsers = users.length; // Assuming you get total users from backend
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar/Navbar */}
      <div className="bg-gray-800 text-gray-100 w-64 space-y-6 py-7 px-2">
        <Link
          to="/admin"
          className="text-2xl font-semibold uppercase hover:text-gray-300 block pl-4"
        >
          Admin Dashboard
        </Link>

        {/* Navigation Links */}
        <nav className="mt-8">
          <Link
            to="/admin"
            className="block py-2.5 px-4 rounded-md hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/"
            className="block py-2.5 px-4 rounded-md hover:bg-gray-700"
          >
            Home
          </Link>
          <Link
            to="/allsubmissions"
            className="block py-2.5 px-4 rounded-md hover:bg-gray-700"
          >
            All Submissions
          </Link>
          <Link
            to="/allusers"
            className="block py-2.5 px-4 rounded-md hover:bg-gray-700"
          >
            Users
          </Link>
          <Link
            to="/allquestions"
            className="block py-2.5 px-4 rounded-md text-white"
          >
            All Questions
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="text-white text-center mt-4 mr-auto ml-auto">
          <ClipLoader color="#000000" size={60} />
        </div>
      ) : (
        <div className="container mx-auto mt-8 flex-1 p-10">
          <h1 className="text-2xl font-semibold mb-4">All Users</h1>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                    currentPage === page
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "bg-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
