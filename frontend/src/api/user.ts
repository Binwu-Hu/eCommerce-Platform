import { post } from './base';

export const loginUserApi = (data: { email: string; password: string }) => {
  return post('/users/login', data);
};

export const signupUserApi = (data: { name: string; email: string; password: string }) => {
  return post('/users/register', data);
};
