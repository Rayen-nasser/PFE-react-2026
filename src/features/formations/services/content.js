import client from '../../../services/client';

export const avisService = {
  getAll:         ()         => client.get('/avis/getAllAvis'),
  getByFormation: (id)       => client.get(`/avis/formation/${id}`),
  create:         (data)     => client.post('/avis/createAvis', data),
  update:         (id, data) => client.put(`/avis/updateAvis/${id}`, data),
  delete:         (id)       => client.delete(`/avis/deleteAvis/${id}`),
};

export const leconService = {
  getAll:        (params) => client.get('/lecons', { params }),
  getById:       (id)     => client.get(`/lecons/${id}`),
  getByFormation:(id)     => client.get('/lecons', { params: { formationId: id } }),
  create:        (data)   => client.post('/lecons', data),
  update:        (id, data) => client.put(`/lecons/${id}`, data),
  delete:        (id)     => client.delete(`/lecons/${id}`),
};

export const contentService = {
  getAll:     ()         => client.get('/contents'),
  getByLecon: (id)       => client.get(`/contents/getByLecon/${id}`),
  create:     (data)     => client.post('/contents/create', data),
  update:     (id, data) => client.put(`/contents/${id}`, data),
  delete:     (id)       => client.delete(`/contents/${id}`),
};
