import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import { ClipLoader } from "react-spinners";
import { backendurl } from "../backendurl";
const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsPerPage] = useState(8);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage]); // Fetch submissions whenever currentPage changes

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${backendurl}/admin/submissions`
      );
      setSubmissions(response.data.data); // Assuming response.data.data contains submissions array
      setLoading(false); // Update loading state after successful fetch
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false); // Update loading state in case of error
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showCodeModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const CodeModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-lg">
          <pre>
            <code className="text-sm">{selectedSubmission.code}</code>
          </pre>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const totalSubmissions = submissions.length;
  const totalPages = Math.ceil(totalSubmissions / submissionsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Left Sidebar */}
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

      
      {loading ? (
        <div className="text-white text-center mt-4 mr-auto ml-auto">
          <ClipLoader color="#000000" size={60} />
        </div>
      ) : (
        <div className="container mx-auto mt-8 flex-1 p-10">
          <h1 className="text-2xl font-semibold mb-4">All Submissions</h1>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions
                .slice(
                  (currentPage - 1) * submissionsPerPage,
                  currentPage * submissionsPerPage
                )
                .map((submission, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.userid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.questionid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => showCodeModal(submission)}
                      >
                        View Code
                      </button>
                    </td>
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

          {/* Modal for Code */}
          {showModal && <CodeModal />}
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
