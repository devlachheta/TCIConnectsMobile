import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeadlineSectionProps {
    deadline: string;
    status: string;
    deadlinePassed: boolean;
    onApprove: () => void;
    onReject: () => void;
}

export default function DeadlineSection({
    deadline,
    status,
    deadlinePassed,
    onApprove,
    onReject,
}: DeadlineSectionProps) {
    return (
        <View style={styles.container}>

            {/* Deadline & Status */}

            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>
                        Delivery Deadline
                    </Text>

                    <Text style={styles.value}>
                        {deadline}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={styles.label}>
                        Status
                    </Text>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Deadline Message */}

            {deadlinePassed && (
                <View style={styles.warningRow}>
                    <Ionicons
                        name="warning"
                        size={18}
                        color="#F59E0B"
                    />

                    <Text style={styles.warningText}>
                        Deadline Passed
                    </Text>
                </View>
            )}

            {/* Actions */}

            <View style={styles.actionContainer}>
                <Text style={styles.actionTitle}>Actions</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.approveButton}
                        onPress={onApprove}
                    >
                        <Ionicons
                            name="checkmark"
                            size={28}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={onReject}
                    >
                        <Ionicons
                            name="close"
                            size={28}
                            color="#0152A8"
                        />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#FFDAD6"
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    label: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 6,
    },

    value: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
    },

    rightSection: {
        alignItems: "flex-end",
    },

    statusBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        color: "#2E7D32",
        fontWeight: "700",
        fontSize: 14,
    },

    warningRow: {
        flexDirection: "row",
        alignItems: "center",
        color: "#FF0000",
        marginTop: 18,
    },

    warningText: {
        marginLeft: 8,
        color: "#FF0000",
        fontWeight: "600",
        fontSize: 15,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
    },

    actionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666666",
    },

    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    approveButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 18,
    },

    rejectButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: "#0152A8",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
});