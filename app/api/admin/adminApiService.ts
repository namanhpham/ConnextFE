import { axiosInstance } from "../axiosInstance";

export const getTotalOnlineUsers = async () => {
  const response = await axiosInstance.get('/dashboard/online-users');
  return response.data;
}

export const getTotalUsers = async () => {
  const resposne = await axiosInstance.get('/dashboard/total-users');
  return resposne.data;
}

export const getTotalUserPerMonth = async () => {
  const resposne = await axiosInstance.get('/dashboard/users-per-month');
  return resposne.data;
}

export const getUserPaginated = async (limit: number, offset: number, status?: string) => {
  const response = await axiosInstance.get(`/dashboard/users?limit=${limit}&offset=${offset}${status ? `&status=${status}` : ''}`);
  return response.data;
};
