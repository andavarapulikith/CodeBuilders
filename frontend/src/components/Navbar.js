import { Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const authData = useContext(AuthContext);
  const isLoggedIn = authData.authData !== null;
  const navigate=useNavigate();
  return (
    <nav className="bg-yellow-200 text-yellow-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Codebuilders
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-yellow-300 font-semibold">
              Home
            </Link>
          </li>
          <li>
            <Link to={isLoggedIn ? '/allproblems' : '/login'} className="hover:text-yellow-300 font-semibold">
              All problems
            </Link>
          </li>
          <li>
            <Link to={isLoggedIn ? '/leaderboard' : '/login'} className="hover:text-yellow-300 font-semibold">
              Leaderboard
            </Link>
          </li>
          
          <li>
            <Link to="/ide" className="hover:text-yellow-300 font-semibold">
              Online IDE
            </Link>
          </li>
          {isLoggedIn  && (
            <li>
              <Link to="/profile" className="hover:text-yellow-300 font-semibold">
                Profile
              </Link>
            </li>
          )}
          {isLoggedIn && authData.authData.role === "admin" && (
            <li>
              <Link to="/admin" className="hover:text-yellow-300 font-semibold">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
        <div>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="mr-4 hover:text-yellow-300 font-semibold">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300 font-semibold">
                Signup
              </Link>
            </>
          ) : (
            <>
            
            
            <button
              onClick={() => {
                // Implement the logout functionality here
                authData.logout();
                navigate("/")
              }}
              className="hover:text-yellow-300 font-semibold "
            >
              Logout
            </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
