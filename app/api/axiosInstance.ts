import axios from "axios";

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

export { axiosInstance };
