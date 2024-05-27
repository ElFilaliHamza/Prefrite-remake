import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:80', // Adjusted to match your server's port
    withCredentials: true
  });
  
export default api;
