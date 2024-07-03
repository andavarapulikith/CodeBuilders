// src/App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AllProblems from './components/Allproblems';
import SingleProblem from './components/SingleProblem';
import LeaderboardPage from './components/Leaderboard';
import UserProfile from './components/Profile';
import IDE from './components/IDE';
import AddProblemPage from './components/AddProblem';
import TextEditor from './components/TextEditor';
import AdminDashboard from './components/Admin';
import SubmissionsPage from './components/Allsubmissions';
import UsersPage from './components/AllUsers';
import AllQuestionsPage from './components/AllQuestions';
import ContestPage from './components/ContestPage';
function App() {
  const router=createBrowserRouter(
    [{
     path: '/',
      element: <Home></Home>

    },
    {
      path:'/login',
      element:<Login></Login>
    },
    {
      path:'/signup',
      element:<Signup></Signup>
    },
    {
      path:'/allproblems',
      element:<AllProblems></AllProblems>
    },
    {
      path:'/problem/:id',
      element:<SingleProblem></SingleProblem>
    },{
      path:'/leaderboard',
      element:<LeaderboardPage></LeaderboardPage>
    },{
      path:'/profile',
      element:<UserProfile></UserProfile>
    },{
      path:'/ide',
      element:<IDE></IDE>
    },{
      path:'/addproblem',
      element:<AddProblemPage></AddProblemPage>
    },{
      path:'/texteditor',
      element:<TextEditor></TextEditor>
    },{
      path:'/admin',
      element:<AdminDashboard></AdminDashboard>
    },{
      path:'/allsubmissions',
      element:<SubmissionsPage></SubmissionsPage>
    },{
      path:'/allusers',
      element:<UsersPage></UsersPage>
    },{
      path:'/allquestions',
      element:<AllQuestionsPage></AllQuestionsPage>
    },{
      path:'/contest',
      element:<ContestPage></ContestPage>
    }

    ]
  )
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  );
}

export default App;
