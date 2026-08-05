import api from "./api";

export const login = async (username: string, password: string) => {
    const response = await api.post("/login", {
        username,
        password,
    });

    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post("/register", data);
    return response.data;
};