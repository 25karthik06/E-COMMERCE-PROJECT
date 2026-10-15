import axiosInstance from './axiosInstance';

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put('/users/profile', profileData);
  return response.data;
};
