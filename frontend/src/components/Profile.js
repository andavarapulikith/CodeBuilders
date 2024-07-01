import React, { useEffect, useState, useContext } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import axios from "axios";
import { AuthContext } from "../providers/authProvider";
import Navbar from './Navbar'

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [clickedSquare, setClickedSquare] = useState(null);
  const [editing, setEditing] = useState(false); // State for showing edit form
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    contact_number: "",
  });

  const authData = useContext(AuthContext);

  const [questionsSolved, setQuestionsSolved] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [tooltipContent, setTooltipContent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userid = authData.authData.user._id;
        console.log("User ID:", userid); // Log user ID

        const response = await axios.get(`http://localhost:5000/user/${userid}`);
        const userData = response.data;
        console.log("User Data:", userData); // Log user data
        setUser(userData);

        const response2 = await axios.get(`http://localhost:5000/user/submissions/${userid}`);
        const submissionsData = response2.data;

        console.log("Submissions Data:", submissionsData); // Log submissions data
        setSubmissions(submissionsData.submissions);
        setQuestionsSolved(submissionsData.questionsSolved);

        // Compute yearly stats based on submissionsData
        const yearlyStatsData = {};
        const currentYear = new Date().getFullYear();

        // Create an object with every date of the current year initialized to 0 submissions
        for (let month = 0; month < 12; month++) {
          const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, month, day).toISOString().split("T")[0];
            yearlyStatsData[date] = { date: date, count: 0 };
          }
        }

        // Update the object with actual submission counts
        submissionsData.submissions.forEach((submission) => {
          const submissionDate = new Date(submission.date);
          const submissionDateKey = submissionDate.toISOString().split("T")[0];

          if (yearlyStatsData[submissionDateKey]) {
            yearlyStatsData[submissionDateKey].count++;
          } else {
            yearlyStatsData[submissionDateKey] = {
              date: submissionDateKey,
              count: 1,
            };
          }
        });
        const yearlyStatsArray = Object.values(yearlyStatsData);
        setYearlyStats(yearlyStatsArray);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [authData]);

  const handleMouseEnter = (value) => {
    if (value) {
      setTooltipContent(`${value.date} | Submissions: ${value.count}`);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Compute submissions to display based on current page
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  // Calculate total pages
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  // Function to toggle edit form visibility
  const toggleEditForm = () => {
    setEditing(!editing);
    // Reset edit form data to current user data
    setEditFormData({
      username: user.username,
      email: user.email,
      contact_number: user.contact_number,
    });
  };

  // Function to handle input change in edit form
  const handleEditInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userid = authData.authData.user._id;
      const updatedUserData = {
        username: editFormData.username,
        email: editFormData.email,
        contact_number: editFormData.contact_number,
      };
      console.log(updatedUserData)
      const response = await axios.put(`http://localhost:5000/user/edit/${userid}`, updatedUserData);
      console.log("User data updated:", response.data);
      // Refresh user data after update
      // fetchUserData();
      // Close edit form after submission
      setUser(response.data);
      toggleEditForm();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <Navbar/>
      {user && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="col-span-4 md:col-span-4 bg-gray-100 p-4 rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">User Details</h3>
                  <button
                    onClick={toggleEditForm}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-gray-700">
                  <strong>Contact Number:</strong> {user.contact_number}
                </p>
              </div>

              <div className="col-span-1 md:col-span-1 bg-gray-100 p-4 rounded-lg relative overflow-hidden">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Rank:</h3>
                <div className="font-bold text-7xl text-yellow-500 text-center">{user.rank}</div>
              </div>
            </div>
          </div>

          {editing && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                    Contact Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="contact_number"
                    type="text"
                    placeholder="Contact Number"
                    name="contact_number"
                    value={editFormData.contact_number}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none mr-4"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none"
                    type="button"
                    onClick={toggleEditForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions Solved</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800">Easy</h4>
                <p className="text-2xl font-bold text-gray-800">{questionsSolved.easy}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800">Medium</h4>
                <p className="text-2xl font-bold text-gray-800">{questionsSolved.medium}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800">Hard</h4>
                <p className="text-2xl font-bold text-gray-800">{questionsSolved.hard}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-bold mb-2">Daily Submissions</h3>
            <h3 className="font-semibold text-lg text-green-500 py-2">{tooltipContent}</h3>
            <CalendarHeatmap
              startDate={new Date(new Date().getFullYear(), 0, 1)}
              endDate={new Date(new Date().getFullYear(), 11, 31)}
              values={yearlyStats}
              showOutOfRangeDays={false}
              showWeekdayLabels={true}
              showMonthLabels={false}
              gutterSize={4}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return "color-empty";
                }
                return `color-github-${value.count}`;
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": value ? `${value.date} | Submissions: ${value.count}` : "No submissions",
              })}
              onMouseOver={(e, value) => {
                handleMouseEnter(value);
              }}
              onClick={(value) => {
                if (value == null) {
                  setClickedSquare("No submissions found on this date");
                } else {
                  setClickedSquare(`Date: ${value.date} Submissions: ${value.count}`);
                }
              }}
            />
            <ReactTooltip id="tooltip" getContent={() => tooltipContent} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Submissions History</h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-center">Date</th>
                  <th className="py-3 px-6 text-center">Problem</th>
                  <th className="py-3 px-6 text-center">Language</th>
                  <th className="py-3 px-6 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {currentSubmissions.map((submission, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-3 px-6 text-center">{new Date(submission.date).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">{submission.problem}</td>
                    <td className="py-3 px-6 text-center">{submission.language}</td>
                    <td
                      className={`py-3 px-6 text-center ${
                        submission.verdict === "Pass" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {submission.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
              <nav className="block">
                <ul className="flex pl-0 rounded list-none flex-wrap">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200 ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 hover:bg-gray-200 ${
                          currentPage === index + 1 ? "font-bold bg-gray-200" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200 ${
                        currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
