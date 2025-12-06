import axios from 'axios';
import { API_BASE_URL } from './api';

console.log("API Base URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log("Making request to:", config.baseURL + config.url);
    console.log("Token:", token ? "Present" : "Not present");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response success:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedInUser');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
