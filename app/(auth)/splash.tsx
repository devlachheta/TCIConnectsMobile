import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const checkAuthentication = async () => {
            try {
                const token = await SecureStore.getItemAsync("access_token");

                timer = setTimeout(() => {
                    if (token) {
                        router.replace("/(tabs)");
                    } else {
                        router.replace("/(auth)/welcome");
                    }
                }, 2500);
            } catch (error) {
                console.log("Authentication check error:", error);
                router.replace("/(auth)/welcome");
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
            <Text style={styles.title}>TCI Connect</Text>
        </View>
    );
}

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