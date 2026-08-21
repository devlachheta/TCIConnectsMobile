import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DeadlineSectionProps {
    deadline: string;
    status: string;
    deadlinePassed: boolean;
    previewStatus: string;
    onApprove?: () => void;
    onReject?: () => void;
    onStatusChange?: (status: string) => void;
    editableStatus?: boolean;
}
export default function DeadlineSection({
    deadline,
    status,
    deadlinePassed,
    previewStatus,
    onApprove,
    onReject,
    onStatusChange,
    editableStatus = false,
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

                    {editableStatus ? (
                        <View style={styles.statusPickerContainer}>
                            <Picker
                                selectedValue={status}
                                onValueChange={(value) => {
                                    onStatusChange?.(value);
                                }}
                                style={styles.statusPicker}
                                dropdownIconColor="#0152A8"
                            >
                                <Picker.Item
                                    label="Submitted"
                                    value="Submitted"
                                />

                                <Picker.Item
                                    label="InProduction"
                                    value="InProduction"
                                />

                                <Picker.Item
                                    label="QualityCheck"
                                    value="QualityCheck"
                                />

                                <Picker.Item
                                    label="Shipped"
                                    value="Shipped"
                                />

                                <Picker.Item
                                    label="Delivered"
                                    value="Delivered"
                                />
                            </Picker>
                        </View>
                    ) : (
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {status}
                            </Text>
                        </View>
                    )}
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
            {previewStatus === "Waiting User" &&
                onApprove &&
                onReject && (

                    <View style={styles.actionContainer}>

                        <Text style={styles.actionTitle}>
                            Actions
                        </Text>

                        <View style={styles.buttonContainer}>

                            {/* APPROVE */}

                            <TouchableOpacity
                                style={styles.approveButton}
                                onPress={onApprove}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="checkmark"
                                    size={28}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>

                            {/* REJECT */}

                            <TouchableOpacity
                                style={styles.rejectButton}
                                onPress={onReject}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="close"
                                    size={28}
                                    color="#0152A8"
                                />
                            </TouchableOpacity>

                        </View>

                    </View>
                )}
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

    statusPickerContainer: {
        width: 180,
        height: 50,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    statusPicker: {
        width: "100%",
        height: 50,
        color: "#0152A8",
    },
});