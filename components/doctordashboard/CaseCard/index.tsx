import { StyleSheet, View } from "react-native";

import AppointmentInfo from "./AppointmentInfo";
import DeadlineSection from "./DeadlineSection";
import DigitalFileSection from "./DigitalFileSection";
import FooterActions from "./FooterActions";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import PDFSection from "./PDFSection";
import PreviewSection from "./PreviewSection";

export default function CaseCard() {
    return (
        <View style={styles.card}>
            <Header
                caseId="73"
                status="Submitted"

            />

            <PatientInfo
                patientName="Shubham"
            />

            <AppointmentInfo
                appointmentDate="22 Feb 2026 • 12:00 AM"
                age="32 Years"
            />

            <PDFSection
                fileName="View Case PDF"
                onPress={() => console.log("View PDF")}
            />

            <DigitalFileSection
                title="Digital Files"
                fileName="Preview File 1 (Png)"
                onDownload={() => console.log("Download")}
            />
            <PreviewSection
                fileName="Preview File 1.png"
                onDownload={() => console.log("Download Preview")}
            />

            <DeadlineSection
                deadline="22 Feb 2026"
                status="Submitted"
                deadlinePassed={true}
                onApprove={() => console.log("Approve")}
                onReject={() => console.log("Reject")}
            />

            <FooterActions
                onEdit={() => console.log("Edit")}
                onDelete={() => console.log("Delete")}
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