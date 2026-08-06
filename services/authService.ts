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
}

export const forgotPassword = async (email: string) => {
    const response = await api.post("/forgot-password", {
        email,
    });

    return response.data;
};

export const resetPassword = async (
    email: string,
    password: string
) => {
    const response = await api.post("/reset-password", {
        email,
        password,
    });

    return response.data;
};