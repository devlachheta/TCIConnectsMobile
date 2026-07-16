import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthFooter() {
    const year = new Date().getFullYear();

    const openUrl = async (url: string) => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <LinearGradient
            colors={["#0152A8", "#00254C"]}
            locations={[1, 0.50]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >

            <Text style={styles.logo}>TCI Connect</Text>

            <Text style={styles.description}>
                TCI Dental Lab is a full-service dental laboratory providing
                advanced dental products and restorations. With facilities in
                Beirut and Brussels, we combine expertise with digital CAD/CAM
                technology.
            </Text>

            <View style={styles.socialContainer}>
                <Pressable
                    onPress={() => openUrl("https://facebook.com")}
                    style={styles.iconButton}
                >
                    <Ionicons name="logo-facebook" size={22} color="#FFFFFF" />
                </Pressable>

                <Pressable
                    onPress={() => openUrl("https://instagram.com")}
                    style={styles.iconButton}
                >
                    <Ionicons name="logo-instagram" size={22} color="#FFFFFF" />
                </Pressable>

                <Pressable
                    onPress={() => openUrl("https://wa.me/")}
                    style={styles.iconButton}
                >
                    <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
                </Pressable>
            </View>

            <View style={styles.divider} />

            <Text style={styles.copyright}>
                © {year} TCI Dental Labs. All Rights Reserved.
            </Text>

            <Pressable>
                <Text style={styles.privacy}>Privacy Policy</Text>
            </Pressable>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 24,
        alignItems: "center",
        marginTop: "auto",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: "hidden",
    },

    logo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 15,
        alignSelf: "flex-start"
    },

    description: {
        color: "#CBD5E1",
        fontSize: 14,
        textAlign: "left",
        lineHeight: 22,
        marginBottom: 10,
    },

    socialContainer: {
        flexDirection: "row",
        marginBottom: 25,
        alignSelf: "flex-start"
    },

    iconButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#0d6efd",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 8,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#334155",
        marginBottom: 8,
    },

    copyright: {
        color: "#94A3B8",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 8,
    },

    privacy: {
        color: "#3B82F6",
        fontSize: 14,
        fontWeight: "600",
    },
});