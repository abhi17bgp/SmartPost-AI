import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smartpost-ai-un1e.onrender.com/api', // Use Vite proxy in prod, absolute url for dev
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear user data and perhaps redirect to login
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
