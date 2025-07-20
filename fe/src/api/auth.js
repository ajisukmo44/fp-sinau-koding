import api from './config';

export const login = async (username, password) => {
  const response = await api.post('/auth/admin/login', { username, password });
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/cashier/register', data);
  return response.data;
};

export const loginCashier = async (username, password) => {
  const response = await api.post('/auth/cashier/login', { username, password });
  return response.data;
};

export const restPasswordCashier = async (email) => {
  const response = await api.post('/auth/cashier/reset-password', { email });
  return response.data;
};