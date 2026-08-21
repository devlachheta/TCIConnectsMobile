// import axios from "axios";
// import * as SecureStore from "expo-secure-store";

// const api = axios.create({
//     baseURL: "https://tcidentallab.com/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     timeout: 30000,
// });

// // Add JWT token to every request
// api.interceptors.request.use(
//     async (config) => {
//         try {
//             const token = await SecureStore.getItemAsync(
//                 "access_token"
//             );

//             console.log("ACCESS TOKEN:", token);

//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }

//             return config;

//         } catch (error) {
//             console.error(
//                 "Error reading access token:",
//                 error
//             );

//             return config;
//         }
//     },
//     (error) => {
//         console.error(
//             "Request interceptor error:",
//             error
//         );

//         return Promise.reject(error);
//     }
// );

// // Handle API responses/errors
// api.interceptors.response.use(
//     (response) => {
//         // Don't log every successful API request
//         return response;
//     },

//     async (error) => {
//         const status = error.response?.status;
//         const url = error.config?.url;

//         console.error(
//             "API ERROR:",
//             error.config?.method?.toUpperCase(),
//             url,
//             status
//         );

//         if (status === 401) {
//             console.error(
//                 "401 RESPONSE:",
//                 error.response?.data
//             );

//             console.error(
//                 "401 HEADERS:",
//                 error.response?.headers
//             );
//         }

//         if (status === 403) {
//             console.error(
//                 "403 FORBIDDEN:",
//                 error.response?.data
//             );
//         }

//         if (status >= 500) {
//             console.error(
//                 "SERVER ERROR:",
//                 error.response?.data
//             );
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;





import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
    "https://tcidentallab.com/api";

const api = axios.create({
<<<<<<< HEAD
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});


// ==================================================
// REQUEST INTERCEPTOR
// ==================================================

api.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ) => {

        try {

            const token =
                await SecureStore.getItemAsync(
                    "access_token"
                );

            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

=======
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
>>>>>>> edit/cases
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
<<<<<<< HEAD
=======

    (error) => {

        console.error(
            "Request interceptor error:",
            error
        );
>>>>>>> edit/cases

    (error) => {
        return Promise.reject(error);
    }
);

<<<<<<< HEAD

// ==================================================
// RESPONSE INTERCEPTOR
// ==================================================
=======
// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================
>>>>>>> edit/cases

api.interceptors.response.use(

    (response) => {
<<<<<<< HEAD
        return response;
    },

    async (error: AxiosError) => {
=======

        return response;
    },

    async (error) => {

        const status =
            error.response?.status;

        const url =
            error.config?.url;
>>>>>>> edit/cases

        const status =
            error.response?.status;

<<<<<<< HEAD
        const originalRequest =
            error.config as
            | (InternalAxiosRequestConfig & {
                _retry?: boolean;
            })
            | undefined;
=======
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
>>>>>>> edit/cases


        // ------------------------------------------
        // Invalid request config
        // ------------------------------------------

        if (!originalRequest) {
            return Promise.reject(error);
        }

<<<<<<< HEAD

        // ------------------------------------------
        // Only handle 401
        // ------------------------------------------

        if (status !== 401) {
            return Promise.reject(error);
        }


        // ------------------------------------------
        // Don't refresh login/refresh requests
        // ------------------------------------------

        const isAuthRequest =
            originalRequest.url === "/login" ||
            originalRequest.url === "/refresh-token";

        if (isAuthRequest) {
            return Promise.reject(error);
=======
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
>>>>>>> edit/cases
        }


        // ------------------------------------------
        // Prevent infinite retry
        // ------------------------------------------

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;


        try {

            console.log(
                "Access token expired. Refreshing..."
            );


            // --------------------------------------
            // Get refresh token
            // --------------------------------------

            const refreshToken =
                await SecureStore.getItemAsync(
                    "refresh_token"
                );


            if (!refreshToken) {

                console.log(
                    "No refresh token found."
                );

                await SecureStore.deleteItemAsync(
                    "access_token"
                );

                await SecureStore.deleteItemAsync(
                    "refresh_token"
                );

                await AsyncStorage.removeItem(
                    "user"
                );

                return Promise.reject(error);
            }


            // --------------------------------------
            // Request new access token
            // --------------------------------------

            const refreshResponse =
                await axios.post(
                    `${API_URL}/refresh-token`,
                    {
                        refresh_token:
                            refreshToken,
                    },
                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        timeout: 30000,
                    }
                );


            const newAccessToken =
                refreshResponse.data?.access_token;


            if (!newAccessToken) {

                throw new Error(
                    "Refresh response did not contain an access token."
                );
            }


            // --------------------------------------
            // Save new access token
            // --------------------------------------

            await SecureStore.setItemAsync(
                "access_token",
                newAccessToken
            );


            console.log(
                "Access token refreshed successfully."
            );


            // --------------------------------------
            // Update original request
            // --------------------------------------

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            // --------------------------------------
            // Retry original request
            // --------------------------------------

            return api(originalRequest);


        } catch (refreshError: any) {

            console.error(
                "Token refresh failed:",
                refreshError?.response?.data ||
                refreshError?.message ||
                refreshError
            );


            // --------------------------------------
            // Clear complete session
            // --------------------------------------

            await SecureStore.deleteItemAsync(
                "access_token"
            );

            await SecureStore.deleteItemAsync(
                "refresh_token"
            );

            await AsyncStorage.removeItem(
                "user"
            );


            return Promise.reject(
                refreshError
            );
        }
    }
);


export default api;