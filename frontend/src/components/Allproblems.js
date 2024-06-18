import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { AuthContext } from "../providers/authProvider";
import { useContext } from "react";
const AllProblemsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(6); // Number of problems per page
  const [problems, setProblems] = useState([]); // State to store problems
  var isloggedin=false;
  const authData=useContext(AuthContext);
  if(authData)
    isloggedin=true;
  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/coding/allproblems"); // Update with your backend endpoint
        setProblems(response.data.questions); // Ensure you are setting the correct data
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  // Get current problems
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    <div className="container mx-auto px-6 py-12 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Problems Section */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">All Problems</h2>
          {/* Problem Cards */}
          {currentProblems.map((problem) => (
            <div key={problem._id} className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-6 md:flex justify-between items-center">
                {/* Left part - Problem Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                  {/* <p className="text-gray-600 mb-4">{problem.description}</p> */}
                  <div className="flex text-gray-600 items-center">
                    {/* Display complexity and submissions side by side */}
                    <div
                      className={`mr-4 p-2 rounded ${
                        problem.difficulty === "easy"
                          ? "bg-green-200 text-green-800"
                          : problem.difficulty === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {problem.submissions}+ submissions
                    </div>
                  </div>
                </div>
                {/* Right part - Company Tags and Solve Now Button */}
                <div className="flex items-center">
                  <div className="flex flex-wrap mr-2">
                    {problem.companyTags.slice(0, 3).map((company, index) => (
                      <div key={index} className="mr-2 p-2 rounded bg-gray-200 text-gray-800">
                        {company}
                      </div>
                    ))}
                  </div>
                  <Link to={"/problem/"+problem._id} className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700">
                    Solve Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <div className="mt-8">
            <ul className="flex justify-center">
              {Array.from(
                { length: Math.ceil(problems.length / problemsPerPage) },
                (_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-2 rounded-md mx-1 focus:outline-none ${
                        currentPage === i + 1
                          ? "bg-yellow-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Tech Questions Section */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Technical Questions</h2>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">Question 1</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </p>
          </div>
          {/* Add more tech questions here */}
        </div>
      </div>
    </div>
    </>
  );
};

export default AllProblemsPage;
