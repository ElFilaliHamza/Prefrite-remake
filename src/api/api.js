import axios from 'axios';
console.log('API URL:', process.env.REACT_APP_API_URL); // Add this line to debug

const api = axios.create({
    baseURL: "http://localhost:80", // Adjusted to match your server's port
    withCredentials: true
  });
  
export default api;



