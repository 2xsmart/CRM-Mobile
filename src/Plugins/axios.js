// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://stage.2xsmart.net/api',
  timeout: 10000, // optional timeout in ms
});
// const api = axios.create({
//   baseURL: 'http://192.168.1.128:4000',
//   timeout: 10000, // optional timeout in ms
// });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
