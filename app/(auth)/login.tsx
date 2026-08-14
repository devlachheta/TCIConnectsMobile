
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "../../services/authService";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleLogin = async () => {
        setError("");
        setUsernameError("");
        setPasswordError("");

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        // Username validation
        if (!trimmedUsername) {
            setUsernameError("Email is required");
        }

        // Password validation
        if (!trimmedPassword) {
            setPasswordError("Password is required");
        }

        if (!trimmedUsername || !trimmedPassword) {
            return;
        }

        // Email / mobile validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        const isEmail = emailRegex.test(trimmedUsername);
        const isMobile = mobileRegex.test(trimmedUsername);

        if (!isEmail && !isMobile) {
            setUsernameError(
                "Enter a valid email or mobile number"
            );
            return;
        }

        // Password length validation
        if (trimmedPassword.length < 8) {
            setPasswordError(
                "Password must be at least 8 characters"
            );
            return;
        }

        // Password space validation
        if (trimmedPassword.includes(" ")) {
            setPasswordError(
                "Password cannot contain spaces"
            );
            return;
        }

        try {
            // Call login API
            const response = await login(
                trimmedUsername,
                trimmedPassword
            );

            console.log("Login successful");

            // Check whether JWT exists
            if (!response?.access_token) {
                console.log(
                    "Login response does not contain access_token"
                );

                setError(
                    "Login successful, but authentication token was not received."
                );

                return;
            }

            // Store JWT securely
            await SecureStore.setItemAsync(
                "access_token",
                response.access_token
            );

            // Store user information
            await AsyncStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            console.log("JWT stored successfully");

            // Get user role
            const userRole = response.user?.role;

            // Navigate based on role
            if (
                userRole === "admin" ||
                userRole === "doctor"
            ) {
                router.replace("/(tabs)");
            } else {
                setError("Invalid user role");
            }

        } catch (error) {
            console.log("Login Error:", error);

            if (axios.isAxiosError(error)) {
                console.log(
                    "Response:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.detail ||
                    "Something went wrong"
                );
            } else {
                setError("Unexpected error");
            }
        }
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top"]}
        >
            <LinearGradient
                colors={["#00254C", "#024F9D"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <AuthHeader />
                    <View style={styles.content}>
                        <Text style={styles.heading}>Login to TCI Connect</Text>
                        <Text style={styles.label}>Email</Text>
                        <AuthInput
                            placeholder="Enter your email"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />{usernameError ? (
                            <Text style={styles.errorText}>{usernameError}</Text>
                        ) : null}

                        <Text style={styles.label}>Password</Text>
                        <AuthInput
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        {passwordError ? (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        ) : null}
                        <TouchableOpacity
                            onPress={() =>
                                router.push("/(auth)/forgotpassword")
                            }
                        >
                            <Text style={styles.forget}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <PrimaryButton
                            title="Log In"
                            onPress={handleLogin}
                            buttonStyle={{
                                backgroundColor: "#fff",
                                borderWidth: 2,
                                borderColor: "#fff",
                            }}
                            textStyle={{
                                color: "#000",
                                fontSize: 16,
                                fontWeight: 700
                            }}
                        />
                        <PrimaryButton
                            title="New to TCI CRM? Sign up here"
                            onPress={() =>
                                router.push("/(auth)/registration")
                            }
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#024F9D",
    },
    gradient: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 28,
    },

    content: {
        marginVertical: "auto",
    },
    heading: {
        fontSize: 30,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 20,
    },
    label: {
        color: "#fff",
        marginTop: 20,
        fontSize: 16,
        marginHorizontal: 8,
        fontWeight: "600"
    },

    forget: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "right",
        marginTop: 15,
        marginBottom: 20,
    },

    registerLink: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 14,
        marginTop: 8,
        marginHorizontal: 8,
    },
});