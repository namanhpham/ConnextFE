import { axiosInstance } from "../axiosInstance";

const getConversations = async () => {
    const response = await axiosInstance.get("/conversations");
    return response.data;
};

export { getConversations };
