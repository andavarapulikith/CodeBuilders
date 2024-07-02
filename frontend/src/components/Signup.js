import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupimage from '../signupimage3.png';
import axios from 'axios';
import {toast} from 'sonner'
import { backendurl } from '../backendurl';
function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required';
    }
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
    if (!contact) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = 'Contact number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      axios.post(`${backendurl}/auth/signup`, { username, email, password, contact })
        .then((res) => {
          if (res.status === 200) {
            toast.success('User registered successfully');
            setErrors({});
            setUsername('');
            setEmail('');
            setPassword('');
            setContact('');
            navigate('/login');
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            toast.error(err.response.data.message);
            setErrors({ email: err.response.data.message });
          } else {
            console.error('Error:', err);
          }
        });
        setLoading(false)
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Sign Up</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
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
            <div className="mb-4">
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
            <div className="mb-6">
              <label htmlFor="contact" className="block text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full p-3 border rounded-lg ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          {loading && <p className="mt-4 text-center font-semibold text-gray-500">Loading...</p>}
          <button
            onClick={goToLogin}
            className="mt-4 w-full text-yellow-600 border border-yellow-600 p-3 rounded-lg hover:bg-yellow-100 transition duration-300"
          >
            Go to Login
          </button>
        </div>
        <div className="hidden md:block w-1/2">
          <img src={signupimage} alt="Signup" className="object-contain w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
