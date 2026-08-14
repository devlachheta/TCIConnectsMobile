import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { resetPassword } from "@/services/authService";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPassword() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async () => {
        setPasswordError("");
        setConfirmPasswordError("");
        setError("");

        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (!trimmedPassword) {
            setPasswordError("Password is required");
        }

        if (!trimmedConfirmPassword) {
            setConfirmPasswordError("Confirm Password is required");
        }

        if (!trimmedPassword || !trimmedConfirmPassword) {
            return;
        }

        if (trimmedPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return;
        }

        if (trimmedPassword.includes(" ")) {
            setPasswordError("Password cannot contain spaces");
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        try {
            const response = await resetPassword(
                email as string,
                trimmedPassword
            );

            if (response.success) {
                router.replace("/(auth)/login");
            } else {
                setError(response.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || "Something went wrong"
                );
            } else {
                setError("Unexpected error");
            }
        }
    };
    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <LinearGradient
                colors={["#00254C", "#024F9D"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.gradient}
            >
                <AuthHeader />

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Text style={styles.heading}>
                            Reset Password
                        </Text>

                        <Text style={styles.subtitle}>
                            Reset password for
                        </Text>

                        <Text style={styles.email}>
                            {email}
                        </Text>

                        <Text style={styles.label}>
                            New Password
                        </Text>

                        <AuthInput
                            placeholder="Enter new password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {passwordError ? (
                            <Text style={styles.errorText}>
                                {passwordError}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>
                            Confirm Password
                        </Text>

                        <AuthInput
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        {confirmPasswordError ? (
                            <Text style={styles.errorText}>
                                {confirmPasswordError}
                            </Text>
                        ) : null}

                        {error ? (
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        ) : null}

                        <PrimaryButton
                            title="Reset Password"
                            onPress={handleResetPassword}
                        />
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    gradient: {
        flex: 1,
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 28,
    },

    content: {
        marginTop: 100,
    },

    heading: {
        fontSize: 30,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 10,
    },

    subtitle: {
        color: "#fff",
        fontSize: 16,
    },

    email: {
        color: "#BFD8FF",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 30,
    },

    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 20,
        marginHorizontal: 8,
    },

    errorText: {
        color: "#FF6B6B",
        fontSize: 14,
        marginTop: 8,
        marginHorizontal: 8,
    },
});