import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const warehouseService = {
  getAll: () => api.get('/warehouses'),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`)
};

export const movementService = {
  getAll: (params) => api.get('/inventory-movements', { params }),
  getById: (id) => api.get(`/inventory-movements/${id}`),
  create: (data) => api.post('/inventory-movements', data),
  update: (id, data) => api.put(`/inventory-movements/${id}`, data),
  delete: (id) => api.delete(`/inventory-movements/${id}`)
};

export const reportService = {
  getInventorySummary: () => api.get('/reports/inventory-summary'),
  getMovementsByPeriod: (params) => api.get('/reports/movements-by-period', { params }),
  getTopProducts: (params) => api.get('/reports/top-products', { params }),
  getLowStock: () => api.get('/reports/low-stock'),
  getCategoryDistribution: () => api.get('/reports/category-distribution')
};
