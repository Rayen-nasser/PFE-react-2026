import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

export const authService = {
  register: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/users/registerWithImage', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  forgotPassword: (data) => api.post('/users/forgot-password', data),
  resetPassword: (data) => api.post('/users/reset-password', data),

  getProfile: () => api.get('/users/getMyProfile'),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  deleteAccount: (id) => api.delete(`/users/${id}`),
  changePassword: (data) => api.post('/users/change-password', data),
};

export const centreService = {
  getAll: () => api.get('/centres'),
  getById: (id) => api.get(`/centres/${id}`),
  create: (data) => api.post('/centres', data),
  update: (id, data) => api.put(`/centres/${id}`, data),
  delete: (id) => api.delete(`/centres/${id}`),
};

export const formationService = {
  getAll: (params) => api.get('/formations', { params }),
  getById: (id) => api.get(`/formations/${id}`),
  getByCentre: (centreId) => api.get('/formations', { params: { centreId } }),
  getByCategorie: (categorieId) => api.get('/formations', { params: { categorieId } }),
  create: (data) => api.post('/formations', data),
  update: (id, data) => api.put(`/formations/${id}`, data),
  delete: (id) => api.delete(`/formations/${id}`),
};

export const leconService = {
  getAll: (params) => api.get('/lecons', { params }),
  getById: (id) => api.get(`/lecons/${id}`),
  getByFormation: (formationId) => api.get('/lecons', { params: { formationId } }),
  create: (data) => api.post('/lecons', data),
  update: (id, data) => api.put(`/lecons/${id}`, data),
  delete: (id) => api.delete(`/lecons/${id}`),
};

export const contentService = {
  getAll: () => api.get('/contents'),
  getByLecon: (leconId) => api.get(`/contents/getByLecon/${leconId}`),
  create: (data) => api.post('/contents/create', data),
  update: (id, data) => api.put(`/contents/${id}`, data),
  delete: (id) => api.delete(`/contents/${id}`),
};

export const inscriptionService = {
  getAll: () => api.get('/inscriptions'),
  getMyInscriptions: () => api.get('/inscriptions/my'),
  getById: (id) => api.get(`/inscriptions/${id}`),
  create: (data) => api.post('/inscriptions', data),
  update: (id, data) => api.put(`/inscriptions/${id}`, data),
  delete: (id) => api.delete(`/inscriptions/${id}`),
};

export const paiementService = {
  getAll: () => api.get('/paiements'),
  getMyPaiements: () => api.get('/paiements/my'),
  getById: (id) => api.get(`/paiements/${id}`),
  create: (data) => api.post('/paiements', data),
  update: (id, data) => api.put(`/paiements/${id}`, data),
};

export const avisService = {
  getAll: () => api.get('/avis/getAllAvis'),
  getByFormation: (formationId) => api.get(`/avis/formation/${formationId}`),
  create: (data) => api.post('/avis/createAvis', data),
  update: (id, data) => api.put(`/avis/updateAvis/${id}`, data),
  delete: (id) => api.delete(`/avis/deleteAvis/${id}`),
};

export const favoriService = {
  getAll: () => api.get('/favoris/getAllFavoris'),
  getByApprenant: (apprenantId) => api.get(`/favoris/getFavorisByApprenant/${apprenantId}`),
  add: (data) => api.post('/favoris/createFavori', data),
  remove: (id) => api.delete(`/favoris/deleteFavori/${id}`),
};

export const categorieService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
