import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
    caseId: string | number;
    status: string;
    patientName?: string;
    doctorName?: string;
    expanded: boolean;
    isEdited?: boolean;
    onExpandPress: () => void;
}

export default function Header({
    caseId,
    status,
    patientName,
    doctorName,
    expanded,
    isEdited = false,
    onExpandPress,
}: HeaderProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onExpandPress}
            activeOpacity={0.75}
        >
            {/* LEFT SECTION */}
            <View style={styles.leftSection}>

                {/* PDF ICON */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="document-text-outline"
                        size={28}
                        color="#1F2937"
                    />
                </View>

                {/* CASE INFORMATION */}
                <View style={styles.textContainer}>
                    <Text
                        style={styles.caseTitle}
                        numberOfLines={1}
                    >
                        Case #{caseId}
                    </Text>
                    {doctorName && (
                        <Text
                            style={styles.infoText}
                            numberOfLines={1}
                        >
                            Doctor: {doctorName}
                        </Text>
                    )}

                    {/* PATIENT NAME - DOCTOR + ADMIN */}
                    <Text
                        style={styles.infoText}
                        numberOfLines={1}
                    >
                        Patient: {patientName || "-"}
                    </Text>

                    {isEdited && (
                        <View style={styles.editedBadge}>
                            <Ionicons
                                name="create-outline"
                                size={13}
                                color="#D97706"
                            />

                            <Text style={styles.editedText}>
                                Edited
                            </Text>
                        </View>
                    )}

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            {/* RIGHT SECTION - ONLY DROPDOWN */}
            <View style={styles.expandIconContainer}>
                <Ionicons
                    name={
                        expanded
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                    }
                    size={24}
                    color="#1F2937"
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 18,
        backgroundColor: "#FFFFFF",
        width: "100%",
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
    infoText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4B5563",
        marginBottom: 3,
    },

    editedBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#FFF7ED",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginTop: 2,
        marginBottom: 3,
    },

    editedText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#D97706",
        marginLeft: 4,
    },

    textContainer: {
        justifyContent: "center",
        flex: 1,
    },

    caseTitle: {
        fontSize: 22,
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
        fontWeight: "500",
        color: "#808080",
    },

    expandIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },
});