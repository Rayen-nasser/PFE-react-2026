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
  getAll: (params) => api.get('/formations/getAllFormations', { params }),
  getById: (id) => api.get(`/formations/getFormationById/${id}`),
  getByCentre: (centreId) => api.get(`/formations/centre/${centreId}`),
  create: (data) => api.post('/formations/createFormation', data),
  update: (id, data) => api.put(`/formations/updateFormation/${id}`, data),
  delete: (id) => api.delete(`/formations/deleteFormation/${id}`),
};

export const leconService = {
  getAll: () => api.get('/lecons'),
  getById: (id) => api.get(`/lecons/${id}`),
  getByFormation: (formationId) => api.get(`/lecons/formation/${formationId}`),
  create: (data) => api.post('/lecons', data),
  update: (id, data) => api.put(`/lecons/${id}`, data),
  delete: (id) => api.delete(`/lecons/${id}`),
};

export const contentService = {
  getAll: () => api.get('/contents'),
  getByLecon: (leconId) => api.get(`/contents/lecon/${leconId}`),
  create: (data) => api.post('/contents', data),
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
  getAll: () => api.get('/avis'),
  getByFormation: (formationId) => api.get(`/avis/formation/${formationId}`),
  create: (data) => api.post('/avis', data),
  update: (id, data) => api.put(`/avis/${id}`, data),
  delete: (id) => api.delete(`/avis/${id}`),
};

export const favoriService = {
  getAll: () => api.get('/favoris'),
  add: (data) => api.post('/favoris', data),
  remove: (id) => api.delete(`/favoris/${id}`),
};

export const categorieService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
