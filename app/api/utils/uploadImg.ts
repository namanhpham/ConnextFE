import { axiosInstance } from "../axiosInstance";

const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/uploads", formData);
    return response.data;
};

export { uploadToS3 };
