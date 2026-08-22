import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PreviewSectionProps {
    fileName: string;
    previewStatus: string;

    // Doctor
    onDownload?: () => void;

    // Admin
    onUpload?: () => void;

    // Upload state
    uploading?: boolean;

    role: "admin" | "doctor";
}

export default function PreviewSection({
    fileName,
    previewStatus,
    onDownload,
    onUpload,
    uploading = false,
    role,
}: PreviewSectionProps) {

    const isAdmin = role === "admin";
    const isDoctor = role === "doctor";

    const hasPreview =
        !!fileName &&
        fileName !== "No Preview File";

    const doctorCanSeePreview =
        isDoctor &&
        previewStatus === "Approved" &&
        hasPreview;

    const adminCanSeePreview =
        isAdmin &&
        hasPreview;

    const canOpenPreview =
        doctorCanSeePreview ||
        adminCanSeePreview;

    return (
        <View style={styles.container}>

            <Text style={styles.label}>
                Preview
            </Text>

            {/* =====================================================
                ADMIN
            ===================================================== */}

            {isAdmin && (
                <TouchableOpacity
                    style={[
                        styles.fileContainer,
                        uploading && styles.disabledContainer,
                    ]}
                    onPress={
                        uploading
                            ? undefined
                            : hasPreview
                                ? onDownload
                                : onUpload
                    }
                    activeOpacity={uploading ? 1 : 0.8}
                    disabled={uploading}
                >

                    <View style={styles.leftSection}>

                        <Ionicons
                            name={
                                hasPreview
                                    ? "document-text-outline"
                                    : "cloud-upload-outline"
                            }
                            size={22}
                            color="#0152A8"
                        />

                        <Text
                            style={styles.fileName}
                            numberOfLines={1}
                        >
                            {uploading
                                ? "Uploading preview..."
                                : hasPreview
                                    ? fileName
                                    : "Upload Preview"}
                        </Text>

                    </View>

                    {uploading ? (
                        <ActivityIndicator
                            size="small"
                            color="#0152A8"
                        />
                    ) : (
                        <Ionicons
                            name={
                                hasPreview
                                    ? "download-outline"
                                    : "cloud-upload-outline"
                            }
                            size={22}
                            color="#0152A8"
                        />
                    )}

                </TouchableOpacity>
            )}

            {/* =====================================================
                DOCTOR
            ===================================================== */}

            {isDoctor && (

                <TouchableOpacity
                    style={[
                        styles.fileContainer,

                        !doctorCanSeePreview &&
                        styles.disabledContainer,
                    ]}
                    onPress={
                        canOpenPreview
                            ? onDownload
                            : undefined
                    }
                    activeOpacity={
                        canOpenPreview
                            ? 0.8
                            : 1
                    }
                    disabled={!canOpenPreview}
                >

                    <View style={styles.leftSection}>

                        <Ionicons
                            name={
                                doctorCanSeePreview
                                    ? "document-text-outline"
                                    : "lock-closed-outline"
                            }
                            size={22}
                            color={
                                doctorCanSeePreview
                                    ? "#0152A8"
                                    : "#9CA3AF"
                            }
                        />

                        <Text
                            style={[
                                styles.fileName,

                                !doctorCanSeePreview &&
                                styles.disabledText,
                            ]}
                            numberOfLines={1}
                        >
                            {previewStatus === "Waiting User"
                                ? "Preview waiting for approval"
                                : previewStatus === "Rejected"
                                    ? "Preview rejected"
                                    : previewStatus === "Approved"
                                        ? fileName
                                        : "No Preview Available"}
                        </Text>

                    </View>

                    {doctorCanSeePreview && (
                        <Ionicons
                            name="download-outline"
                            size={22}
                            color="#0152A8"
                        />
                    )}

                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666666",
        marginBottom: 12,
    },

    fileContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: "#F8FAFC",

        borderWidth: 1,
        borderColor: "#E5E7EB",

        borderRadius: 10,

        paddingHorizontal: 14,
        paddingVertical: 14,
    },

    disabledContainer: {
        backgroundColor: "#F3F4F6",
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    fileName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "600",
        color: "#0152A8",
        flex: 1,
    },

    disabledText: {
        color: "#9CA3AF",
    },
});