import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";

const API_URL = "https://tcidentallab.com/api";

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const checkAuthentication = async () => {
            try {
                // ---------------------------------------
                // Get stored authentication data
                // ---------------------------------------

                const accessToken =
                    await SecureStore.getItemAsync(
                        "access_token"
                    );

                const refreshToken =
                    await SecureStore.getItemAsync(
                        "refresh_token"
                    );

                const userData =
                    await AsyncStorage.getItem(
                        "user"
                    );

                const user = userData
                    ? JSON.parse(userData)
                    : null;


                // ---------------------------------------
                // No user/session
                // ---------------------------------------

                if (!user?.role) {
                    router.replace(
                        "/(auth)/welcome"
                    );

                    return;
                }


                // ---------------------------------------
                // No access token AND no refresh token
                // ---------------------------------------

                if (!accessToken && !refreshToken) {

                    await clearAuthentication();

                    router.replace(
                        "/(auth)/welcome"
                    );

                    return;
                }


                // ---------------------------------------
                // If we don't have an access token
                // but have refresh token,
                // try refreshing
                // ---------------------------------------

                if (!accessToken && refreshToken) {

                    const refreshed =
                        await refreshAccessToken(
                            refreshToken
                        );

                    if (!refreshed) {

                        await clearAuthentication();

                        router.replace(
                            "/(auth)/welcome"
                        );

                        return;
                    }
                }


                // ---------------------------------------
                // Validate current access token
                // ---------------------------------------

                const currentAccessToken =
                    await SecureStore.getItemAsync(
                        "access_token"
                    );

                if (!currentAccessToken) {

                    await clearAuthentication();

                    router.replace(
                        "/(auth)/welcome"
                    );

                    return;
                }


                // ---------------------------------------
                // Verify token by calling profile
                // ---------------------------------------

                try {

                    await axios.get(
                        `${API_URL}/profile`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${currentAccessToken}`,
                            },

                            timeout: 10000,
                        }
                    );

                    console.log(
                        "Session is valid"
                    );

                } catch (error: any) {

                    const status =
                        error?.response?.status;

                    // -----------------------------------
                    // Access token expired
                    // -----------------------------------

                    if (status === 401) {

                        console.log(
                            "Access token expired. Trying refresh..."
                        );

                        const storedRefreshToken =
                            await SecureStore.getItemAsync(
                                "refresh_token"
                            );

                        if (!storedRefreshToken) {

                            await clearAuthentication();

                            router.replace(
                                "/(auth)/welcome"
                            );

                            return;
                        }

                        const refreshed =
                            await refreshAccessToken(
                                storedRefreshToken
                            );

                        if (!refreshed) {

                            await clearAuthentication();

                            router.replace(
                                "/(auth)/welcome"
                            );

                            return;
                        }

                        console.log(
                            "Session refreshed successfully"
                        );

                    } else {

                        // --------------------------------
                        // Other API error
                        // --------------------------------

                        console.log(
                            "Profile validation error:",
                            error?.response?.data ||
                            error?.message
                        );
                    }
                }


                // ---------------------------------------
                // Navigate based on role
                // ---------------------------------------

                timer = setTimeout(() => {

                    if (
                        user.role ===
                        "admin"
                    ) {

                        router.replace(
                            "/(admin)"
                        );

                    } else if (
                        user.role ===
                        "doctor"
                    ) {

                        router.replace(
                            "/(tabs)"
                        );

                    } else {

                        clearAuthentication();

                        router.replace(
                            "/(auth)/welcome"
                        );
                    }

                }, 1500);

            } catch (error) {

                console.log(
                    "Authentication check error:",
                    error
                );

                await clearAuthentication();

                router.replace(
                    "/(auth)/welcome"
                );
            }
        };


        checkAuthentication();


        return () => {

            if (timer) {
                clearTimeout(timer);
            }

        };

    }, [router]);


    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                TCI Connect
            </Text>

        </View>
    );
}


// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

const refreshAccessToken = async (
    refreshToken: string
) => {

    try {

        const response = await axios.post(
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

                timeout: 10000,
            }
        );


        const newAccessToken =
            response.data?.access_token;


        if (!newAccessToken) {

            console.log(
                "Refresh response did not contain access token"
            );

            return false;
        }


        await SecureStore.setItemAsync(
            "access_token",
            newAccessToken
        );


        console.log(
            "New access token saved"
        );


        return true;

    } catch (error: any) {

        console.log(
            "Refresh token failed:",
            error?.response?.data ||
            error?.message ||
            error
        );

        return false;
    }
};


// =====================================================
// CLEAR AUTHENTICATION
// =====================================================

const clearAuthentication = async () => {

    try {

        await SecureStore.deleteItemAsync(
            "access_token"
        );

        await SecureStore.deleteItemAsync(
            "refresh_token"
        );

        await AsyncStorage.removeItem(
            "user"
        );

    } catch (error) {

        console.log(
            "Error clearing authentication:",
            error
        );
    }
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(2, 30, 72)",
    },

    title: {
        fontSize: 34,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 1,
    },

});