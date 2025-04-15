import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

const apiService = {
  login: async (credentials) => {
    return axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
  },
  
  register: async (userData) => {
    return axios.post(`${API_BASE_URL}/api/auth/register`, userData);
  }
};

export default apiService;