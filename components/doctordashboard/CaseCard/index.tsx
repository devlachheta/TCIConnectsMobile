import { openCaseFile, downloadCaseFile } from "@/services/fileService";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import AppointmentInfo from "./AppointmentInfo";
import DeadlineSection from "./DeadlineSection";
import DigitalFileSection from "./DigitalFileSection";
import FooterActions from "./FooterActions";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import PDFSection from "./PDFSection";
import PreviewSection from "./PreviewSection";
import {
    Alert,
} from "react-native";
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

            setPreviewStatus("Preview Rejected");

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

            {/* Header */}
            <Header
                caseId={caseData.id}
                status={caseData.status}
                onMenuPress={() =>
                    console.log("Menu")
                }
            />
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
                fileName={
                    previewStatus === "Approved" && previewFile
                        ? previewFile.file_name
                        : "No Preview File"
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
                status={caseData.status}
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
});