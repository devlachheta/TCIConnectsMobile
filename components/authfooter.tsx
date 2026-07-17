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
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden",
        marginTop: 50
    },

    logo: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        alignSelf: "flex-start",
        marginBottom: 10,
    },

    description: {
        color: "#CBD5E1",
        fontSize: 12,
        lineHeight: 18,
        textAlign: "left",
        marginBottom: 15,
    },

    socialContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        marginBottom: 15,
    },

    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#0D6EFD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#334155",
        marginBottom: 10,
    },

    copyright: {
        color: "#94A3B8",
        fontSize: 11,
        marginBottom: 6,
    },

    privacy: {
        color: "#3B82F6",
        fontSize: 12,
        fontWeight: "600",
    },
});