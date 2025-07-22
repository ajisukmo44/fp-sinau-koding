import axios from 'axios';

const API_BASE_URL = 'https://sinau-be-i81w.vercel.app/api';
const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

export default api;