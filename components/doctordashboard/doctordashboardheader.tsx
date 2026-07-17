import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardHeader() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Good Morning 👋</Text>
                <Text style={styles.name}>Dr. Michael Vermeulen</Text>
            </View>

            <TouchableOpacity style={styles.notificationButton}>
                <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#0152A8"
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
    },

    greeting: {
        fontSize: 16,
        color: "#6B7280",
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F2937",
        marginTop: 5,
    },

    notificationButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F3F6FB",
        justifyContent: "center",
        alignItems: "center",
    },
});