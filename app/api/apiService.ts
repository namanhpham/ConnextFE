import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 1000
});

axiosInstance.defaults.withCredentials = true;

const authLogin = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/sign-in', {
        email,
        password
    });

    return response.data;
};

const authRegister = async (email: string, password: string, username: string) => {
    const response = await axiosInstance.post('/auth/sign-up', {
        email,
        password,
        username
    });

    return response.data;
}

export { authLogin, authRegister, axiosInstance };
