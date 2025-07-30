import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getProducts(params) {
    return apiClient.get('/products', { params });
  },
  getProductById(id) {
    return apiClient.get(`/products/${id}`);
  },
  getProductTypes() {
    return apiClient.get('/productTypes');
  },
  addProduct(data) {
    return apiClient.post('/products', data);
  },
  updateProduct(id, data) {
    return apiClient.put(`/products/${id}`, data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};