import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const rawUrl = String(config.url || '');
  const path = rawUrl.replace(/^https?:\/\/[^/]+\/api\/?/, '');
  const adminRoute = /^(\/?admin|\/?contact\/admin|\/?ai)(\/|$)/.test(path);
  const adminToken = localStorage.getItem('campusnest_admin_token') || localStorage.getItem('mca_admin_token');
  const userToken = localStorage.getItem('campusnest_user_token');
  const token = adminRoute ? adminToken : userToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
