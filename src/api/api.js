import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Adjusted to match your server's port
    withCredentials: true
  });
  
export default api;



