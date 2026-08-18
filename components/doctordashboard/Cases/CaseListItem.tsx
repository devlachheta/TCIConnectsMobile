import { StyleSheet, Text, View } from "react-native";

interface CaseListItemProps {
    caseData: any;
}

export default function CaseListItem({
    caseData,
}: CaseListItemProps) {

    const files = caseData.files || [];

    const casePdf = files.find(
        (file: any) =>
            file.file_category === "case_document"
    );

    const digitalFiles = files.filter(
        (file: any) =>
            file.file_category === "digital_file"
    );

    const formatDate = (date: string) => {
        if (!date) return "-";

        const formatted = new Date(date);

        return formatted.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const deadlinePassed = caseData.delivery_deadline
        ? new Date(caseData.delivery_deadline) <
        new Date()
        : false;

    return (
        <View style={styles.card}>

            {/* TOP */}
            <View style={styles.topRow}>

                <View>
                    <Text style={styles.caseLabel}>
                        CASE ID
                    </Text>

                    <Text style={styles.caseId}>
                        #{caseData.id}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        caseData.status === "Submitted"
                            ? styles.submitted
                            : styles.otherStatus,
                    ]}
                >
                    <Text style={styles.statusText}>
                        {caseData.status || "-"}
                    </Text>
                </View>

            </View>

            {/* PATIENT */}
            <View style={styles.section}>

                <Text style={styles.label}>
                    Patient
                </Text>

                <Text style={styles.patientName}>
                    {caseData.patient_name || "-"}
                </Text>

            </View>

            {/* BASIC INFO */}
            <View style={styles.infoRow}>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>
                        Appointment
                    </Text>

                    <Text style={styles.value}>
                        {formatDate(
                            caseData.appointment_date
                        )}
                    </Text>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.label}>
                        Age
                    </Text>

                    <Text style={styles.value}>
                        {caseData.age
                            ? `${caseData.age} Years`
                            : "-"}
                    </Text>
                </View>

            </View>

            {/* DEADLINE */}
            <View style={styles.deadlineContainer}>

                <View>
                    <Text style={styles.label}>
                        Delivery Deadline
                    </Text>

                    <Text
                        style={[
                            styles.deadline,
                            deadlinePassed &&
                            styles.deadlinePassed,
                        ]}
                    >
                        {formatDate(
                            caseData.delivery_deadline
                        )}
                    </Text>
                </View>

                {deadlinePassed && (
                    <Text style={styles.passedText}>
                        Deadline passed
                    </Text>
                )}

            </View>

            {/* FILES */}
            <View style={styles.filesRow}>

                <View style={styles.fileItem}>
                    <Text style={styles.label}>
                        Case PDF
                    </Text>

                    <Text style={styles.fileValue}>
                        {casePdf
                            ? "Available"
                            : "Not available"}
                    </Text>
                </View>

                <View style={styles.fileItem}>
                    <Text style={styles.label}>
                        Digital Files
                    </Text>

                    <Text style={styles.fileValue}>
                        {digitalFiles.length}{" "}
                        {digitalFiles.length === 1
                            ? "File"
                            : "Files"}
                    </Text>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 18,
        marginTop: 12,
        padding: 17,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D9E0EC",
        elevation: 2,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    caseLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#8E8E93",
        letterSpacing: 0.5,
    },

    caseId: {
        marginTop: 3,
        fontSize: 19,
        fontWeight: "700",
        color: "#0152A8",
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    submitted: {
        backgroundColor: "#E8F1FF",
    },

    otherStatus: {
        backgroundColor: "#F1F3F5",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0152A8",
    },

    section: {
        marginTop: 18,
    },

    label: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 4,
    },

    patientName: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111827",
    },

    infoRow: {
        flexDirection: "row",
        marginTop: 16,
    },

    infoBox: {
        flex: 1,
    },

    value: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
    },

    deadlineContainer: {
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: "#EEF1F5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    deadline: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },

    deadlinePassed: {
        color: "#E53935",
    },

    passedText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#E53935",
    },

    filesRow: {
        flexDirection: "row",
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: "#EEF1F5",
    },

    fileItem: {
        flex: 1,
    },

    fileValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0152A8",
    },

});