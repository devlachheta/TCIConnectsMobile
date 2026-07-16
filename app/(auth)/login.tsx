import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AuthFooter from "@/components/authfooter";
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { ImageBackground } from "expo-image";
import { Text } from "react-native-gesture-handler";


export default function Login() {
    const [password, setPassword] = useState("");

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
}
const styles = StyleSheet.create({
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

});