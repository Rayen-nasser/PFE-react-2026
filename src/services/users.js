import client from './client';

const userService = {
  getAll: () => client.get('/users/getAllUsers'),
  getById: (id) => client.get(`/users/${id}`),
  update: (id, data) => client.put(`/users/${id}`),
  delete: (id) => client.delete(`/users/${id}`),
  block: (id) => client.put(`/users/${id}/block`),
  unblock: (id) => client.put(`/users/${id}/unblock`),
  changeRole: (id, role) => client.put(`/users/${id}/role`, { role }),
};

export default userService;
