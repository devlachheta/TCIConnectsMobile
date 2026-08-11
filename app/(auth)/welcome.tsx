
import PrimaryButton from "@/components/PrimaryBotton";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function WelcomeScreen() {
    return (
        <>
            <ImageBackground
                source={require("../../assets/images/welcome-image.png")}
                style={styles.background}
                contentFit="cover"
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>
                            Welcome to TCI Connect
                        </Text>

                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                title="Create new account"
                                onPress={() => router.push("/(auth)/registration")}
                                buttonStyle={{
                                    backgroundColor: "#fff",
                                    borderWidth: 2,
                                    borderColor: "#FFFFFF",
                                    width: "100%",
                                }}
                                textStyle={{
                                    color: "black",
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}
                            />
                            <View style={{ height: 20 }} />
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/login")}>
                                <Text style={styles.loginLink}>
                                    I already have an account ?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground >

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        marginTop: "auto",
        paddingBottom: 100,
        alignItems: "center",
        width: "100%",
    },

    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    buttonContainer: {
        width: "100%",

    },
    title: {
        fontSize: 25,
        fontWeight: "800",
        color: "#fff",
    },
    loginLink: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },

})