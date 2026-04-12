import client from '../../../services/client';

const centreService = {
  getAll: () => client.get('/centres'),
  getById: (id) => client.get(`/centres/${id}`),
  create: (data) => client.post('/centres', data),
  update: (id, data) => client.put(`/centres/${id}`, data),
  delete: (id) => client.delete(`/centres/${id}`),
};

export default centreService;