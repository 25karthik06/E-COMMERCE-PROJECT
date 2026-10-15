import axiosInstance from './axiosInstance';

export const getWallet = async () => {
  const response = await axiosInstance.get('/wallet');
  return response.data;
};

export const addMoney = async (addMoneyRequest) => {
  const response = await axiosInstance.post('/wallet/add-money', addMoneyRequest);
  return response.data;
};
