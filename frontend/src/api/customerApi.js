import axiosInstance from './axiosInstance';

export const adminGetCustomers = () => axiosInstance.get('/admin/customers');
export const adminGetCustomerById = (id) => axiosInstance.get(`/admin/customers/${id}`);
export const adminSwitchUserRole = (id) => axiosInstance.post(`/admin/customers/${id}/switch-role`);
export const adminRejectSellerRequest = (id) => axiosInstance.post(`/admin/customers/${id}/reject-seller-request`);
export const adminToggleUserStatus = (id) => axiosInstance.post(`/admin/customers/${id}/toggle-active`);

export const adminGetUsers = () => axiosInstance.get('/admin/users');
export const adminGetUserById = (id) => axiosInstance.get(`/admin/users/${id}`);

export const adminGetAdmins = () => axiosInstance.get('/admin/admins');
export const adminGetAdminById = (id) => axiosInstance.get(`/admin/admins/${id}`);

export const requestSellerRole = () => axiosInstance.post('/users/request-seller');
