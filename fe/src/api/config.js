import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
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