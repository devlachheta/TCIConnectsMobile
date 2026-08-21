import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";

import Step1CaseDetails from "@/components/doctordashboard/newcases/Step1CaseDetails";
import Step2DigitalFiles from "@/components/doctordashboard/newcases/Step2DigitalFiles";
import Step3Review from "@/components/doctordashboard/newcases/Step3Review";

import {
    submitCase as submitCaseApi,
    uploadCaseFile,
} from "../../services/caseService";

export default function NewCases() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);

    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [deliveryDate, setDeliveryDate] =
        useState<Date | null>(null);
    const [showDeliveryPicker, setShowDeliveryPicker] =
        useState(false);

    const [shadeOpen, setShadeOpen] = useState(false);

    const [surfaceTexture, setSurfaceTexture] =
        useState<string[]>([]);

    const [glazedPolish, setGlazedPolish] =
        useState<string[]>([]);

    const [incisalTranslucency, setIncisalTranslucency] =
        useState<string[]>([]);

    const [preparedToothShade, setPreparedToothShade] =
        useState<string[]>([]);

    const [shadeInstructions, setShadeInstructions] =
        useState("");

    const [materialTypes, setMaterialTypes] =
        useState<string[]>([]);

    const [crownBridgeTypes, setCrownBridgeTypes] =
        useState<string[]>([]);

    const [caseStages, setCaseStages] =
        useState<string[]>([]);

    const [implantOpen, setImplantOpen] = useState(false);

    const [implantInstructions, setImplantInstructions] =
        useState("");

    const [additionalRestorations, setAdditionalRestorations] =
        useState<string[]>([]);

    const [designPreview, setDesignPreview] = useState(false);

    const [implantTable, setImplantTable] =
        useState<string[][]>(
            Array.from(
                { length: 3 },
                () => Array(8).fill("")
            )
        );

    const [uploadedFiles, setUploadedFiles] =
        useState<DocumentPicker.DocumentPickerAsset[]>(
            []
        );

    const [caseDocument, setCaseDocument] =
        useState<DocumentPicker.DocumentPickerAsset | null>(
            null
        );

    const [uploadProgress, setUploadProgress] =
        useState<Record<string, number>>({});

    const [caseDocumentProgress, setCaseDocumentProgress] =
        useState(0);

    const [submitting, setSubmitting] = useState(false);

    const [step1Error, setStep1Error] = useState("");
    const [step2Error, setStep2Error] = useState("");

    const [caseDetailsOpen, setCaseDetailsOpen] =
        useState(true);

    const [reviewImplantOpen, setReviewImplantOpen] =
        useState(true);

    const [caseDocumentOpen, setCaseDocumentOpen] =
        useState(true);

    const [digitalFilesOpen, setDigitalFilesOpen] =
        useState(true);

    const [additionalInfoOpen, setAdditionalInfoOpen] =
        useState(true);

    const [confirmDigitalMedical, setConfirmDigitalMedical] =
        useState(false);

    const [confirmGdpr, setConfirmGdpr] =
        useState(false);

    const [confirmCaseInstructions, setConfirmCaseInstructions] =
        useState(false);

    const [gdprError, setGdprError] = useState("");
    const [agreementError, setAgreementError] = useState("");
    const [consentError, setConsentError] = useState("");

    const [caseSubmitted, setCaseSubmitted] = useState(false);

    const toggleValue = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter((previous) =>
            previous.includes(value)
                ? previous.filter(
                    (item) => item !== value
                )
                : [...previous, value]
        );
    };

    const toggleSurfaceTexture = (value: string) => {
        toggleValue(
            value,
            setSurfaceTexture
        );
    };

    const toggleGlazedPolish = (value: string) => {
        toggleValue(
            value,
            setGlazedPolish
        );
    };

    const toggleIncisalTranslucency = (
        value: string
    ) => {
        toggleValue(
            value,
            setIncisalTranslucency
        );
    };

    const togglePreparedToothShade = (
        value: string
    ) => {
        toggleValue(
            value,
            setPreparedToothShade
        );
    };

    const toggleMaterialType = (value: string) => {
        toggleValue(
            value,
            setMaterialTypes
        );
    };

    const toggleCrownBridgeType = (
        value: string
    ) => {
        toggleValue(
            value,
            setCrownBridgeTypes
        );
    };

    const toggleCaseStage = (value: string) => {
        toggleValue(
            value,
            setCaseStages
        );
    };

    const toggleAdditionalRestoration = (
        value: string
    ) => {
        toggleValue(
            value,
            setAdditionalRestorations
        );
    };

    const updateImplantCell = (
        rowIndex: number,
        columnIndex: number,
        value: string
    ) => {
        setImplantTable((previous) => {
            const updated = previous.map(
                (row) => [...row]
            );

            updated[rowIndex][columnIndex] =
                value;

            return updated;
        });
    };

    const goToStep2 = () => {
        if (!patientName.trim()) {
            setStep1Error(
                "Patient Name is required."
            );
            return;
        }

        setStep1Error("");
        setCurrentStep(2);
    };

    const goToStep3 = () => {
        if (uploadedFiles.length === 0) {
            setStep2Error(
                "Please upload at least one file."
            );
            return;
        }

        if (uploadedFiles.length > 5) {
            setStep2Error(
                "You can upload a maximum of 5 files."
            );
            return;
        }

        setStep2Error("");
        setCurrentStep(3);
    };

    const selectTestFile = async () => {
        if (uploadedFiles.length >= 5) {
            setStep2Error(
                "You can upload a maximum of 5 files."
            );
            return;
        }

        try {
            const result =
                await DocumentPicker.getDocumentAsync({
                    type: "*/*",
                    multiple: true,
                    copyToCacheDirectory: false,
                });

            if (result.canceled) {
                return;
            }

            const remainingSlots =
                5 - uploadedFiles.length;

            const selectedFiles =
                result.assets.slice(
                    0,
                    remainingSlots
                );

            setUploadedFiles((previous) => [
                ...previous,
                ...selectedFiles,
            ]);

            setUploadProgress((previous) => {
                const updated = {
                    ...previous,
                };

                selectedFiles.forEach((file) => {
                    updated[file.uri] = 0;
                });

                return updated;
            });

            if (
                result.assets.length >
                remainingSlots
            ) {
                setStep2Error(
                    "You can upload a maximum of 5 files."
                );
            } else {
                setStep2Error("");
            }
        } catch (error) {
            console.error(
                "FILE PICKER ERROR:",
                error
            );

            setStep2Error(
                "Unable to select files."
            );
        }
    };

    const removeUploadedFile = (
        uri: string
    ) => {
        setUploadedFiles((previous) =>
            previous.filter(
                (file) =>
                    file.uri !== uri
            )
        );

        setUploadProgress((previous) => {
            const updated = {
                ...previous,
            };

            delete updated[uri];

            return updated;
        });
    };

    const selectCaseDocument = async () => {
        try {
            const result =
                await DocumentPicker.getDocumentAsync({
                    type: "*/*",
                    multiple: false,
                    copyToCacheDirectory: false,
                });

            if (result.canceled) {
                return;
            }

            setCaseDocument(
                result.assets[0]
            );

            setCaseDocumentProgress(0);
        } catch (error) {
            console.error(
                "CASE DOCUMENT PICKER ERROR:",
                error
            );
        }
    };

    const getDoctorId = async () => {
        const userData =
            await AsyncStorage.getItem("user");

        if (!userData) {
            throw new Error(
                "Doctor information not found."
            );
        }

        const user = JSON.parse(userData);

        return user.id;
    };

    const submitCase = async () => {
        if (submitting) {
            return;
        }

        setGdprError("");
        setAgreementError("");
        setConsentError("");

        let hasError = false;

        if (!confirmDigitalMedical) {
            setGdprError(
                "You must confirm GDPR compliance."
            );
            hasError = true;
        }

        if (!confirmGdpr) {
            setAgreementError(
                "You must confirm Data Processing & Confidentiality Agreement."
            );
            hasError = true;
        }

        if (!confirmCaseInstructions) {
            setConsentError(
                "Patient consent is required."
            );
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            setSubmitting(true);

            setUploadProgress((previous) => {
                const updated = {
                    ...previous,
                };

                uploadedFiles.forEach((file) => {
                    updated[file.uri] = 0;
                });

                return updated;
            });

            setCaseDocumentProgress(0);

            const doctorId =
                await getDoctorId();

            const implantDetails =
                implantTable.map((row) => ({
                    implant_type: row[0],
                    platform_diameter: row[1],
                    screw_retained: row[2],
                    screw_retained_hybrid: row[3],
                    cement_retained_ti_abutment:
                        row[4],
                    zr_abutment: row[5],
                    implant_bar_type: row[6],
                    attachment_type: row[7],
                }));

            const payload = {
                doctor_id: doctorId,
                patient_name: patientName,
                gender: gender || null,
                age: age ? Number(age) : null,

                appointment_date: date
                    ? date.toISOString().split("T")[0]
                    : null,

                appointment_time: time
                    ? time.toTimeString().slice(0, 5)
                    : null,

                delivery_deadline: deliveryDate
                    ? deliveryDate
                        .toISOString()
                        .split("T")[0]
                    : null,

                preview_status: "-",
                status: "Submitted",

                details: {
                    case_stage: caseStages,
                    surface_texture: surfaceTexture,
                    glazed_polish: glazedPolish,
                    incisal_translucency:
                        incisalTranslucency,
                    prepared_tooth_shade:
                        preparedToothShade,
                    shade_guide_color:
                        shadeInstructions,
                    material_type: materialTypes,
                    crown_bridge:
                        crownBridgeTypes,
                    additional_restorations:
                        additionalRestorations,
                    implant_details:
                        implantDetails,
                    design_preview:
                        designPreview,
                    additional_instructions:
                        implantInstructions,
                },

                files: [],
            };

            const response =
                await submitCaseApi(payload);

            const caseId = response.id;

            for (const file of uploadedFiles) {
                await uploadCaseFile(
                    caseId,
                    file,
                    "digital_file",
                    (progress: number) => {
                        setUploadProgress(
                            (previous: Record<string, number>) => {
                                return {
                                    ...previous,
                                    [file.uri]:
                                        progress,
                                };
                            }
                        );
                    }
                );
            }

            if (caseDocument) {
                await uploadCaseFile(
                    caseId,
                    caseDocument,
                    "case_document",
                    (progress: number) => {
                        setCaseDocumentProgress(
                            progress
                        );
                    }
                );
            }

            setCaseSubmitted(true);
        } catch (error: any) {
            console.error(
                "CASE SUBMISSION ERROR:",
                error?.response?.data ||
                error?.message ||
                error
            );
        } finally {
            setSubmitting(false);
        }
    };

    const startNewCase = () => {
        setPatientName("");
        setPatientId("");
        setAge("");
        setGender("");

        setDate(null);
        setTime(null);
        setDeliveryDate(null);

        setSurfaceTexture([]);
        setGlazedPolish([]);
        setIncisalTranslucency([]);
        setPreparedToothShade([]);

        setShadeInstructions("");

        setMaterialTypes([]);
        setCrownBridgeTypes([]);
        setCaseStages([]);

        setImplantInstructions("");
        setAdditionalRestorations([]);

        setDesignPreview(false);

        setImplantTable(
            Array.from(
                { length: 3 },
                () => Array(8).fill("")
            )
        );

        setUploadedFiles([]);
        setCaseDocument(null);

        setUploadProgress({});
        setCaseDocumentProgress(0);

        setStep1Error("");
        setStep2Error("");

        setConfirmDigitalMedical(false);
        setConfirmGdpr(false);
        setConfirmCaseInstructions(false);

        setGdprError("");
        setAgreementError("");
        setConsentError("");

        setCaseSubmitted(false);
        setSubmitting(false);
        setCurrentStep(1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {currentStep === 1 && (
                    <Step1CaseDetails
                        patientName={patientName}
                        setPatientName={setPatientName}
                        patientId={patientId}
                        setPatientId={setPatientId}
                        age={age}
                        setAge={setAge}
                        gender={gender}
                        setGender={setGender}
                        date={date}
                        setDate={setDate}
                        time={time}
                        setTime={setTime}
                        deliveryDate={deliveryDate}
                        setDeliveryDate={setDeliveryDate}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        showTimePicker={showTimePicker}
                        setShowTimePicker={setShowTimePicker}
                        showDeliveryPicker={
                            showDeliveryPicker
                        }
                        setShowDeliveryPicker={
                            setShowDeliveryPicker
                        }
                        shadeOpen={shadeOpen}
                        setShadeOpen={setShadeOpen}
                        implantOpen={implantOpen}
                        setImplantOpen={setImplantOpen}
                        surfaceTexture={
                            surfaceTexture
                        }
                        toggleSurfaceTexture={
                            toggleSurfaceTexture
                        }
                        glazedPolish={glazedPolish}
                        toggleGlazedPolish={
                            toggleGlazedPolish
                        }
                        incisalTranslucency={
                            incisalTranslucency
                        }
                        toggleIncisalTranslucency={
                            toggleIncisalTranslucency
                        }
                        preparedToothShade={
                            preparedToothShade
                        }
                        togglePreparedToothShade={
                            togglePreparedToothShade
                        }
                        materialTypes={materialTypes}
                        toggleMaterialType={
                            toggleMaterialType
                        }
                        crownBridgeTypes={
                            crownBridgeTypes
                        }
                        toggleCrownBridgeType={
                            toggleCrownBridgeType
                        }
                        caseStages={caseStages}
                        toggleCaseStage={
                            toggleCaseStage
                        }
                        shadeInstructions={
                            shadeInstructions
                        }
                        setShadeInstructions={
                            setShadeInstructions
                        }
                        implantInstructions={
                            implantInstructions
                        }
                        setImplantInstructions={
                            setImplantInstructions
                        }
                        additionalRestorations={
                            additionalRestorations
                        }
                        toggleAdditionalRestoration={
                            toggleAdditionalRestoration
                        }
                        designPreview={designPreview}
                        setDesignPreview={
                            setDesignPreview
                        }
                        implantTable={implantTable}
                        updateImplantCell={
                            updateImplantCell
                        }
                        caseDocument={caseDocument}
                        setCaseDocument={
                            setCaseDocument
                        }
                        selectCaseDocument={
                            selectCaseDocument
                        }
                        step1Error={step1Error}
                        onNext={goToStep2}
                        onBack={() =>
                            router.replace(
                                "/(tabs)"
                            )
                        }
                    />
                )}

                {currentStep === 2 && (
                    <Step2DigitalFiles
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={
                            setUploadedFiles
                        }
                        uploadProgress={
                            uploadProgress
                        }
                        setUploadProgress={
                            setUploadProgress
                        }
                        step2Error={step2Error}
                        setStep2Error={
                            setStep2Error
                        }
                        selectTestFile={
                            selectTestFile
                        }
                        removeUploadedFile={
                            removeUploadedFile
                        }
                        submitting={submitting}
                        onBack={() =>
                            setCurrentStep(1)
                        }
                        onNext={goToStep3}
                    />
                )}

                {currentStep === 3 && (
                    <Step3Review
                        patientName={patientName}
                        patientId={patientId}
                        age={age}
                        gender={gender}
                        date={date}
                        time={time}
                        deliveryDate={
                            deliveryDate
                        }
                        caseStages={caseStages}
                        surfaceTexture={
                            surfaceTexture
                        }
                        glazedPolish={glazedPolish}
                        incisalTranslucency={
                            incisalTranslucency
                        }
                        preparedToothShade={
                            preparedToothShade
                        }
                        shadeInstructions={
                            shadeInstructions
                        }
                        materialTypes={
                            materialTypes
                        }
                        crownBridgeTypes={
                            crownBridgeTypes
                        }
                        implantTable={
                            implantTable
                        }
                        additionalRestorations={
                            additionalRestorations
                        }
                        designPreview={
                            designPreview
                        }
                        implantInstructions={
                            implantInstructions
                        }
                        caseDocument={
                            caseDocument
                        }
                        uploadedFiles={
                            uploadedFiles
                        }
                        caseDetailsOpen={
                            caseDetailsOpen
                        }
                        setCaseDetailsOpen={
                            setCaseDetailsOpen
                        }
                        shadeOpen={shadeOpen}
                        setShadeOpen={setShadeOpen}
                        reviewImplantOpen={
                            reviewImplantOpen
                        }
                        setReviewImplantOpen={
                            setReviewImplantOpen
                        }
                        caseDocumentOpen={
                            caseDocumentOpen
                        }
                        setCaseDocumentOpen={
                            setCaseDocumentOpen
                        }
                        digitalFilesOpen={
                            digitalFilesOpen
                        }
                        setDigitalFilesOpen={
                            setDigitalFilesOpen
                        }
                        additionalInfoOpen={
                            additionalInfoOpen
                        }
                        setAdditionalInfoOpen={
                            setAdditionalInfoOpen
                        }
                        confirmDigitalMedical={
                            confirmDigitalMedical
                        }
                        setConfirmDigitalMedical={
                            setConfirmDigitalMedical
                        }
                        confirmGdpr={confirmGdpr}
                        setConfirmGdpr={setConfirmGdpr}
                        confirmCaseInstructions={
                            confirmCaseInstructions
                        }
                        setConfirmCaseInstructions={
                            setConfirmCaseInstructions
                        }
                        gdprError={gdprError}
                        setGdprError={setGdprError}
                        agreementError={
                            agreementError
                        }
                        setAgreementError={
                            setAgreementError
                        }
                        consentError={
                            consentError
                        }
                        setConsentError={
                            setConsentError
                        }
                        submitting={submitting}
                        caseSubmitted={
                            caseSubmitted
                        }
                        onBack={() =>
                            setCurrentStep(2)
                        }
                        onSubmit={submitCase}
                        onSubmitAnother={
                            startNewCase
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    content: {
        flex: 1,
    },
});