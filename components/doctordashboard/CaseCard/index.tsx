import { openCaseFile } from "@/services/fileService";
import { StyleSheet, View } from "react-native";

import AppointmentInfo from "./AppointmentInfo";
import DeadlineSection from "./DeadlineSection";
import DigitalFileSection from "./DigitalFileSection";
import FooterActions from "./FooterActions";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import PDFSection from "./PDFSection";
import PreviewSection from "./PreviewSection";

interface CaseCardProps {
    caseData: any;
}

export default function CaseCard({ caseData }: CaseCardProps) {

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
            {digitalFiles.length > 0 ? (

                digitalFiles.map(
                    (file: any) => (

                        <DigitalFileSection
                            key={file.id}
                            title="Digital File"
                            fileName={file.file_name}
                            onDownload={() => {

                                openCaseFile(
                                    file.file_path,
                                    file.file_name
                                );

                            }}
                        />

                    )
                )

            ) : (

                <DigitalFileSection
                    title="Digital Files"
                    fileName="No Digital Files"
                    onDownload={() =>
                        console.log(
                            "No digital files"
                        )
                    }
                />

            )}
            <PreviewSection
                fileName={
                    previewFile?.file_name ||
                    "No Preview File"
                }
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
                status={caseData.status}
                deadlinePassed={
                    deadlinePassed
                }
                onApprove={() =>
                    console.log("Approve")
                }
                onReject={() =>
                    console.log("Reject")
                }
            />
            <FooterActions
                onEdit={() =>
                    console.log("Edit")
                }
                onDelete={() =>
                    console.log("Delete")
                }
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