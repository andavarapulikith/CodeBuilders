import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { backendurl } from "../backendurl";
const AllQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(6); // Number of questions per page
  const [loading,setLoading]=useState(false);
  useEffect(() => {
    fetchQuestions();
  }, [currentPage]); // Fetch questions whenever currentPage changes

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      // Example URL for fetching all questions (replace with your actual endpoint)
      const response = await axios.get(`${backendurl}/admin/questions`);
      if (response.data.success) {
        setQuestions(response.data.data);
      } else {
        console.error("Failed to fetch questions:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    }
    setLoading(false)
  };
  const handlePrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const handleDelete = async (questionId) => {
    console.log(questionId);
    try {
      const response = await axios.delete(
        `${backendurl}/admin/questions/${questionId}`
      );
      if (response.data.success) {
        setQuestions(
          questions.filter((question) => question._id !== questionId)
        );
        toast.success("Question deleted successfully!");
      } else {
        console.error("Failed to delete question:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting question:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar/Navbar */}
      <div className="bg-gray-800 text-gray-100 w-64 py-8 px-4 space-y-6">
        <Link
          to="/admin"
          className="text-3xl font-semibold uppercase hover:text-gray-300 block pl-4"
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
          <Link
            to="/addproblem"
            className="block py-2.5 px-4 rounded-md text-white"
          >
            Add Problem
          </Link>
          <Link
            to="/createassignment"
            className="block py-2.5 px-4 rounded-md text-white"
          >
            Create Assignment
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      {loading ?<div className="text-white text-center mt-4 mr-auto ml-auto">
            <ClipLoader color="#000000" size={60} />
          </div>:<div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-8">All Questions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {currentQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {question.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  ID: <strong>{question._id}</strong>
                </p>
                <div className=" items-center mb-4">
                  <p className=" mr-2">
                    Topic Tags:
                    <strong className="text-blue-500">
                      {" "}
                      {question.topicTags.join(", ")}
                    </strong>
                  </p>
                  <p className="">
                    Company Tags:
                    <strong className="text-green-500">
                      {" "}
                      {question.companyTags.join(", ")}
                    </strong>
                  </p>
                </div>
                <div className="flex justify-end space-x-4">
                <Link
                      to={`/updateproblem/${question._id}`}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    onClick={() => {
                      handleDelete(question._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePrevPage}
            className={`px-4 py-2 bg-gray-800 text-white rounded-md mr-4 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-700"
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-800 text-white rounded-md ml-4 hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>}
    </div>
  );
};

export default AllQuestionsPage;
