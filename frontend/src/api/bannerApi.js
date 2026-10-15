import axiosInstance from './axiosInstance';

export const getActiveBanners = () => axiosInstance.get('/banners');
export const getAllBanners = () => axiosInstance.get('/admin/banners');
export const createBanner = (data) => axiosInstance.post('/admin/banners', data);
export const updateBanner = (id, data) => axiosInstance.put(`/admin/banners/${id}`, data);
export const deleteBanner = (id) => axiosInstance.delete(`/admin/banners/${id}`);
