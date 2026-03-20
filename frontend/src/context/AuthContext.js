// src/context/AuthContext.js
// Global authentication state using React Context API

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // check localStorage on startup

  // On app load, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ec_token');
    const storedUser = localStorage.getItem('ec_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Login: save token & user to state + localStorage
  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('ec_token', tokenData);
    localStorage.setItem('ec_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
  };

  // Logout: clear everything
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ec_token');
    localStorage.removeItem('ec_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
