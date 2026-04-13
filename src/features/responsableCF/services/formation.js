import client from '../../../services/client';

export const formationService = {
  getAll: (params = {}) => client.get('/formations', { params }),
  getMyAssignments: () => client.get('/formations/my-assignments'),
  getById: (id) => client.get(`/formations/${id}`),
  create: (data) => client.post('/formations', data),
  update: (id, data) => client.post(`/formations/${id}`, data),
  delete: (id) => client.delete(`/formations/${id}`),
  getFormateurs: (id) => client.get(`/formations/${id}/formateurs`),
  getAvailableFormateurs: () => client.get('/formations/formateurs'),
  assignFormateurs: (id, formateurIds) => client.post(`/formations/${id}/formateurs`, { formateurIds }),
  removeFormateur: (formationId, formateurId) => client.delete(`/formations/${formationId}/formateurs/${formateurId}`),
};
