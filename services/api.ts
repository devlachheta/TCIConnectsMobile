import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: "https://tcidentallab.com/api",
    timeout: 30000,
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

api.interceptors.request.use(
    async (config) => {
        try {

            const token =
                await SecureStore.getItemAsync(
                    "access_token"
                );

            console.log(
                "ACCESS TOKEN:",
                token
            );

            // -------------------------------------------------
            // JWT
            // -------------------------------------------------

            if (token) {

                config.headers =
                    config.headers || {};

                config.headers.Authorization =
                    `Bearer ${token}`;
            }

            // -------------------------------------------------
            // IMPORTANT:
            // Handle FormData differently from JSON
            // -------------------------------------------------

            if (
                config.data instanceof FormData
            ) {

                console.log(
                    "REQUEST TYPE: FormData"
                );

                /*
                 * DO NOT set:
                 *
                 * Content-Type:
                 * multipart/form-data
                 *
                 * manually.
                 *
                 * Axios / React Native needs to create
                 * the multipart boundary automatically.
                 */

                if (
                    config.headers
                ) {

                    delete config.headers[
                        "Content-Type"
                    ];

                    delete config.headers[
                        "content-type"
                    ];
                }

            } else {

                // -------------------------------------------------
                // NORMAL JSON REQUEST
                // -------------------------------------------------

                config.headers =
                    config.headers || {};

                config.headers[
                    "Content-Type"
                ] = "application/json";
            }

            console.log(
                "REQUEST:",
                config.method?.toUpperCase(),
                config.url
            );

            return config;

        } catch (error) {

            console.error(
                "Request interceptor error:",
                error
            );

            return config;
        }
    },

    (error) => {

        console.error(
            "Request interceptor error:",
            error
        );

        return Promise.reject(error);
    }
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

api.interceptors.response.use(

    (response) => {

        return response;
    },

    async (error) => {

        const status =
            error.response?.status;

        const url =
            error.config?.url;

        console.error(
            "API ERROR:",
            error.config?.method?.toUpperCase(),
            url,
            status
        );

        // -------------------------------------------------
        // 401
        // -------------------------------------------------

        if (
            status === 401
        ) {

            console.error(
                "401 RESPONSE:",
                error.response?.data
            );

            console.error(
                "401 HEADERS:",
                error.response?.headers
            );
        }

        // -------------------------------------------------
        // 403
        // -------------------------------------------------

        if (
            status === 403
        ) {

            console.error(
                "403 FORBIDDEN:",
                error.response?.data
            );
        }

        // -------------------------------------------------
        // 500+
        // -------------------------------------------------

        if (
            status &&
            status >= 500
        ) {

            console.error(
                "SERVER ERROR:",
                error.response?.data
            );
        }

        return Promise.reject(error);
    }
);

export default api;