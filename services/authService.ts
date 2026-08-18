import * as SecureStore from "expo-secure-store";
import api from "./api";

export const login = async (
    username: string,
    password: string
) => {
    try {
        const response = await api.post("/login", {
            username,
            password,
        });

        console.log("LOGIN RESPONSE:", response.data);

        const token = response.data?.access_token;

        if (!token) {
            throw new Error(
                "Login successful, but access token was not received."
            );
        }

        await SecureStore.setItemAsync(
            "access_token",
            token
        );

        console.log("✅ Access token saved successfully");

        return response.data;
    } catch (error: any) {
        console.error(
            "❌ Login error:",
            error?.response?.data || error?.message || error
        );

        throw error;
    }
};

export const register = async (data: any) => {
    try {
        const response = await api.post("/register", data);

        console.log("REGISTER RESPONSE:", response.data);

        return response.data;
    } catch (error: any) {
        console.error(
            "❌ Registration error:",
            error?.response?.data || error?.message || error
        );

        throw error;
    }
};

export const forgotPassword = async (
    email: string
) => {
    try {
        const response = await api.post(
            "/forgot-password",
            {
                email,
            }
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "❌ Forgot password error:",
            error?.response?.data || error?.message || error
        );

        throw error;
    }
};

export const resetPassword = async (
    email: string,
    password: string
) => {
    try {
        const response = await api.post(
            "/reset-password",
            {
                email,
                password,
            }
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "❌ Reset password error:",
            error?.response?.data || error?.message || error
        );

        throw error;
    }
};

export const logout = async () => {
    try {
        await SecureStore.deleteItemAsync(
            "access_token"
        );

        console.log("✅ Access token removed");
    } catch (error: any) {
        console.error(
            "❌ Logout error:",
            error?.message || error
        );

        throw error;
    }
};

export const getAccessToken = async () => {
    return await SecureStore.getItemAsync(
        "access_token"
    );
};