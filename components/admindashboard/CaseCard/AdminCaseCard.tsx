import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    openCaseFile,
    downloadCaseFile,
} from "@/services/fileService";
import { Picker } from "@react-native-picker/picker";

import {
    deleteCase,
    uploadPreviewFile,
    updateCaseStatus,
} from "@/services/caseService";
import * as DocumentPicker from "expo-document-picker";

import AppointmentInfo from "@/components/shared/CaseCard/AppointmentInfo";
import DeadlineSection from "@/components/shared/CaseCard/DeadlineSection";
import DigitalFileSection from "@/components/shared/CaseCard/DigitalFileSection";
import FooterActions from "@/components/shared/CaseCard/FooterActions";
import Header from "@/components/shared/CaseCard/Header";
import PatientInfo from "@/components/shared/CaseCard/PatientInfo";
import PDFSection from "@/components/shared/CaseCard/PDFSection";
import PreviewSection from "@/components/shared/CaseCard/PreviewSection";

interface AdminCaseCardProps {
    caseData: any;
    onCaseDeleted?: (caseId: number) => void;
    onCaseUpdated?: () => void;
}

export default function AdminCaseCard({
    caseData,
    onCaseDeleted,
    onCaseUpdated
}: AdminCaseCardProps) {
    const [uploadingPreview, setUploadingPreview] =
        useState(false);

    /* =========================================================
       EXPANDED / COLLAPSED STATE

       Every AdminCaseCard gets its own state.

       Initial state:
       expanded = false

       This means every case starts collapsed independently.
    ========================================================= */

    const [expanded, setExpanded] = useState(false);
    const [status, setStatus] = useState(
        caseData.status || "Submitted"
    );
    const STATUS_OPTIONS = [
        "Submitted",
        "InProduction",
        "QualityCheck",
        "Shipped",
        "Delivered",
    ];
    const handleStatusChange = async (
        newStatus: string
    ) => {
        if (newStatus === status) {
            return;
        }

        const previousStatus = status;

        try {
            // Update UI immediately
            setStatus(newStatus);

            console.log(
                "Updating status:",
                caseData.id,
                newStatus
            );

            await updateCaseStatus(
                caseData.id,
                newStatus
            );

            console.log(
                "Status updated successfully"
            );

            // Refresh parent list if needed
            onCaseUpdated?.();

        } catch (error: any) {

            console.error(
                "Status update failed:",
                error
            );

            // Restore previous value
            setStatus(previousStatus);

            Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to update case status."
            );
        }
    };
    /* ================= PREVIEW STATUS ================= */

    const [previewStatus, setPreviewStatus] = useState(
        caseData.preview_status
    );

    /* ================= DEADLINE ================= */

    const deadlinePassed = caseData.delivery_deadline
        ? new Date(caseData.delivery_deadline) < new Date()
        : false;

    /* ================= FILES ================= */

    const files = caseData.files || [];

    const casePdf = files.find(
        (file: any) =>
            file.file_category === "case_document"
    );

    const digitalFiles = files
        .filter(
            (file: any) =>
                file.file_category === "digital_file"
        )
        .slice(0, 5);

    const previewFile = files.find(
        (file: any) =>
            file.file_category === "preview_file"
    );

    /* =========================================================
       EXPAND / COLLAPSE
    ========================================================= */

    const toggleExpanded = () => {
        setExpanded((previous) => !previous);
    };

    /* ================= DELETE ================= */

    const handleDelete = () => {
        Alert.alert(
            "Delete Case",
            "Are you sure you want to delete this case?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {
                        try {

                            await deleteCase(caseData.id);

                            Alert.alert(
                                "Success",
                                "Case deleted successfully."
                            );

                            onCaseDeleted?.(
                                caseData.id
                            );

                        } catch (error: any) {

                            Alert.alert(
                                "Error",
                                error?.response?.data?.detail ||
                                "Failed to delete case."
                            );

                        }
                    },
                },
            ]
        );
    };

    const handleUploadPreview = async () => {
        try {
            const result =
                await DocumentPicker.getDocumentAsync({
                    type: [
                        "application/pdf",
                        "image/*",
                    ],
                    copyToCacheDirectory: true,
                    multiple: false,
                });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];

            setUploadingPreview(true);

            console.log("Uploading preview:", file);

            await uploadPreviewFile(
                caseData.id,
                file
            );

            Alert.alert(
                "Success",
                "Preview uploaded successfully."
            );

            // Refresh cases in Admin Dashboard
            onCaseUpdated?.();

        } catch (error: any) {
            console.error(
                "Preview upload failed:",
                error?.response?.data ||
                error?.message ||
                error
            );

            Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to upload preview."
            );

        } finally {
            setUploadingPreview(false);
        }
    };

    /* =========================================================
       UI
    ========================================================= */

    return (
        <View style={styles.card}>

            {/* =================================================
                COMPACT CASE HEADER

                This is the only thing visible initially.

                Example:

                #39
                John Singha                 ▼
                Submitted
            ================================================= */}


            <Header
                caseId={caseData.id}
                status={status}
                doctorName={caseData.doctor_name}
                patientName={caseData.patient_name}
                isEdited={caseData.is_edited}
                expanded={expanded}
                onExpandPress={toggleExpanded}
            />


            {/* =================================================
                EXISTING FULL CASE DETAILS

                IMPORTANT:
                Nothing inside this section has been redesigned.

                The existing components are rendered exactly
                when the card is expanded.
            ================================================= */}

            {expanded && (
                <View style={styles.expandedContent}>


                    {/* ================= PATIENT ================= */}

                    <PatientInfo
                        patientName={
                            caseData.patient_name
                        }
                        profileImage=""
                    />

                    {/* ================= APPOINTMENT ================= */}

                    <AppointmentInfo
                        appointmentDate={
                            caseData.appointment_date
                        }
                        age={
                            caseData.age
                                ? `${caseData.age} Years`
                                : "-"
                        }
                    />

                    {/* ================= CASE PDF ================= */}

                    <PDFSection
                        fileName={
                            casePdf?.file_name ||
                            "No Case PDF"
                        }

                        onPress={() => {

                            if (!casePdf) {
                                return;
                            }

                            openCaseFile(
                                casePdf.file_path,
                                casePdf.file_name
                            );

                        }}
                    />

                    {/* ================= DIGITAL FILES ================= */}

                    <DigitalFileSection
                        title="Digital Files"

                        files={digitalFiles.map(
                            (file: any) => ({
                                id: file.id,
                                fileName: file.file_name,
                                filePath: file.file_path,
                            })
                        )}

                        onDownload={(file: any) => {

                            downloadCaseFile(
                                file.id,
                                file.fileName
                            );

                        }}
                    />

                    {/* ================= PREVIEW ================= */}

                    <PreviewSection
                        role="admin"
                        previewStatus={previewStatus}
                        fileName={
                            previewFile?.file_name ||
                            "No Preview Uploaded"
                        }
                        onUpload={() => {
                            console.log("UPLOAD PREVIEW CLICKED", caseData.id);
                            handleUploadPreview();
                        }}
                        onDownload={() => {

                            if (!previewFile) {
                                return;
                            }

                            openCaseFile(
                                previewFile.file_path,
                                previewFile.file_name
                            );

                        }}
                        uploading={uploadingPreview}
                    />
                    {/* ================= DEADLINE ================= */}

                    <DeadlineSection
                        deadline={caseData.delivery_deadline}
                        status={status}
                        deadlinePassed={deadlinePassed}
                        previewStatus={previewStatus}
                        editableStatus={true}
                        onStatusChange={handleStatusChange}
                    />

                    {/* ================= FOOTER ================= */}
                    <FooterActions
                        onDelete={handleDelete}
                    />

                </View>
            )}

        </View>
    );
}

/* ============================================================
   STYLES

   Existing card styling is preserved.
   Only the new compact header styles are added.
============================================================ */

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        marginHorizontal: 18,

        marginTop: 20,

        overflow: "hidden",

        borderWidth: 1,

        borderColor: "#D9E0EC",

        elevation: 3,
    },

    /* =========================================================
       COMPACT HEADER
    ========================================================= */

    compactHeader: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        paddingHorizontal: 18,

        paddingVertical: 15,

        backgroundColor: "#FFFFFF",
    },

    compactInfo: {
        flex: 1,

        paddingRight: 12,
    },

    compactCaseId: {
        fontSize: 15,

        fontWeight: "700",

        color: "#1F2937",

        marginBottom: 4,
    },

    compactDoctorName: {
        fontSize: 15,

        fontWeight: "600",

        color: "#1F2937",

        marginBottom: 4,
    },

    compactStatus: {
        fontSize: 13,

        color: "#6B7280",
    },

    expandIconContainer: {
        width: 32,

        height: 32,

        alignItems: "center",

        justifyContent: "center",
    },

    /* =========================================================
       EXPANDED CONTENT

       No new styling is applied to the existing components.
    ========================================================= */

    expandedContent: {
        width: "100%",
    },

    fileIconContainer: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

});