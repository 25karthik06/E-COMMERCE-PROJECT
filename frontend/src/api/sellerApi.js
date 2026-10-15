import axiosInstance from './axiosInstance';

export const getSellerProducts = (params) => axiosInstance.get('/seller/products', { params });
export const createSellerProduct = (data) => axiosInstance.post('/seller/products', data);
export const updateSellerProduct = (id, data) => axiosInstance.put(`/seller/products/${id}`, data);
export const deleteSellerProduct = (id) => axiosInstance.delete(`/seller/products/${id}`);
