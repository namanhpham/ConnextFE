import { axiosInstance } from "./axiosInstance";
import * as userApiService from "./users/userApiService";

const authLogin = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/sign-in", {
    email,
    password,
  });

  return response.data;
};

const authRegister = async (
  email: string,
  password: string,
  username: string
) => {
  const response = await axiosInstance.post("/auth/sign-up", {
    email,
    password,
    username,
  });

  return response.data;
};

const authLogout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

const updateProfile = async (data: any, userId: string) => {
  const response = await axiosInstance.patch(`/users/${userId}`, data);
  return response.data;
};

export { authLogin, authRegister, authLogout, updateProfile, userApiService };
