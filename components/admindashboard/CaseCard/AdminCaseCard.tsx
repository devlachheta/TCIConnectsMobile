import { useState } from "react";
import {
    Alert,
    StyleSheet,
    View,
} from "react-native";

import {
    downloadCaseFile,
    openCaseFile,
} from "@/services/fileService";

import {
    deleteCase,
    updateCaseStatus,
    uploadPreviewFile,
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
    onCaseUpdated,
}: AdminCaseCardProps) {

    const [uploadingPreview, setUploadingPreview] =
        useState(false);

    const [expanded, setExpanded] =
        useState(false);

    const [status, setStatus] =
        useState(
            caseData.status || "Submitted"
        );

    const [previewStatus, setPreviewStatus] =
        useState(
            caseData.preview_status
        );

    const handleStatusChange = async (
        newStatus: string
    ) => {

        if (newStatus === status) {
            return;
        }

        const previousStatus = status;

        try {

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

            onCaseUpdated?.();

        } catch (error: any) {

            console.error(
                "Status update failed:",
                error
            );

            setStatus(previousStatus);

            Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to update case status."
            );
        }
    };

    const deadlinePassed =
        caseData.delivery_deadline
            ? new Date(
                caseData.delivery_deadline
            ) < new Date()
            : false;

    const files =
        caseData.files || [];

    const casePdf =
        files.find(
            (file: any) =>
                file.file_category ===
                "case_document"
        );

    const digitalFiles =
        files
            .filter(
                (file: any) =>
                    file.file_category ===
                    "digital_file"
            )
            .slice(0, 5);

    const previewFile =
        files.find(
            (file: any) =>
                file.file_category ===
                "preview_file"
        );

    const toggleExpanded = () => {
        setExpanded(
            previous => !previous
        );
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

                            await deleteCase(
                                caseData.id
                            );

                            Alert.alert(
                                "Success",
                                "Case deleted successfully."
                            );

                            onCaseDeleted?.(
                                caseData.id
                            );

                        } catch (error: any) {

                            console.error(
                                "Delete case failed:",
                                error
                            );

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

    const handleUploadPreview =
        async () => {

            console.log(
                "================================"
            );

            console.log(
                "UPLOAD PREVIEW CLICKED"
            );

            console.log(
                "CASE ID:",
                caseData.id
            );

            console.log(
                "================================"
            );

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

                const file =
                    result.assets[0];

                setUploadingPreview(true);

                console.log(
                    "Uploading preview:",
                    file
                );

                await uploadPreviewFile(
                    caseData.id,
                    file
                );

                Alert.alert(
                    "Success",
                    "Preview uploaded successfully."
                );

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

                setUploadingPreview(
                    false
                );
            }
        };

    return (
        <View style={styles.card}>

            <Header
                caseId={
                    caseData.id
                }
                status={
                    status
                }
                doctorName={
                    caseData.doctor_name
                }
                patientName={
                    caseData.patient_name
                }
                isEdited={
                    caseData.is_edited
                }
                expanded={
                    expanded
                }
                onExpandPress={
                    toggleExpanded
                }
            />

            {expanded && (

                <View
                    style={
                        styles.expandedContent
                    }
                >

                    <PatientInfo
                        patientName={
                            caseData.patient_name
                        }
                        profileImage=""
                    />

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
                        files={
                            digitalFiles.map(
                                (file: any) => ({
                                    id: file.id,
                                    fileName:
                                        file.file_name,
                                    filePath:
                                        file.file_path,
                                })
                            )
                        }
                        onDownload={
                            (file: any) => {

                                downloadCaseFile(
                                    file.id,
                                    file.fileName
                                );

                            }
                        }
                    />

                    <PreviewSection
                        role="admin"
                        previewStatus={
                            previewStatus
                        }
                        fileName={
                            previewFile?.file_name ||
                            "No Preview File"
                        }
                        uploading={
                            uploadingPreview
                        }
                        onUpload={() => {

                            console.log(
                                "UPLOAD PREVIEW CLICKED",
                                caseData.id
                            );

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
                    />

                    <DeadlineSection
                        deadline={
                            caseData.delivery_deadline
                        }
                        status={
                            status
                        }
                        deadlinePassed={
                            deadlinePassed
                        }
                        previewStatus={
                            previewStatus
                        }
                        editableStatus={
                            true
                        }
                        onStatusChange={
                            handleStatusChange
                        }
                    />

                    <FooterActions
                        onDelete={
                            handleDelete
                        }
                    />

                </View>
            )}

        </View>
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

    expandedContent: {
        width: "100%",
    },

});