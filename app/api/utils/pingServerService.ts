import { axiosInstance } from "../axiosInstance";

const pingServer = async () => {
    const response = await axiosInstance.get("app/ping");
    return response.data;
};

export { pingServer };
