import axiosInstance from './axiosInstance';

export const applyCoupon = (code) => axiosInstance.post(`/coupons/apply?code=${code}`);
export const adminGetCoupons = () => axiosInstance.get('/admin/coupons');
export const adminGetCouponById = (id) => axiosInstance.get(`/admin/coupons/${id}`);
export const adminCreateCoupon = (data) => axiosInstance.post('/admin/coupons', data);
export const adminUpdateCoupon = (id, data) => axiosInstance.put(`/admin/coupons/${id}`, data);
