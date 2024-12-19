import axios from "axios";
import { authApiService } from "./apiService";
import { initializeSocket, getSocket, disconnectSocket } from "../utils/socket";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!backendUrl) {
  console.error("NEXT_PUBLIC_BACKEND_API_URL is not defined in the environment variables");
} else {
  console.log(`Backend URL: ${backendUrl}`);
}

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 30000,
});

axiosInstance.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await authApiService.refreshToken();
        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);

        // Reconnect socket with new access token if it was previously connected
        if (getSocket()) {
          disconnectSocket();
          initializeSocket(accessToken);
        }

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
