import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
interface HeaderProps {
    caseId: string;
    status: string;
    onMenuPress: () => void;

}
export default function Header({
    caseId,
    status,
    onMenuPress,

}: HeaderProps) {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");

                if (storedUser) {
                    const user = JSON.parse(storedUser);

                    if (user.profile_image) {
                        const imageUrl = user.profile_image.startsWith("http")
                            ? `${user.profile_image}?t=${Date.now()}`
                            : `https://tcidentallab.com/tci-uploads/profile/${encodeURIComponent(
                                user.profile_image
                            )}?t=${Date.now()}`;

                        setProfileImage(imageUrl);
                    } else {
                        setProfileImage(null);
                    }
                }
            } catch (error) {
                console.log("Profile Image Error:", error);
            }
        };

        loadProfileImage();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require("@/assets/images/pdfsvg.png")}
                        style={styles.icon}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.caseTitle}>
                        Case #{caseId}
                    </Text>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.profileImage}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImagePhoto}
                    />
                ) : (
                    <Ionicons
                        name="person"
                        size={28}
                        color="#0152A8"
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 18,
        zIndex: 1,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E9EEF9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    icon: {
        width: 16.67,
        height: 13.33,
    },

    textContainer: {
        justifyContent: "center",
    },

    caseTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
    },

    statusBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#F2F2F2",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginTop: 8,
    },

    statusText: {
        fontSize: 15,
        fontFamily: "roboto",
        fontWeight: "500",
        color: "#808080",
    },
    profileImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#E8EEF6",
        borderWidth: 1,
        borderColor: "#D4DDE8",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },

    profileImagePhoto: {
        width: "100%",
        height: "100%",
        borderRadius: 23,
    },
});