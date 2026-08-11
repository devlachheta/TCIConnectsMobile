import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PatientInfoProps {
    patientName: string;
}

export default function PatientInfo({
    patientName,
}: PatientInfoProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>
                    Patient
                </Text>

                <View style={styles.iconContainer}>
                    <Ionicons
                        name="person-outline"
                        size={20}
                        color="#666666"
                    />
                </View>
            </View>

            <Text style={styles.name}>
                {patientName}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,

        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666666",
    },

    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },

    name: {
        marginTop: 8,
        fontSize: 22,
        fontWeight: "700",
        color: "#222222",
    },
});