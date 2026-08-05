
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import PrimaryButton from "@/components/PrimaryBotton";
import { router } from "expo-router";

export default function WelcomeScreen() {
    return (
        <><View style={styles.container}>

            <Text style={styles.logo}>
                TCI Connect
            </Text>

            <Text style={styles.title}>
                Welcome to TCI Connect
            </Text>

            <Text style={styles.subtitle}>
                Your gateway to seamless dental lab management.
            </Text>

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Create Account"
                    onPress={() => router.push("/(auth)/registration")}
                />

                <View style={{ height: 20 }} />

                <PrimaryButton
                    title="Sign In"
                    onPress={() => router.push("/(auth)/login")}
                />
            </View>


            {/* <Image
                source={require("../../assets/images/login-bgimg-DX-S1Q5C.png")}
                style={styles.image}
                contentFit="contain"
            /> */}

        </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(2, 30, 72)"
    },
    logo: {
        color: "#fff",
        fontSize: 34,
        fontWeight: "700",
    },
    // image: {
    //     width: "100%",
    //     height: 260,
    //     marginVertical: 30,
    // },

    buttonContainer: {
        width: "100%"

    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#fff",
        textAlign: "center",
    },
})