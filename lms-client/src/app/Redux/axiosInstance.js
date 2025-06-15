// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('user');
  console.log('user info at axios instance', userInfo);
  
  const token = userInfo ? JSON.parse(userInfo).token : null;
  console.log('token is', token);
  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
