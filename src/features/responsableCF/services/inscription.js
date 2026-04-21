import client from '../../../services/client';

export const inscriptionService = {
  getAll: () => client.get('/inscriptions'),
  getMyInscriptions: () => client.get('/inscriptions/me'),
  getById: (id) => client.get(`/inscriptions/${id}`),
  create: (data) => client.post('/inscriptions', data),
  cancel: (id) => client.put(`/inscriptions/cancel/${id}`),
  reject: (id) => client.put(`/inscriptions/reject/${id}`),
  reactivate: (id) => client.put(`/inscriptions/reactivate/${id}`),
};

export const paiementService = {
  confirm: (id) => client.post(`/paiements/confirm/${id}`),
};
