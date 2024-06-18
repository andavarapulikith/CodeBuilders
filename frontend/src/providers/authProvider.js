import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      const user = JSON.parse(userData);
      
      setAuthData({ user, token });
      axios.defaults.headers.common['Authorization'] = token; // Removed Bearer prefix
    }
  }, []);

  const login = async (user, token) => {
    Cookies.set('token', token, { expires: 7 }); // Store token in cookie for 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    setAuthData({ user, token });
    axios.defaults.headers.common['Authorization'] = token; // Removed Bearer prefix
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setAuthData(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
