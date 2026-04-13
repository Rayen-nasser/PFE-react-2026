import client from '../../../services/client';

export const inscriptionService = {
  getAll: () => client.get('/inscriptions'),
  getMyInscriptions: () => client.get('/inscriptions/me'),
  getById: (id) => client.get(`/inscriptions/${id}`),
  create: (data) => client.post('/inscriptions', data),
  delete: (id) => client.delete(`/inscriptions/${id}`),
};
