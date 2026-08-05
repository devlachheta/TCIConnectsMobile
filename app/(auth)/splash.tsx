import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Splash() {

    const router = useRouter();

    useEffect(() => {
        56
        const timer = setTimeout(() => {
            router.replace("/(auth)/welcome");
        }, 2500);

        return () => clearTimeout(timer);
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
        backgroundColor: "rgb(2, 30, 72)"

    },

    title: {
        fontSize: 34,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: 1,
    },
});

