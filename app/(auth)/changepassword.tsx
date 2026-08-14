import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { Ionicons } from "@expo/vector-icons";
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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    // Clear previous errors
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Current password validation
    if (!currentPassword.trim()) {
      setCurrentPasswordError(
        "Current password is required"
      );
      hasError = true;
    }

    // New password validation
    if (!newPassword.trim()) {
      setNewPasswordError(
        "New password is required"
      );
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
      setConfirmPasswordError(
        "Passwords do not match"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Backend API will be connected here.
    console.log("Change Password:", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    Alert.alert(
      "Success",
      "Password changed successfully.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
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

            <View style={styles.passwordContainer}>
              <AuthInput
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showCurrentPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {currentPasswordError ? (
              <Text style={styles.errorText}>
                {currentPasswordError}
              </Text>
            ) : null}

            {/* New Password */}
            <Text style={styles.label}>
              New Password
            </Text>

            <View style={styles.passwordContainer}>
              <AuthInput
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showNewPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {newPasswordError ? (
              <Text style={styles.errorText}>
                {newPasswordError}
              </Text>
            ) : null}

            {/* Confirm New Password */}
            <Text style={styles.label}>
              Confirm New Password
            </Text>

            <View style={styles.passwordContainer}>
              <AuthInput
                placeholder="Enter new password again"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

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

  passwordContainer: {
    position: "relative",
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: 0,
    height: 52,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
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