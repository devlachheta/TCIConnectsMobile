import AuthFooter from "@/components/authfooter";
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { forgotPassword } from "../../services/authService";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgotPassword = async () => {
    setEmailError("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Enter a valid email address");
      return;
    }

    try {
      const response = await forgotPassword(trimmedEmail);

      if (!response.success) {
        setError(response.message);
        return;
      }

      router.push({
        pathname: "/(auth)/resetpassword",
        params: {
          email: trimmedEmail,
        },
      });
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
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader />

          <View style={styles.content}>
            <Text style={styles.heading}>
              Forgot Password
            </Text>

            <Text style={styles.label}>
              Email
            </Text>

            <AuthInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {emailError ? (
              <Text style={styles.errorText}>
                {emailError}
              </Text>
            ) : null}

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            <PrimaryButton
              title="Send Reset Link"
              onPress={handleForgotPassword}
            />

            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Text style={styles.backToLogin}>
                Back to Login
              </Text>
            </TouchableOpacity>
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
    marginVertical: "auto"
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
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

  backToLogin: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
});