import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: "https://tcidentallab.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Add JWT token to every request
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync(
                "access_token"
            );

            console.log(
                "🔐 Access Token:",
                token ? "FOUND" : "NOT FOUND"
            );

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;

                console.log(
                    "📤 Authorization header added:",
                    config.method?.toUpperCase(),
                    config.url
                );
            } else {
                console.log(
                    "❌ No access token:",
                    config.method?.toUpperCase(),
                    config.url
                );
            }

            return config;
        } catch (error) {
            console.error(
                "❌ Error reading access token:",
                error
            );

            return config;
        }
    },
    (error) => {
        console.error(
            "❌ Request interceptor error:",
            error
        );

        return Promise.reject(error);
    }
);

// Handle API responses/errors
api.interceptors.response.use(
    (response) => {
        console.log(
            "✅ API:",
            response.config.method?.toUpperCase(),
            response.config.url,
            response.status
        );

        return response;
    },
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        console.error(
            "❌ API ERROR:",
            error.config?.method?.toUpperCase(),
            url,
            status
        );

        // Show the actual backend response
        if (status === 401) {
            console.error(
                "🔴 401 RESPONSE:",
                error.response?.data
            );

            console.error(
                "🔴 401 HEADERS:",
                error.response?.headers
            );
        }

        if (status === 403) {
            console.error(
                "🟠 403 FORBIDDEN:",
                error.response?.data
            );
        }

        if (status >= 500) {
            console.error(
                "🔴 SERVER ERROR:",
                error.response?.data
            );
        }

        return Promise.reject(error);
    }
);

export default api;