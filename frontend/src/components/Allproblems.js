import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import { ClipLoader } from "react-spinners";
import Navbar from "./Navbar";
const AllProblemsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [problemsPerPage] = useState(7);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(false); 
  const authData = useContext(AuthContext);

  const isloggedin = authData.authData ? true : false;

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true); 
      try {
        let userid;
        if (authData.authData) userid = authData.authData.user._id;
        if (userid !== undefined) {
          const response = await axios.get(
            "http://localhost:5000/coding/allproblems/" + userid
          );
          setProblems(response.data.questions);
          setSolvedProblems(response.data.solvedQuestions);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProblems();
  }, [authData.authData]);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12 pt-20">
        {loading ? (
          <div className="text-white text-center mt-4">
            <ClipLoader color="#000000" size={60} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                All Problems
              </h2>
              {currentProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-white rounded-lg shadow-md mb-6"
                >
                  <div className="p-6 md:flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {problem.title}
                      </h3>
                      <div className="flex text-gray-600 items-center">
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
                          {problem.submissionsCount} submissions
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {problem.companyTags.length !== 0 && (
                        <div className="flex flex-wrap mr-2">
                          {problem.companyTags
                            .slice(0, 3)
                            .map((company, index) => (
                              <div
                                key={index}
                                className="mr-2 p-2 rounded bg-gray-200 text-gray-800"
                              >
                                {company.trim().length !== 0 && company}
                              </div>
                            ))}
                        </div>
                      )}
                      <Link
                        to={"/problem/" + problem._id}
                        className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700"
                      >
                        {!solvedProblems.some(
                          (solvedProblem) => solvedProblem === problem._id
                        )
                          ? "Solve Now"
                          : "Solved"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Technical Questions
              </h2>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 1
                </h3>
                <p className="text-gray-600">
                  How do you implement a binary search algorithm? Explain its
                  time complexity.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 2
                </h3>
                <p className="text-gray-600">
                  What are RESTful APIs and how do they work in web development?
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 3
                </h3>
                <p className="text-gray-600">
                  Explain the concept of responsive design in web development.
                  How do you achieve it?
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 4
                </h3>
                <p className="text-gray-600">
                  Describe the difference between supervised and unsupervised
                  learning in machine learning.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 5
                </h3>
                <p className="text-gray-600">
                  How do you optimize the performance of a React application?
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 6
                </h3>
                <p className="text-gray-600">
                  What is the difference between classification and regression
                  in machine learning?
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 7
                </h3>
                <p className="text-gray-600">
                  Explain the concept of a closure in JavaScript. Provide an
                  example.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 8
                </h3>
                <p className="text-gray-600">
                  What are some common techniques for preventing SQL injection
                  attacks in web applications?
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 9
                </h3>
                <p className="text-gray-600">
                  Describe how convolutional neural networks (CNNs) are used in
                  image recognition tasks.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  Question 10
                </h3>
                <p className="text-gray-600">
                  What is the purpose of state management libraries like Redux
                  in web development?
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllProblemsPage;
