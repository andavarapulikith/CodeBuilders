// src/ContestPage.js
import React from 'react';

const ContestPage = () => {
  const contest = {
    title: "Coding Contest 2024",
    description: "Participate in our annual coding contest to win exciting prizes!",
    startTime: "2024-07-10 10:00:00",
    endTime: "2024-07-10 13:00:00",
    questions: [
      { id: 1, title: "Two Sum", difficulty: "Easy" },
      { id: 2, title: "Reverse Linked List", difficulty: "Medium" },
      { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Hard" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
        <p className="text-gray-700 mb-4">{contest.description}</p>
        <div className="mb-4">
          <span className="font-bold">Start Time:</span> {new Date(contest.startTime).toLocaleString()}
        </div>
        <div className="mb-4">
          <span className="font-bold">End Time:</span> {new Date(contest.endTime).toLocaleString()}
        </div>
        <h2 className="text-2xl font-bold mb-4">Questions</h2>
        <ul className="space-y-4">
          {contest.questions.map((question) => (
            <li key={question.id} className="bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{question.title}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                question.difficulty === "Easy" ? "bg-green-200 text-green-800" :
                question.difficulty === "Medium" ? "bg-yellow-200 text-yellow-800" :
                "bg-red-200 text-red-800"
              }`}>
                {question.difficulty}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContestPage;
