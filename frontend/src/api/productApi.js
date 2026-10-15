import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get('/products');
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
export const adminGetProducts = () => axiosInstance.get('/products');
export const adminCreateProduct = (data) => axiosInstance.post('/admin/products', data);
export const adminUpdateProduct = (id, data) => axiosInstance.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id) => axiosInstance.delete(`/admin/products/${id}`);
