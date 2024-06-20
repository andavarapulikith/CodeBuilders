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
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  const login = async (user, token) => {
   
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + (24 * 60 * 60 * 1000)); 
  
    Cookies.set('token', token, { expires: expiration });
    Cookies.set('user', JSON.stringify(user), { expires: expiration });
    setAuthData({ user, token });
    axios.defaults.headers.common['Authorization'] = token; 
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
