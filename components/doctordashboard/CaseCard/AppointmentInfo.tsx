import { StyleSheet, Text, View } from "react-native";

interface AppointmentInfoProps {
    appointmentDate: string;
    age: string;
}

export default function AppointmentInfo({
    appointmentDate,
    age,
}: AppointmentInfoProps) {
    return (
        <View style={styles.container}>
            <View style={styles.Column}>
                <Text style={styles.label}>
                    Appointment Date
                </Text>

                <Text style={styles.value}>
                    {appointmentDate}
                </Text>
            </View>

            <View style={styles.Column}>
                <Text style={styles.label}>
                    Age
                </Text>

                <Text style={styles.value}>
                    {age}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    Column: {
        flex: 2,
    },

    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666666",
        marginBottom: 6,
    },

    value: {
        fontSize: 14,
        fontWeight: "500",
        color: "#222222",
    },
});