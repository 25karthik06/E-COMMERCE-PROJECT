import axiosInstance from './axiosInstance';

export const getCart = () => axiosInstance.get('/cart');
export const addToCart = (data) => axiosInstance.post('/cart/add', data);
export const updateCartItem = (data) => axiosInstance.put('/cart/update', data);
export const removeFromCart = (productId) => axiosInstance.delete(`/cart/remove/${productId}`);
