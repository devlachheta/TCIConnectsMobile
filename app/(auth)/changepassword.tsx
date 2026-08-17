import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import api from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChangePassword = async () => {
    // Clear previous errors
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Current password validation
    if (!currentPassword.trim()) {
      setCurrentPasswordError("Current password is required");
      hasError = true;
    }

    // New password validation
    if (!newPassword.trim()) {
      setNewPasswordError("New password is required");
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError(
        "New password must be at least 8 characters"
      );
      hasError = true;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(
        "Please confirm your new password"
      );
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await api.post("/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      console.log("Change password response:", response.data);

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Password updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(auth)/login");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Unable to change password."
        );
      }
    } catch (error: any) {
      console.log(
        "Change password error:",
        error?.response?.data || error
      );

      if (error?.response) {
        Alert.alert(
          "Error",
          error.response.data?.message ||
          "Unable to change password."
        );
      } else {
        Alert.alert(
          "Error",
          "Something went wrong. Please try again."
        );
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
          keyboardShouldPersistTaps="handled"
        >

          <AuthHeader />

          <View style={styles.content}>

            {/* Heading */}
            <Text style={styles.heading}>
              Change Password
            </Text>

            <Text style={styles.description}>
              Update your password to keep your account secure.
            </Text>

            {/* Current Password */}
            <Text style={styles.label}>
              Current Password
            </Text>

            <AuthInput
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={true}
            />

            {currentPasswordError ? (
              <Text style={styles.errorText}>
                {currentPasswordError}
              </Text>
            ) : null}

            {/* New Password */}
            <Text style={styles.label}>
              New Password
            </Text>

            <AuthInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />

            {newPasswordError ? (
              <Text style={styles.errorText}>
                {newPasswordError}
              </Text>
            ) : null}

            {/* Confirm New Password */}
            <Text style={styles.label}>
              Confirm New Password
            </Text>
            <AuthInput
              placeholder="Enter new password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />

            {confirmPasswordError ? (
              <Text style={styles.errorText}>
                {confirmPasswordError}
              </Text>
            ) : null}

            {/* Change Password Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Change Password"
                onPress={handleChangePassword}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgotpassword")}
              style={styles.backButton}
            >
              <Text style={styles.backText}>
                Forgot Password ?
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
    backgroundColor: "#00254C",
  },

  gradient: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  content: {
    marginTop: 35,
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#D8E5F5",
    marginBottom: 25,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
    marginHorizontal: 8,
  },


  errorText: {
    color: "#FFB4B4",
    fontSize: 13,
    marginTop: 6,
    marginHorizontal: 8,
  },

  buttonContainer: {
    marginTop: 25,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 10,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});