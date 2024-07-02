import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const AdminDashboard = () => {
  const difficultyChartRef = useRef(null);
  const submissionChartRef = useRef(null);
  const [loading,setLoading]=useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [questionsByDifficulty, setQuestionsByDifficulty] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [submissionStatistics, setSubmissionStatistics] = useState({
    labels: [],
    datasets: [
      {
        label: "Submissions",
        data: [],
        borderColor: "#3182CE",
        backgroundColor: "rgba(49, 130, 206, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  });
  const [topRankers, setTopRankers] = useState([]);
  const [topSolvedQuestions, setTopSolvedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/admin");
        const data = response.data;

        setTotalQuestions(data.totalQuestions);
        setTotalUsers(data.totalUsers);
        setTotalSubmissions(data.totalSubmissions);
        setQuestionsByDifficulty(data.questionsByDifficulty);

        const submissionLabels = data.submissionStatistics.map(
          (stat) => stat._id
        );
        const submissionData = data.submissionStatistics.map(
          (stat) => stat.count
        );

        setSubmissionStatistics({
          labels: submissionLabels,
          datasets: [
            {
              label: "Submissions",
              data: submissionData,
              borderColor: "#3182CE",
              backgroundColor: "rgba(49, 130, 206, 0.2)",
              borderWidth: 2,
              fill: true,
            },
          ],
        });

        setTopRankers(data.topRankers);
        setTopSolvedQuestions(data.topSolvedQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false)
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initializeCharts = () => {
      if (difficultyChartRef.current && difficultyChartRef.current.chart) {
        difficultyChartRef.current.chart.destroy();
      }

      const difficultyCtx = difficultyChartRef.current.getContext("2d");
      difficultyChartRef.current.chart = new Chart(difficultyCtx, {
        type: "doughnut",
        data: {
          labels: ["Easy", "Medium", "Hard"],
          datasets: [
            {
              label: "Questions by Difficulty",
              data: Object.values(questionsByDifficulty),
              backgroundColor: ["#48BB78", "#FCD12A", "#E53E3E"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });

      if (submissionChartRef.current && submissionChartRef.current.chart) {
        submissionChartRef.current.chart.destroy();
      }

      const submissionCtx = submissionChartRef.current.getContext("2d");
      submissionChartRef.current.chart = new Chart(submissionCtx, {
        type: "line",
        data: submissionStatistics,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Days",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Submissions",
              },
            },
          },
        },
      });
    };

    initializeCharts();

    return () => {
      if (difficultyChartRef.current && difficultyChartRef.current.chart) {
        difficultyChartRef.current.chart.destroy();
      }
      if (submissionChartRef.current && submissionChartRef.current.chart) {
        submissionChartRef.current.chart.destroy();
      }
    };
  }, [questionsByDifficulty, submissionStatistics]);

  return (
    <div className="flex min-h-screen bg-gray-100">

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

      {/* Main Content Area */}
      {loading?(
          <div className="text-white text-center ml-auto mr-auto mt-10">
            <ClipLoader color="#000000" size={60} />
          </div>
        ):
      <div className="flex-1 p-10">
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Questions Count */}
            <div className="bg-gray-100 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">Total Questions</h2>
              <p className="text-3xl font-bold text-gray-800">
                {totalQuestions}
              </p>
            </div>

            {/* Total Users Count */}
            <div className="bg-gray-100 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
            </div>

            {/* Total Submissions Count */}
            <div className="bg-gray-100 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">Total Submissions</h2>
              <p className="text-3xl font-bold text-gray-800">
                {totalSubmissions}
              </p>
            </div>

            {/* Questions by Difficulty Level */}
            <div className="bg-gray-100 rounded-lg shadow-md col-span-1 p-4">
              <h2 className="text-lg font-semibold">Questions by Difficulty</h2>
              <canvas ref={difficultyChartRef} className="h-10"></canvas>
            </div>

            {/* Top Rankers */}
            <div className="bg-gray-100 rounded-lg shadow-md col-span-2 p-4">
              <h2 className="text-lg font-semibold">Top Rankers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topRankers.map((ranker, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ranker.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rank {ranker.rank}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submission Statistics */}
            <div className="col-span-2 lg:col-span-3 bg-gray-100 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">Submission Statistics</h2>
              <canvas ref={submissionChartRef} className="h-40"></canvas>
            </div>

            {/* Most Submitted Questions */}
            <div className="bg-gray-100 rounded-lg shadow-md col-span-3 p-4">
              <h2 className="text-lg font-semibold">
                Most Submitted Questions
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSolvedQuestions.map((question, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {question.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-bold">
                            {question.submissionCount}
                          </span>{" "}
                          submissions
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default AdminDashboard;
