import { post } from './base';

export const loginUserApi = (data: { email: string; password: string }) => {
  return post('/users/login', data);
};

export const signupUserApi = (data: { name: string; email: string; password: string }) => {
  return post('/users/register', data);
};

export const sendResetPasswordLinkApi = (email: string) => {
  return post('/users/forgot-password', { email });
};
  
export const resetPasswordApi = (token: string, data: { password: string }) => {
    console.log('resetPasswordApi is called. token:', token, 'data:', data); // Debug log
  return post(`/users/reset-password/${token}`, data);
};