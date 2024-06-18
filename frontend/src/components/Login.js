import React, { useState } from 'react';
import loginimage from '../loginimage.jpg';
import googleIcon from '../google icon.jpeg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/authProvider';
import { useContext } from 'react';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
        const { user, token } = response.data;
        login(user, token);
        navigate("/allproblems")
      } catch (error) {
        console.error('Login error:', error);
        // Handle error (e.g., show error message)
      }
    }
  };

  const goToRegister = () => {
    navigate("/signup")
  };

  const handleGoogleLogin = () => {
    console.log('Continue with Google clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block w-1/2">
          <img src={loginimage} alt="Login" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Login</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition duration-300"
            >
              Login
            </button>
          </form>
          {serverResponse && <p className="mt-4 text-center text-red-500">{serverResponse}</p>}
          <button
            onClick={goToRegister}
            className="mt-4 w-full text-yellow-600 border border-yellow-600 p-3 rounded-lg hover:bg-yellow-100 transition duration-300"
          >
            Go to Register
          </button>
          {/* <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full bg-gray-200 text-gray-800 flex items-center justify-center p-3 rounded-lg hover:bg-gray-300 transition duration-300"
          >
           <img src={googleIcon} alt="Google" className="w-6 h-6 mr-2" />
            Continue with Google 
            <GoogleLogin
  onSuccess={credentialResponse => {
    var credentialResponsesuccess=jwtDecode(credentialResponse.credential)
    console.log(credentialResponsesuccess);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
