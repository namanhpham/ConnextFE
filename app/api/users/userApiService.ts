import { axiosInstance } from "../axiosInstance";

// offset here means the number of pages to skip
const getAllUsers = async (offset: number, limit: number) => {
  const response = await axiosInstance.get(`/users?offset=${offset}&limit=${limit}`);
  return response.data;
};

const searchUser = async (searchTerm: string, offset: number, limit: number) => {
    const response = await axiosInstance.get(`/users/search?query=${searchTerm}&offset=${offset}&limit=${limit}`);
    return response.data;
};

export { getAllUsers, searchUser };
