import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/categories');
export const adminCreateCategory = (data) => axiosInstance.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => axiosInstance.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id) => axiosInstance.delete(`/admin/categories/${id}`);
