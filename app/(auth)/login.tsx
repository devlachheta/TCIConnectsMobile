import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AuthFooter from "@/components/authfooter";
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { ImageBackground } from "expo-image";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { login } from "../../services/authService";


export default function Login() {
<<<<<<< HEAD
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const handleLogin = async () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        const isEmail = emailRegex.test(trimmedUsername);
        const isMobile = mobileRegex.test(trimmedUsername);

        if (!isEmail && !isMobile) {
            Alert.alert(
                "Error",
                "Enter a valid email or 10-digit mobile number"
            );
            return;
        }

        if (trimmedPassword.length < 8) {
            Alert.alert(
                "Error",
                "Password must be at least 8 characters"
            );
            return;
        }

        if (trimmedPassword.includes(" ")) {
            Alert.alert(
                "Error",
                "Password cannot contain spaces"
            );
            return;
        }

        try {
            console.log("Sending:");
            console.log({
                username: trimmedUsername,
                password: trimmedPassword,
            });
            const response = await login(
                trimmedUsername,
                trimmedPassword
            );

            await AsyncStorage.setItem(
                "access_token",
                response.access_token
            );

            await AsyncStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            const userRole = response.user?.role;

            if (userRole === "admin" || userRole === "doctor") {
                router.replace("/(tabs)/home");
            } else {
                Alert.alert("Error", "Invalid user role");
            }

        } catch (error: any) {
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            console.log("Full Error:", error);

            Alert.alert(
                "Login Failed",
                JSON.stringify(error.response?.data)
            );
        }
    };
=======
  const [password, setPassword] = useState("");
>>>>>>> feature/mobile-registration

  return (
    <SafeAreaView style={styles.safeArea}
      edges={["top"]}
    >

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />
        <ImageBackground
          source={require("../../assets/images/login-bgimg-DX-S1Q5C.png")}
          style={styles.background}
          resizeMode="cover"
        >
<<<<<<< HEAD
            <ImageBackground
                source={require("../../assets/images/login-bgimg-DX-S1Q5C.png")}
                style={styles.background}
                contentFit="cover"
            >
                <AuthHeader />
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >


                    <View style={styles.formContainer}>
                        <AuthInput
                            placeholder="Enter your email or mobile number"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <AuthInput
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <Text style={styles.forget}>Forgot Password?</Text>

                        <PrimaryButton
                            title="Login"
                            onPress={handleLogin}
                        />

                        <Text style={styles.registerLink}>
                            New to TCI Dental Lab?{"\n"}
                            Create Your Account Here
                        </Text>
                    </View>

                    <AuthFooter />
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
=======

          <AuthInput
            placeholder="enter your email"
            keyboardType="email-address"
          />

          <AuthInput
            placeholder="enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.forget}>Forget password ?</Text>

          <PrimaryButton
            title="Login"
            onPress={() => alert("Login Clicked")}
          />
          <Text style={styles.register_link}>
            New to TCI Dental Lab? Create Your Account Here
          </Text>
        </ImageBackground>
        <AuthFooter />
      </ScrollView>
    </SafeAreaView >
  );
>>>>>>> feature/mobile-registration
}

const styles = StyleSheet.create({
<<<<<<< HEAD
    safeArea: {
        flex: 1,
    },

    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    container: {
        flexGrow: 1,
        justifyContent: "space-between",
    },

    formContainer: {
        marginTop: 60,
        paddingHorizontal: 20,
    },

    forget: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "right",
        marginTop: 10,
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
=======
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },

  container: {
    flexGrow: 1,
    paddingTop: 5,
  },
  background: {
    flex: 1,
  },
  forget: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 10,
    textAlign: "right",
  },
  register_link: {
    color: "#fff",
    fontSize: 15,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10
  }

>>>>>>> feature/mobile-registration
});