import { Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import { useContext } from "react";
const Navbar=()=>{
    const authData = useContext(AuthContext);
  const isLoggedIn = authData.authData !== null;
  console.log(authData.authData)
    return  <nav className="bg-yellow-200 text-yellow-600 shadow-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Codebuilders
      </Link>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>
        </li>
        <li>
          <Link to={isLoggedIn ? '/allproblems' : '/login'} className="hover:text-yellow-300">
            All problems
          </Link>
        </li>
        <li>
          <Link to={isLoggedIn ? '/leaderboard' : '/login'} className="hover:text-yellow-300">
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
        <li>
          <Link to={isLoggedIn ? '/profile' : '/login'} className="hover:text-yellow-300">
            Profile
          </Link>
        </li>

      </ul>
    </div>
  </nav>

}

export default Navbar;
