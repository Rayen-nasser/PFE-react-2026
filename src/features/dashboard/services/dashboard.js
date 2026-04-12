import client from '../../../services/client';

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

export const favoriService = {
  getAll:        ()         => client.get('/favoris'),
  getMyFavoris:  ()         => client.get('/favoris/me'),
  getByApprenant:(id)       => client.get(`/favoris/apprenant/${id}`),
  add:           (data)     => client.post('/favoris', data),
  remove:        (id)       => client.delete(`/favoris/${id}`),
};
