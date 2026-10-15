import axiosInstance from './axiosInstance';

export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}/reviews`);
  return response.data;
};

export const addReview = async (productId, reviewData) => {
  const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};
