import { openCaseFile, downloadCaseFile } from "@/services/fileService";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import AppointmentInfo from "@/components/shared/CaseCard/AppointmentInfo";
import DeadlineSection from "@/components/shared/CaseCard/DeadlineSection";
import DigitalFileSection from "@/components/shared/CaseCard/DigitalFileSection";
import FooterActions from "@/components/shared/CaseCard/FooterActions";
import Header from "@/components/shared/CaseCard/Header";
import PatientInfo from "@/components/shared/CaseCard/PatientInfo";
import PDFSection from "@/components/shared/CaseCard/PDFSection";
import PreviewSection from "@/components/shared/CaseCard/PreviewSection";
import {
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    deleteCase,
    approvePreview,
    rejectPreview,
} from "@/services/caseService";

interface CaseCardProps {
    caseData: any;
    onCaseDeleted?: (caseId: number) => void;
    onEdit?: (caseData: any) => void;
}

export default function CaseCard({ caseData, onCaseDeleted,
    onEdit, }: CaseCardProps) {


    const [previewStatus, setPreviewStatus] = useState(
        caseData.preview_status
    );
    useEffect(() => {
        setPreviewStatus(caseData.preview_status);
    }, [caseData.preview_status]);
    const [expanded, setExpanded] = useState(false);

    const deadlinePassed = caseData.delivery_deadline
        ? new Date(caseData.delivery_deadline) < new Date()
        : false;

    const files = caseData.files || [];
    const casePdf = files.find(
        (file: any) =>
            file.file_category === "case_document"
    );


    const digitalFiles = files.filter(
        (file: any) =>
            file.file_category === "digital_file"
    ).slice(0, 5);


    const previewFile = files.find(
        (file: any) =>
            file.file_category === "preview_file"
    );



    const toggleExpanded = () => {
        setExpanded((previous) => !previous);
    };


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
    const handleApprovePreview = async () => {
        try {
            await approvePreview(caseData.id);

            setPreviewStatus("Approved");

            Alert.alert(
                "Success",
                "Preview approved successfully."
            );
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to approve preview."
            );
        }
    };
    const handleRejectPreview = async () => {
        try {
            await rejectPreview(caseData.id);

            setPreviewStatus("Rejected");

            Alert.alert(
                "Success",
                "Preview rejected."
            );

        } catch (error: any) {

            Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to reject preview."
            );
        }
    };

    return (
        <View style={styles.card}>

            <Header
                caseId={caseData.id}
                status={caseData.status || "Submitted"}
                patientName={caseData.patient_name}
                isEdited={caseData.is_edited}
                expanded={expanded}
                onExpandPress={toggleExpanded}
            />

            {expanded && (
                <View style={styles.expandedContent}>
                    <PatientInfo
                        patientName={caseData.patient_name}
                        profileImage=""
                    />

                    <AppointmentInfo
                        appointmentDate={
                            caseData.appointment_date
                        }
                        age={`${caseData.age} Years`}
                    />

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
                    <DigitalFileSection
                        title="Digital Files"
                        files={digitalFiles.map((file: any) => ({
                            id: file.id,
                            fileName: file.file_name,
                            filePath: file.file_path,
                        }))}
                        onDownload={(file: any) => {
                            downloadCaseFile(
                                file.id,
                                file.fileName
                            );
                        }}
                    />
                    <PreviewSection
                        role="doctor"

                        previewStatus={previewStatus}

                        fileName={
                            previewFile?.file_name ||
                            "No Preview File"
                        }

                        onDownload={() => {

                            if (
                                previewStatus !== "Approved" ||
                                !previewFile
                            ) {
                                return;
                            }

                            openCaseFile(
                                previewFile.file_path,
                                previewFile.file_name
                            );

                        }}
                    />
                    <DeadlineSection
                        deadline={caseData.delivery_deadline}
                        status={caseData.status || "Submitted"}
                        deadlinePassed={deadlinePassed}
                        previewStatus={previewStatus}
                        onApprove={handleApprovePreview}
                        onReject={handleRejectPreview}
                    />
                    <FooterActions
                        onEdit={() => {
                            onEdit?.(caseData);
                        }}
                        onDelete={handleDelete}
                    />
                </View>
            )
            }

        </View >
    );
}

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