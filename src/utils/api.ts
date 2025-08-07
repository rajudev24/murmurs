
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : {};

  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (parsedUser && parsedUser.id) {
    config.headers['X-User-Id'] = parsedUser.id;
  }

  return config;
});

export default api;
