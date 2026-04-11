import client from './client';

const authService = {
  register:       (data) => client.post('/users/register-with-image', data),
  login:          (data) => client.post('/users/login', data),
  logout:         ()     => client.post('/users/logout'),
  forgotPassword: (data) => client.post('/users/forgot-password', data),
  resetPassword:  (data) => client.post('/users/reset-password', data),
  changePassword: (data) => client.post('/users/change-password', data),
  getProfile:     ()     => client.get('/users/me'),
  updateProfile:  (id, data) => client.put(`/users/${id}`, data),
  deleteAccount:  (id)   => client.delete(`/users/${id}`),
};

export default authService;