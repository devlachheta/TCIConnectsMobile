import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DashboardHeaderProps {
    notificationCount?: number;
    profileImage?: string;
    onNotificationPress?: () => void;
    onMenuPress?: () => void;
}
export default function DashboardHeader({
    notificationCount = 0,
    profileImage,
    onNotificationPress,
    onMenuPress,
}: DashboardHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={onMenuPress}
            >
                <Ionicons
                    name="menu"
                    size={30}
                    color="#021E48"
                />
            </TouchableOpacity>

            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={onNotificationPress}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="#0152A8"
                    />

                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {notificationCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatar}>
                        <Ionicons
                            name="person"
                            size={24}
                            color="#0152A8"
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 2,
    },
    menuButton: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 15,
        color: "#000",
        fontWeight: "bold"
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        color: "#021E48",
        marginTop: 4,
    },

    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F5F8FC",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    badge: {
        position: "absolute",
        top: 6,
        right: 8,
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },

    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#F5F8FC",
        justifyContent: "center",
        alignItems: "center",
    },
});
