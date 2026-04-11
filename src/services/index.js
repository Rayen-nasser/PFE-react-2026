import client from './client';
export const inscriptionService = {
  getAll:            ()         => client.get('/inscriptions'),
  getMyInscriptions: ()         => client.get('/inscriptions/me'),
  getById:           (id)       => client.get(`/inscriptions/${id}`),
  create:            (data)     => client.post('/inscriptions', data),
  update:            (id, data) => client.put(`/inscriptions/${id}`, data),
  delete:            (id)       => client.delete(`/inscriptions/${id}`),
};

export const paiementService = {
  getAll:         ()         => client.get('/paiements'),
  getMyPaiements: ()         => client.get('/paiements/my'),
  getById:        (id)       => client.get(`/paiements/${id}`),
  create:         (data)     => client.post('/paiements', data),
  update:         (id, data) => client.put(`/paiements/${id}`, data),
  confirm:        (id)       => client.put(`/paiements/${id}/confirm`),
  cancel:         (id)       => client.put(`/paiements/${id}/cancel`),
};

export const avisService = {
  getAll:         ()         => client.get('/avis/getAllAvis'),
  getByFormation: (id)       => client.get(`/avis/formation/${id}`),
  create:         (data)     => client.post('/avis/createAvis', data),
  update:         (id, data) => client.put(`/avis/updateAvis/${id}`, data),
  delete:         (id)       => client.delete(`/avis/deleteAvis/${id}`),
};

export const favoriService = {
  getAll:        ()         => client.get('/favoris'),
  getMyFavoris:  ()         => client.get('/favoris/me'),
  getByApprenant:(id)       => client.get(`/favoris/apprenant/${id}`),
  add:           (data)     => client.post('/favoris', data),
  remove:        (id)       => client.delete(`/favoris/${id}`),
};

export const categorieService = {
  getAll:  ()         => client.get('/categories'),
  getById: (id)       => client.get(`/categories/${id}`),
  create:  (data)     => client.post('/categories', data),
  update:  (id, data) => client.put(`/categories/${id}`, data),
  delete:  (id)       => client.delete(`/categories/${id}`),
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