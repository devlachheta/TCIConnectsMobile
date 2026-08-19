import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ProfileMenu from "./CaseCard/ProfileMenu";
import DashboardDrawer from "./DashboardDrawer";
import Notification from "./notification";

interface DashboardHeaderProps {
    profileImage?: string;
    onMenuPress?: () => void;
}
export default function DashboardHeader({ }: DashboardHeaderProps) {
    const [drawerVisible, setDrawerVisible] = useState(false);

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setDrawerVisible(true)}
                >
                    <Ionicons
                        name="menu"
                        size={30}
                        color="#021E48"

                    />
                </TouchableOpacity>

                <View style={styles.rightSection}>
                    <Notification />
                    <View style={{ marginLeft: 10 }}></View>
                    <ProfileMenu />
                </View>
            </View>

            <DashboardDrawer
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
            />
        </>
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

        position: "relative",
        zIndex: 9999,
        elevation: 20,
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

        position: "relative",
        zIndex: 9999,
        elevation: 20,
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
});
