import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
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

    // =====================================================
    // STEP
    // =====================================================

    const [currentStep, setCurrentStep] = useState(1);

    // =====================================================
    // PATIENT DETAILS
    // =====================================================

    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] =
        useState(false);

    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] =
        useState(false);

    const [deliveryDate, setDeliveryDate] =
        useState<Date | null>(null);

    const [showDeliveryPicker, setShowDeliveryPicker] =
        useState(false);

    // =====================================================
    // SHADE
    // =====================================================

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

    // =====================================================
    // CASE STAGE
    // =====================================================

    const [caseStages, setCaseStages] =
        useState<string[]>([]);

    // =====================================================
    // IMPLANT
    // =====================================================

    const [implantOpen, setImplantOpen] =
        useState(false);

    const [implantInstructions, setImplantInstructions] =
        useState("");

    const [additionalRestorations, setAdditionalRestorations] =
        useState<string[]>([]);

    const [designPreview, setDesignPreview] =
        useState(false);

    const [implantTable, setImplantTable] =
        useState<string[][]>(
            Array.from(
                { length: 3 },
                () => Array(8).fill("")
            )
        );

    // =====================================================
    // FILES
    // =====================================================

    const [uploadedFiles, setUploadedFiles] =
        useState<
            DocumentPicker.DocumentPickerAsset[]
        >([]);

    const [caseDocument, setCaseDocument] =
        useState<
            DocumentPicker.DocumentPickerAsset | null
        >(null);

    // =====================================================
    // STEP ERRORS
    // =====================================================

    const [step1Error, setStep1Error] =
        useState("");

    const [step2Error, setStep2Error] =
        useState("");

    // =====================================================
    // REVIEW STATE
    // =====================================================

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

    // =====================================================
    // CONFIRMATIONS
    // =====================================================

    const [confirmDigitalMedical, setConfirmDigitalMedical] =
        useState(false);

    const [confirmGdpr, setConfirmGdpr] =
        useState(false);

    const [confirmCaseInstructions, setConfirmCaseInstructions] =
        useState(false);

    const [gdprError, setGdprError] =
        useState("");

    const [agreementError, setAgreementError] =
        useState("");

    const [consentError, setConsentError] =
        useState("");

    // =====================================================
    // SUBMISSION
    // =====================================================

    const [caseSubmitted, setCaseSubmitted] =
        useState(false);

    // =====================================================
    // TOGGLE HELPERS
    // =====================================================

    const toggleValue = (
        value: string,
        setter: React.Dispatch<
            React.SetStateAction<string[]>
        >
    ) => {
        setter((previous) =>
            previous.includes(value)
                ? previous.filter(
                    (item) => item !== value
                )
                : [...previous, value]
        );
    };

    const toggleSurfaceTexture = (
        value: string
    ) => {
        toggleValue(
            value,
            setSurfaceTexture
        );
    };

    const toggleGlazedPolish = (
        value: string
    ) => {
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

    const toggleMaterialType = (
        value: string
    ) => {
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

    const toggleCaseStage = (
        value: string
    ) => {
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

    // =====================================================
    // IMPLANT TABLE
    // =====================================================

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

    // =====================================================
    // STEP 1 -> STEP 2
    // =====================================================

    const goToStep2 = () => {
        if (patientName.trim() === "") {
            setStep1Error(
                "Patient Name is required."
            );
            return;
        }

        setStep1Error("");
        setCurrentStep(2);
    };

    // =====================================================
    // STEP 2 -> STEP 3
    // =====================================================

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

    // =====================================================
    // DIGITAL FILE PICKER
    // =====================================================

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
                    type: [
                        "model/stl",
                        "model/obj",
                        "application/zip",
                        "image/jpeg",
                        "image/png",
                    ],
                    multiple: true,
                    copyToCacheDirectory: true,
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

            setUploadedFiles(
                (previous) => [
                    ...previous,
                    ...selectedFiles,
                ]
            );

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
            console.log(
                "FILE PICKER ERROR:",
                error
            );

            setStep2Error(
                "Unable to select files."
            );
        }
    };

    // =====================================================
    // CASE DOCUMENT PICKER
    // =====================================================

    const selectCaseDocument = async () => {
        try {
            const result =
                await DocumentPicker.getDocumentAsync({
                    type: "*/*",
                    multiple: false,
                    copyToCacheDirectory: true,
                });

            if (result.canceled) {
                return;
            }

            setCaseDocument(
                result.assets[0]
            );
        } catch (error) {
            console.log(
                "CASE DOCUMENT PICKER ERROR:",
                error
            );
        }
    };

    // =====================================================
    // DOCTOR ID
    // =====================================================

    const getDoctorId = async () => {
        const userData =
            await AsyncStorage.getItem(
                "user"
            );

        if (!userData) {
            throw new Error(
                "Doctor information not found."
            );
        }

        const user =
            JSON.parse(userData);

        return user.id;
    };

    // =====================================================
    // SUBMIT CASE
    // =====================================================

    const submitCase = async () => {
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
            const doctorId =
                await getDoctorId();

            const implantDetails =
                implantTable.map(
                    (row) => ({
                        implant_type:
                            row[0],
                        platform_diameter:
                            row[1],
                        screw_retained:
                            row[2],
                        screw_retained_hybrid:
                            row[3],
                        cement_retained_ti_abutment:
                            row[4],
                        zr_abutment:
                            row[5],
                        implant_bar_type:
                            row[6],
                        attachment_type:
                            row[7],
                    })
                );

            const payload = {
                doctor_id:
                    doctorId,

                patient_name:
                    patientName,

                gender:
                    gender || null,

                age:
                    age
                        ? Number(age)
                        : null,

                appointment_date:
                    date
                        ? date
                            .toISOString()
                            .split("T")[0]
                        : null,

                appointment_time:
                    time
                        ? time
                            .toTimeString()
                            .slice(0, 5)
                        : null,

                delivery_deadline:
                    deliveryDate
                        ? deliveryDate
                            .toISOString()
                            .split("T")[0]
                        : null,

                preview_status: "-",

                status: "Submitted",

                details: {
                    case_stage:
                        caseStages,

                    surface_texture:
                        surfaceTexture,

                    glazed_polish:
                        glazedPolish,

                    incisal_translucency:
                        incisalTranslucency,

                    prepared_tooth_shade:
                        preparedToothShade,

                    shade_guide_color:
                        shadeInstructions,

                    material_type:
                        materialTypes,

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

            console.log(
                "CASE PAYLOAD:",
                payload
            );

            const response =
                await submitCaseApi(
                    payload
                );

            console.log(
                "CASE RESPONSE:",
                response
            );

            const caseId =
                response.id;

            // Upload digital files
            for (
                const file of uploadedFiles
            ) {
                const fileResponse =
                    await uploadCaseFile(
                        caseId,
                        file,
                        "digital_file"
                    );

                console.log(
                    "FILE UPLOAD RESPONSE:",
                    fileResponse
                );
            }

            // Upload case document if selected
            if (caseDocument) {
                const documentResponse =
                    await uploadCaseFile(
                        caseId,
                        caseDocument,
                        "case_document"
                    );

                console.log(
                    "CASE DOCUMENT RESPONSE:",
                    documentResponse
                );
            }

            setCaseSubmitted(true);
        } catch (error: any) {
            console.log(
                "CASE SUBMISSION ERROR:",
                error?.response?.data ||
                error
            );
        }
    };

    // =====================================================
    // NEW CASE RESET
    // =====================================================

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

        setStep1Error("");
        setStep2Error("");

        setConfirmDigitalMedical(false);
        setConfirmGdpr(false);
        setConfirmCaseInstructions(false);

        setGdprError("");
        setAgreementError("");
        setConsentError("");

        setCaseSubmitted(false);
        setCurrentStep(1);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <SafeAreaView
            style={styles.container}
        >

            <View style={styles.content}>

                {currentStep === 1 && (
                    <Step1CaseDetails
                        patientName={
                            patientName
                        }
                        setPatientName={
                            setPatientName
                        }

                        patientId={
                            patientId
                        }
                        setPatientId={
                            setPatientId
                        }

                        age={age}
                        setAge={setAge}

                        gender={gender}
                        setGender={
                            setGender
                        }

                        date={date}
                        setDate={setDate}

                        time={time}
                        setTime={setTime}

                        deliveryDate={
                            deliveryDate
                        }
                        setDeliveryDate={
                            setDeliveryDate
                        }

                        showDatePicker={
                            showDatePicker
                        }
                        setShowDatePicker={
                            setShowDatePicker
                        }

                        showTimePicker={
                            showTimePicker
                        }
                        setShowTimePicker={
                            setShowTimePicker
                        }

                        showDeliveryPicker={
                            showDeliveryPicker
                        }
                        setShowDeliveryPicker={
                            setShowDeliveryPicker
                        }

                        shadeOpen={
                            shadeOpen
                        }
                        setShadeOpen={
                            setShadeOpen
                        }

                        implantOpen={
                            implantOpen
                        }
                        setImplantOpen={
                            setImplantOpen
                        }

                        surfaceTexture={
                            surfaceTexture
                        }
                        toggleSurfaceTexture={
                            toggleSurfaceTexture
                        }

                        glazedPolish={
                            glazedPolish
                        }
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

                        materialTypes={
                            materialTypes
                        }
                        toggleMaterialType={
                            toggleMaterialType
                        }

                        crownBridgeTypes={
                            crownBridgeTypes
                        }
                        toggleCrownBridgeType={
                            toggleCrownBridgeType
                        }

                        caseStages={
                            caseStages
                        }
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

                        designPreview={
                            designPreview
                        }
                        setDesignPreview={
                            setDesignPreview
                        }

                        implantTable={
                            implantTable
                        }
                        updateImplantCell={
                            updateImplantCell
                        }

                        caseDocument={
                            caseDocument
                        }
                        setCaseDocument={
                            setCaseDocument
                        }

                        selectCaseDocument={
                            selectCaseDocument
                        }

                        step1Error={
                            step1Error
                        }

                        onNext={
                            goToStep2
                        }

                        onBack={() =>
                            router.replace(
                                "/(tabs)"
                            )
                        }
                    />
                )}

                {currentStep === 2 && (
                    <Step2DigitalFiles
                        uploadedFiles={
                            uploadedFiles
                        }

                        setUploadedFiles={
                            setUploadedFiles
                        }

                        step2Error={
                            step2Error
                        }

                        setStep2Error={
                            setStep2Error
                        }

                        selectTestFile={
                            selectTestFile
                        }

                        onBack={() =>
                            setCurrentStep(1)
                        }

                        onNext={
                            goToStep3
                        }
                    />
                )}

                {currentStep === 3 && (
                    <Step3Review
                        patientName={
                            patientName
                        }
                        patientId={
                            patientId
                        }
                        age={age}
                        gender={gender}

                        date={date}
                        time={time}
                        deliveryDate={
                            deliveryDate
                        }

                        caseStages={
                            caseStages
                        }

                        surfaceTexture={
                            surfaceTexture
                        }
                        glazedPolish={
                            glazedPolish
                        }
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

                        shadeOpen={
                            shadeOpen
                        }
                        setShadeOpen={
                            setShadeOpen
                        }

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

                        confirmGdpr={
                            confirmGdpr
                        }
                        setConfirmGdpr={
                            setConfirmGdpr
                        }

                        confirmCaseInstructions={
                            confirmCaseInstructions
                        }
                        setConfirmCaseInstructions={
                            setConfirmCaseInstructions
                        }

                        gdprError={
                            gdprError
                        }
                        setGdprError={
                            setGdprError
                        }

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

                        submitting={
                            false
                        }

                        caseSubmitted={
                            caseSubmitted
                        }

                        onBack={() =>
                            setCurrentStep(2)
                        }

                        onSubmit={
                            submitCase
                        }

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











