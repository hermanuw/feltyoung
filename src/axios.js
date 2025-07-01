// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://feltyoung-be.up.railway.app/api'
});

// Interceptor: selalu ambil token terbaru sebelum request dikirim
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default axiosInstance;
