// src/api.js
// Centralized axios instance

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ec_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
