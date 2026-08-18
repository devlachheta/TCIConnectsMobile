import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import {
    useEffect,
    useState,
} from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../components/doctordashboard/DashboardHeader";
import {
    submitCase as submitCaseApi,
    uploadCaseFile,
} from "../services/caseService";
import api from "../services/api";


export default function EditCases() {
    const router = useRouter();

    const { caseId } = useLocalSearchParams<{
        caseId: string;
    }>();
    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [age, setAge] = useState("");

    const [shadeInstructions, setShadeInstructions] = useState("");
    const [implantInstructions, setImplantInstructions] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);

    const [shadeOpen, setShadeOpen] = useState(false);
    const [implantOpen, setImplantOpen] = useState(false);
    const [reviewImplantOpen, setReviewImplantOpen] = useState(true);
    const [caseDetailsOpen, setCaseDetailsOpen] = useState(true);
    const [caseDocumentOpen, setCaseDocumentOpen] = useState(true);
    const [digitalFilesOpen, setDigitalFilesOpen] = useState(true);
    const [additionalInfoOpen, setAdditionalInfoOpen] = useState(true);

    const [gender, setGender] = useState("");

    const [surfaceTexture, setSurfaceTexture] = useState<string[]>([]);
    const [glazedPolish, setGlazedPolish] = useState<string[]>([]);
    const [incisalTranslucency, setIncisalTranslucency] = useState<string[]>([]);
    const [preparedToothShade, setPreparedToothShade] = useState<string[]>([]);

    const [materialTypes, setMaterialTypes] = useState<string[]>([]);
    const [crownBridgeTypes, setCrownBridgeTypes] = useState<string[]>([]);

    const [caseStages, setCaseStages] = useState<string[]>([]);

    const [additionalRestorations, setAdditionalRestorations] =
        useState<string[]>([]);

    const [designPreview, setDesignPreview] = useState(false);

    const [implantTable, setImplantTable] = useState<string[][]>(
        Array.from({ length: 3 }, () => Array(8).fill(""))
    );

    const [currentStep, setCurrentStep] = useState(1);

    const [uploadedFiles, setUploadedFiles] = useState<
        DocumentPicker.DocumentPickerAsset[]
    >([]);
    const [caseDocument, setCaseDocument] =
        useState<DocumentPicker.DocumentPickerAsset | null>(null);

    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [caseSubmitted, setCaseSubmitted] = useState(false);

    const [step1Error, setStep1Error] = useState("");
    const [step2Error, setStep2Error] = useState("");
    const [gdprError, setGdprError] = useState("");
    const [agreementError, setAgreementError] = useState("");
    const [consentError, setConsentError] = useState("");

    const [confirmDigitalMedical, setConfirmDigitalMedical] =
        useState(false);

    const [confirmGdpr, setConfirmGdpr] = useState(false);

    const [confirmCaseInstructions, setConfirmCaseInstructions] =
        useState(false);


    const parseLocalDate = (
        value: string | null | undefined
    ): Date | null => {
        if (!value) {
            return null;
        }

        const datePart = value.split("T")[0];

        const [year, month, day] =
            datePart.split("-").map(Number);

        if (!year || !month || !day) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day
        );
    };

    const parseTime = (
        value: string | null | undefined
    ): Date | null => {
        if (!value) {
            return null;
        }

        const [hours, minutes] =
            value.split(":").map(Number);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes)
        ) {
            return null;
        }

        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date;
    };

    const fetchCase = async () => {
        if (!caseId) {
            console.log("No caseId found");
            return;
        }

        try {
            setLoading(true);

            const response = await api.get(
                `/cases/${caseId}`
            );

            const data = response.data;

            console.log(
                "Edit Case Data:",
                data
            );

            // =========================
            // BASIC INFORMATION
            // =========================

            setPatientName(
                data.patient_name || ""
            );

            // patient_id intentionally NOT changed

            setAge(
                data.age !== null &&
                    data.age !== undefined
                    ? String(data.age)
                    : ""
            );

            setGender(
                data.gender || ""
            );

            // =========================
            // DATE / TIME
            // =========================

            setDate(
                parseLocalDate(
                    data.appointment_date
                )
            );

            setTime(
                parseTime(
                    data.appointment_time
                )
            );

            setDeliveryDate(
                parseLocalDate(
                    data.delivery_deadline
                )
            );

            // =========================
            // CASE DETAILS
            // =========================

            const details =
                data.details || {};

            setCaseStages(
                details.case_stage || []
            );

            setSurfaceTexture(
                details.surface_texture || []
            );

            setGlazedPolish(
                details.glazed_polish || []
            );

            setIncisalTranslucency(
                details.incisal_translucency || []
            );

            setPreparedToothShade(
                details.prepared_tooth_shade || []
            );

            setShadeInstructions(
                details.shade_guide_color || ""
            );

            setMaterialTypes(
                details.material_type || []
            );

            setCrownBridgeTypes(
                details.crown_bridge || []
            );

            setAdditionalRestorations(
                details.additional_restorations || []
            );

            setImplantInstructions(
                details.additional_instructions || ""
            );

            // =========================
            // DESIGN PREVIEW
            // =========================

            setDesignPreview(
                details.design_preview || false
            );

            // =========================
            // IMPLANT DETAILS
            // =========================

            const implants =
                details.implant_details || [];

            const updatedImplantTable =
                Array.from(
                    { length: 3 },
                    (_, rowIndex) => {

                        const implant =
                            implants[rowIndex];

                        if (!implant) {
                            return Array(8).fill("");
                        }

                        return [
                            implant.implant_type || "",
                            implant.platform_diameter || "",
                            implant.screw_retained || "",
                            implant.screw_retained_hybrid || "",
                            implant.cement_retained_ti_abutment || "",
                            implant.zr_abutment || "",
                            implant.implant_bar_type || "",
                            implant.attachment_type || "",
                        ];
                    }
                );

            setImplantTable(
                updatedImplantTable
            );

            // =========================
            // EXISTING FILES
            // =========================

            setExistingFiles(
                data.files || []
            );

        } catch (error: any) {

            console.log(
                "Error fetching edit case:",
                error?.response?.data || error
            );

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCase();
    }, [caseId]);

    const toggleSurfaceTexture = (value: string) => {
        setSurfaceTexture((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleGlazedPolish = (value: string) => {
        setGlazedPolish((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleIncisalTranslucency = (value: string) => {
        setIncisalTranslucency((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const togglePreparedToothShade = (value: string) => {
        setPreparedToothShade((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleMaterialType = (value: string) => {
        setMaterialTypes((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleCrownBridgeType = (value: string) => {
        setCrownBridgeTypes((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleCaseStage = (value: string) => {
        setCaseStages((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const toggleAdditionalRestoration = (value: string) => {
        setAdditionalRestorations((previous) =>
            previous.includes(value)
                ? previous.filter((item) => item !== value)
                : [...previous, value]
        );
    };

    const updateImplantCell = (
        rowIndex: number,
        columnIndex: number,
        value: string
    ) => {
        setImplantTable((previous) => {
            const updated = previous.map((row) => [...row]);

            updated[rowIndex][columnIndex] = value;

            return updated;
        });
    };

    const displayValue = (value: string | undefined) => {
        return value && value.trim() !== "" ? value : "Not provided";
    };

    const displayMultiple = (values: string[]) => {
        return values.length > 0 ? values.join(", ") : "Not Selected";
    };
    const formatDate = (value: Date | null) => {
        if (!value) return " Not provided";

        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        const year = value.getFullYear();

        return `${month}/${day}/${year}`;
    };
    const hasImplantData = (row: string[]) => {
        return row.some((value) => value.trim() !== "");
    };
    const formatTime = (value: Date | null) => {
        if (!value) return "00:00";

        const hours = String(value.getHours()).padStart(2, "0");
        const minutes = String(value.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    };
    const goToStep2 = () => {
        if (patientName.trim() === "") {
            setStep1Error("Patient Name is required.");
            return;
        }

        setStep1Error("");
        setCurrentStep(2);
    };

    const goToStep3 = () => {
        if (uploadedFiles.length === 0) {
            setStep2Error("Please upload at least one file.");
            return;
        }

        if (uploadedFiles.length > 5) {
            setStep2Error("You can upload a maximum of 5 files.");
            return;
        }

        setStep2Error("");
        setCurrentStep(3);
    };

    const selectTestFile = async () => {
        if (uploadedFiles.length >= 5) {
            setStep2Error("You can upload a maximum of 5 files.");
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
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

            const remainingSlots = 5 - uploadedFiles.length;
            const selectedFiles = result.assets.slice(0, remainingSlots);

            setUploadedFiles((previous) => [
                ...previous,
                ...selectedFiles,
            ]);

            if (result.assets.length > remainingSlots) {
                setStep2Error("You can upload a maximum of 5 files.");
            } else {
                setStep2Error("");
            }
        } catch (error) {
            console.log("FILE PICKER ERROR:", error);
            setStep2Error("Unable to select files.");
        }
    };
    const selectCaseDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                multiple: false,
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            setCaseDocument(result.assets[0]);
        } catch (error) {
            console.log("CASE DOCUMENT PICKER ERROR:", error);
        }
    };
    const getDoctorId = async () => {
        const userData = await AsyncStorage.getItem("user");

        if (!userData) {
            throw new Error("Doctor information not found.");
        }

        const user = JSON.parse(userData);

        return user.id;
    };

    const submitCase = async () => {
        setGdprError("");
        setAgreementError("");
        setConsentError("");

        let hasError = false;

        if (!confirmDigitalMedical) {
            setGdprError("You must confirm GDPR compliance.");
            hasError = true;
        }

        if (!confirmGdpr) {
            setAgreementError(
                "You must confirm Data Processing & Confidentiality Agreement."
            );
            hasError = true;
        }

        if (!confirmCaseInstructions) {
            setConsentError("Patient consent is required.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            const doctorId = await getDoctorId();

            const implantDetails = implantTable.map((row) => ({
                implant_type: row[0],
                platform_diameter: row[1],
                screw_retained: row[2],
                screw_retained_hybrid: row[3],
                cement_retained_ti_abutment: row[4],
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
                    ? deliveryDate.toISOString().split("T")[0]
                    : null,

                preview_status: "-",
                status: "Submitted",

                details: {
                    case_stage: caseStages,
                    surface_texture: surfaceTexture,
                    glazed_polish: glazedPolish,
                    incisal_translucency: incisalTranslucency,
                    prepared_tooth_shade: preparedToothShade,
                    shade_guide_color: shadeInstructions,
                    material_type: materialTypes,
                    crown_bridge: crownBridgeTypes,
                    additional_restorations: additionalRestorations,
                    implant_details: implantDetails,
                    design_preview: designPreview,
                    additional_instructions: implantInstructions,
                },

                files: [],
            };

            console.log("CASE PAYLOAD:", payload);

            const response = await submitCaseApi(payload);

            console.log("CASE RESPONSE:", response);

            const caseId = response.id;

            for (const file of uploadedFiles) {
                const fileResponse = await uploadCaseFile(
                    caseId,
                    file,
                    "digital_file"
                );

                console.log("FILE UPLOAD RESPONSE:", fileResponse);
            }

            setCaseSubmitted(true);
        } catch (error: any) {
            console.log(
                "CASE SUBMISSION ERROR:",
                error.response?.data
            );
        }
    };
    if (caseSubmitted) {
        return (
            <SafeAreaView style={styles.container}>
                <DashboardHeader />
                <View style={styles.successContent}>

                    <View style={styles.successIconContainer}>

                        <View style={styles.successDocument}>
                            <View style={styles.documentLine} />
                            <View style={styles.documentLine} />
                            <View style={styles.documentLine} />
                        </View>

                        <View style={styles.successCheckCircle}>
                            <Ionicons
                                name="checkmark"
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>

                    </View>

                    <Text style={styles.successTitle}>
                        Case Submitted Successfully!
                    </Text>

                    <Text style={styles.successMessage}>
                        Thank you. We'll review and contact{"\n"}
                        you soon.
                    </Text>

                    <TouchableOpacity
                        style={styles.submitAnotherButton}
                        onPress={() => {
                            setCaseSubmitted(false);
                            setCurrentStep(1);
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitAnotherText}>
                            Submit Another Case
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        );
    }
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#0152A8"
                    />

                    <Text style={styles.loadingText}>
                        Loading case...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {currentStep === 1 && (
                    <>
                        {/* HEADER */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => router.replace("/(tabs)")}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#021E48"
                                />
                            </TouchableOpacity>

                            <Text style={styles.heading}>
                                Submit a Case
                            </Text>

                            <Text style={styles.stepText}>
                                1 of 3
                            </Text>
                        </View>

                        {/* PROGRESS */}
                        <View style={styles.progressContainer}>

                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressLine,
                                    styles.activeLine,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.inactiveCircle,
                                ]}
                            />

                            <View style={styles.progressLine} />

                            <View style={styles.inactiveCircle} />

                        </View>


                        {/* PURCHASE ORDER */}
                        <View style={styles.card}>

                            <View style={styles.cardHeader}>

                                <View style={styles.cardTitleContainer}>

                                    <Ionicons
                                        name="document-text-outline"
                                        size={22}
                                        color="#0152A8"
                                    />

                                    <Text style={styles.cardTitle}>
                                        Purchase Order
                                    </Text>

                                </View>

                                <Ionicons
                                    name="chevron-up"
                                    size={22}
                                    color="#0152A8"
                                />

                            </View>


                            {/* PATIENT NAME */}
                            <Text style={styles.label}>
                                Patient Name
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter patient name"
                                value={patientName}
                                onChangeText={(text) => {
                                    setPatientName(text);
                                    setStep1Error("");
                                }}
                            />
                            {step1Error !== "" && (
                                <Text style={styles.errorText}>
                                    {step1Error}
                                </Text>
                            )}


                            {/* PATIENT ID */}
                            <Text style={styles.label}>
                                Patient ID
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter patient ID"
                                value={patientId}
                                onChangeText={setPatientId}
                            />


                            {/* DATE + TIME */}
                            <View style={styles.row}>

                                <View style={styles.halfInput}>

                                    <Text style={styles.label}>
                                        Next Appt Date
                                    </Text>

                                    <Pressable
                                        style={styles.input}
                                        onPress={() =>
                                            setShowDatePicker(true)
                                        }
                                    >
                                        <Text style={styles.placeholder}>
                                            {formatDate(date)}
                                        </Text>
                                    </Pressable>

                                </View>


                                <View style={styles.halfInput}>

                                    <Text style={styles.label}>
                                        Time
                                    </Text>

                                    <Pressable
                                        style={styles.input}
                                        onPress={() =>
                                            setShowTimePicker(true)
                                        }
                                    >
                                        <Text style={styles.placeholder}>
                                            {formatTime(time)}
                                        </Text>
                                    </Pressable>

                                </View>

                            </View>



                            <Text style={styles.label}>
                                Delivery Deadline
                            </Text>

                            <Pressable
                                style={styles.input}
                                onPress={() =>
                                    setShowDeliveryPicker(true)
                                }
                            >
                                <Text style={styles.placeholder}>
                                    {formatDate(deliveryDate)}
                                </Text>
                            </Pressable>


                            {/* AGE + GENDER */}
                            <View style={styles.row}>

                                {/* AGE */}
                                <View style={styles.ageContainer}>

                                    <Text style={styles.label}>
                                        Age
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholder="Years"
                                        keyboardType="numeric"
                                        value={age}
                                        onChangeText={setAge}
                                    />

                                </View>


                                {/* GENDER */}
                                <View style={styles.genderSection}>

                                    <Text style={styles.label}>
                                        Gender
                                    </Text>

                                    <View style={styles.genderRow}>

                                        {/* MALE */}
                                        <TouchableOpacity
                                            style={styles.genderOption}
                                            onPress={() =>
                                                setGender("Male")
                                            }
                                            activeOpacity={0.7}
                                        >

                                            <Ionicons
                                                name={
                                                    gender === "Male"
                                                        ? "radio-button-on"
                                                        : "radio-button-off"
                                                }
                                                size={21}
                                                color={
                                                    gender === "Male"
                                                        ? "#1677FF"
                                                        : "#C5CCD8"
                                                }
                                            />

                                            <Text style={styles.genderLabel}>
                                                Male
                                            </Text>

                                        </TouchableOpacity>


                                        {/* FEMALE */}
                                        <TouchableOpacity
                                            style={styles.genderOption}
                                            onPress={() =>
                                                setGender("Female")
                                            }
                                            activeOpacity={0.7}
                                        >

                                            <Ionicons
                                                name={
                                                    gender === "Female"
                                                        ? "radio-button-on"
                                                        : "radio-button-off"
                                                }
                                                size={21}
                                                color={
                                                    gender === "Female"
                                                        ? "#1677FF"
                                                        : "#C5CCD8"
                                                }
                                            />

                                            <Text style={styles.genderLabel}>
                                                Female
                                            </Text>

                                        </TouchableOpacity>

                                    </View>

                                </View>

                            </View>


                            <Text style={styles.label}>
                                Case Stage
                            </Text>

                            {[
                                "Try-In Framework",
                                "Try-In Ceramics",
                                "Finish",
                            ].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.caseOption}
                                    onPress={() => toggleCaseStage(item)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            caseStages.includes(item)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color={
                                            caseStages.includes(item)
                                                ? "#1677FF"
                                                : "#C5CCD8"
                                        }
                                    />

                                    <Text style={styles.caseText}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}


                        </View>


                        {/* DATE PICKER */}
                        {showDatePicker && (
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {

                                    setShowDatePicker(false);

                                    if (selectedDate) {
                                        setDate(selectedDate);
                                    }

                                }}
                            />
                        )}


                        {/* TIME PICKER */}
                        {showTimePicker && (
                            <DateTimePicker
                                value={time || new Date()}
                                mode="time"
                                display="default"
                                onChange={(event, selectedTime) => {

                                    setShowTimePicker(false);

                                    if (selectedTime) {
                                        setTime(selectedTime);
                                    }

                                }}
                            />
                        )}


                        {/* DELIVERY DATE PICKER */}
                        {showDeliveryPicker && (
                            <DateTimePicker
                                value={deliveryDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {

                                    setShowDeliveryPicker(false);

                                    if (selectedDate) {
                                        setDeliveryDate(selectedDate);
                                    }

                                }}
                            />
                        )}


                        {/* BOTTOM SECTION */}
                        <View style={styles.bottomSection}>



                            <TouchableOpacity
                                style={styles.accordionCard}
                                onPress={() =>
                                    setShadeOpen(!shadeOpen)
                                }
                                activeOpacity={0.8}
                            >

                                <View style={styles.accordionLeft}>

                                    <Ionicons
                                        name="color-palette-outline"
                                        size={24}
                                        color="#1F2937"
                                    />

                                    <Text style={styles.accordionTitle}>
                                        Shade Instructions
                                    </Text>

                                </View>

                                <Ionicons
                                    name={
                                        shadeOpen
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={22}
                                    color="#1F2937"
                                />

                            </TouchableOpacity>


                            {/* ============================= */}
                            {/* SHADE CONTENT */}
                            {/* ============================= */}

                            {shadeOpen && (

                                <View style={styles.shadeContainer}>

                                    {/* SURFACE TEXTURE + GLAZED POLISH */}

                                    <View style={styles.shadeRow}>

                                        {/* SURFACE TEXTURE */}

                                        <View style={styles.shadeColumn}>

                                            <Text style={styles.shadeLabel}>
                                                Surface Texture
                                            </Text>

                                            <View style={styles.optionWrap}>

                                                {/* SMOOTH */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleSurfaceTexture(
                                                            "Smooth"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            surfaceTexture.includes(
                                                                "Smooth"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            surfaceTexture.includes(
                                                                "Smooth"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Smooth
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* MODERATE */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleSurfaceTexture(
                                                            "Moderate"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            surfaceTexture.includes(
                                                                "Moderate"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            surfaceTexture.includes(
                                                                "Moderate"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Moderate
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* HEAVY */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleSurfaceTexture(
                                                            "Heavy"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            surfaceTexture.includes(
                                                                "Heavy"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            surfaceTexture.includes(
                                                                "Heavy"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Heavy
                                                    </Text>

                                                </TouchableOpacity>

                                            </View>

                                        </View>


                                        {/* GLAZED POLISH */}

                                        <View style={styles.shadeColumn}>

                                            <Text style={styles.shadeLabel}>
                                                Glazed Polish
                                            </Text>

                                            <View style={styles.optionWrap}>

                                                {/* HIGH */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleGlazedPolish(
                                                            "High"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            glazedPolish.includes(
                                                                "High"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            glazedPolish.includes(
                                                                "High"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        High
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* MODERATE */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleGlazedPolish(
                                                            "Moderate"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            glazedPolish.includes(
                                                                "Moderate"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            glazedPolish.includes(
                                                                "Moderate"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Moderate
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* LIGHT */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleGlazedPolish(
                                                            "Light"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            glazedPolish.includes(
                                                                "Light"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            glazedPolish.includes(
                                                                "Light"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Light
                                                    </Text>

                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                    </View>


                                    {/* ============================= */}
                                    {/* INCISAL + PREPARED TOOTH */}
                                    {/* ============================= */}

                                    <View
                                        style={[
                                            styles.shadeRow,
                                            styles.shadeRowSpacing,
                                        ]}
                                    >

                                        {/* INCISAL TRANSLUCENCY */}

                                        <View style={styles.shadeColumn}>

                                            <Text style={styles.shadeLabel}>
                                                Incisal Translucency
                                            </Text>

                                            <View style={styles.optionWrap}>

                                                {/* NONE */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleIncisalTranslucency(
                                                            "None"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            incisalTranslucency.includes(
                                                                "None"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            incisalTranslucency.includes(
                                                                "None"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        None
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* 0.5MM */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleIncisalTranslucency(
                                                            "0.5mm"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            incisalTranslucency.includes(
                                                                "0.5mm"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            incisalTranslucency.includes(
                                                                "0.5mm"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        0.5mm
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* 1MM */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleIncisalTranslucency(
                                                            "1mm"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            incisalTranslucency.includes(
                                                                "1mm"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            incisalTranslucency.includes(
                                                                "1mm"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        1mm
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* MAXIMUM 1.5MM */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        toggleIncisalTranslucency(
                                                            "Maximum 1.5mm"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            incisalTranslucency.includes(
                                                                "Maximum 1.5mm"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            incisalTranslucency.includes(
                                                                "Maximum 1.5mm"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Maximum 1.5mm
                                                    </Text>

                                                </TouchableOpacity>

                                            </View>

                                        </View>


                                        {/* PREPARED TOOTH SHADE */}

                                        <View style={styles.shadeColumn}>

                                            <Text style={styles.shadeLabel}>
                                                Prepared Tooth Shade
                                            </Text>

                                            <View style={styles.optionWrap}>

                                                {/* GREY DISCOLORED */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        togglePreparedToothShade(
                                                            "Grey Discolored"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            preparedToothShade.includes(
                                                                "Grey Discolored"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            preparedToothShade.includes(
                                                                "Grey Discolored"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Grey Discolored
                                                    </Text>

                                                </TouchableOpacity>


                                                {/* NATURAL */}
                                                <TouchableOpacity
                                                    style={styles.shadeOption}
                                                    onPress={() =>
                                                        togglePreparedToothShade(
                                                            "Natural"
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            preparedToothShade.includes(
                                                                "Natural"
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            preparedToothShade.includes(
                                                                "Natural"
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        Natural
                                                    </Text>

                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                    </View>


                                    {/* ============================= */}
                                    {/* SHADE GUIDE COLOR */}
                                    {/* ============================= */}

                                    <View style={styles.shadeFullSection}>

                                        <Text style={styles.shadeLabel}>
                                            Shade Guide Color
                                        </Text>

                                        <TextInput
                                            style={styles.shadeInput}
                                            placeholder="Enter shade guide color"
                                            value={shadeInstructions}
                                            onChangeText={
                                                setShadeInstructions
                                            }
                                        />

                                    </View>


                                    {/* ============================= */}
                                    {/* MATERIAL TYPE */}
                                    {/* ============================= */}

                                    <View
                                        style={[
                                            styles.shadeFullSection,
                                            styles.sectionSpacing,
                                        ]}
                                    >

                                        <Text style={styles.shadeLabel}>
                                            Material Type
                                        </Text>

                                        <View style={styles.materialGrid}>

                                            {/* TITAN */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "TITAN"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "TITAN"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "TITAN"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    TITAN
                                                </Text>

                                            </TouchableOpacity>


                                            {/* NICKEL-CHROME */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "Nickel-Chrome"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "Nickel-Chrome"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "Nickel-Chrome"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    Nickel-Chrome
                                                </Text>

                                            </TouchableOpacity>


                                            {/* ZIRCONIA */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "Zirconia"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "Zirconia"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "Zirconia"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    Zirconia
                                                </Text>

                                            </TouchableOpacity>


                                            {/* PMMA */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "PMMA"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "PMMA"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "PMMA"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    PMMA
                                                </Text>

                                            </TouchableOpacity>


                                            {/* MULTILAYER ZIRCONIA */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "Multilayer Zirconia Katana"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "Multilayer Zirconia Katana"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "Multilayer Zirconia Katana"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    Multilayer Zirconia Katana
                                                </Text>

                                            </TouchableOpacity>


                                            {/* CHROME-COBALT */}
                                            <TouchableOpacity
                                                style={styles.materialOption}
                                                onPress={() =>
                                                    toggleMaterialType(
                                                        "Chrome-Cobalt Kera CAD/CAM"
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        materialTypes.includes(
                                                            "Chrome-Cobalt Kera CAD/CAM"
                                                        )
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        materialTypes.includes(
                                                            "Chrome-Cobalt Kera CAD/CAM"
                                                        )
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.shadeOptionText
                                                    }
                                                >
                                                    Chrome-Cobalt Kera CAD/CAM
                                                </Text>

                                            </TouchableOpacity>

                                        </View>

                                    </View>


                                    {/* ============================= */}
                                    {/* CROWN & BRIDGE */}
                                    {/* ============================= */}

                                    <View
                                        style={[
                                            styles.shadeFullSection,
                                            styles.sectionSpacing,
                                        ]}
                                    >

                                        <Text style={styles.shadeLabel}>
                                            Crown & Bridge Instructions
                                        </Text>

                                        <View style={styles.materialGrid}>

                                            {[
                                                "Crown",
                                                "Inlay/Onlay",
                                                "Bridge",
                                                "Post & Core",
                                                "Full Contour Crown",
                                                "Veneer",
                                            ].map((item) => (

                                                <TouchableOpacity
                                                    key={item}
                                                    style={
                                                        styles.materialOption
                                                    }
                                                    onPress={() =>
                                                        toggleCrownBridgeType(
                                                            item
                                                        )
                                                    }
                                                    activeOpacity={0.7}
                                                >

                                                    <Ionicons
                                                        name={
                                                            crownBridgeTypes.includes(
                                                                item
                                                            )
                                                                ? "checkbox"
                                                                : "square-outline"
                                                        }
                                                        size={20}
                                                        color={
                                                            crownBridgeTypes.includes(
                                                                item
                                                            )
                                                                ? "#1677FF"
                                                                : "#D1D5DB"
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.shadeOptionText
                                                        }
                                                    >
                                                        {item}
                                                    </Text>

                                                </TouchableOpacity>

                                            ))}

                                        </View>

                                    </View>

                                </View>
                            )}
                            {/* ============================= */}
                            {/* IMPLANT INSTRUCTIONS */}
                            {/* ============================= */}
                            <View style={styles.accordionCard}>

                                <View style={styles.accordionLeft}>
                                    <Ionicons
                                        name="medical-outline"
                                        size={24}
                                        color="#1F2937"
                                    />

                                    <Text style={styles.accordionTitle}>
                                        Implant Instructions
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setImplantOpen(!implantOpen)}
                                    activeOpacity={0.6}
                                    hitSlop={12}
                                    style={styles.accordionArrow}
                                >
                                    <Ionicons
                                        name={implantOpen ? "chevron-up" : "chevron-down"}
                                        size={24}
                                        color="#1F2937"
                                    />
                                </TouchableOpacity>

                            </View>
                            {implantOpen && (
                                <View style={styles.implantContainer}>

                                    <Text style={styles.implantHeading}>
                                        Implant Information
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={true}
                                    >
                                        <View style={styles.implantTable}>

                                            {/* GROUP HEADINGS */}
                                            <View style={styles.implantTopHeader}>

                                                <View
                                                    style={[
                                                        styles.implantHeaderCell,
                                                        styles.implantInfoHeader,
                                                    ]}
                                                >
                                                    <Text style={styles.implantHeaderText}>
                                                        Implant Information
                                                    </Text>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.implantHeaderCell,
                                                        styles.restorationHeader,
                                                    ]}
                                                >
                                                    <Text style={styles.implantHeaderText}>
                                                        Restoration Type / Abutment Choice
                                                    </Text>
                                                </View>

                                            </View>


                                            {/* COLUMN HEADINGS */}
                                            <View style={styles.implantColumnRow}>

                                                {[
                                                    "Implant Type",
                                                    "Platform Diameter",
                                                    "Screw Retained",
                                                    "Screw Retained Hybrid",
                                                    "Cement Retained - Ti Abutment",
                                                    "Zr Abutment",
                                                    "Implant Bar Type",
                                                    "Attachment Type",
                                                ].map((item) => (
                                                    <View
                                                        key={item}
                                                        style={styles.implantHeaderCellSmall}
                                                    >
                                                        <Text style={styles.implantHeaderText}>
                                                            {item}
                                                        </Text>
                                                    </View>
                                                ))}

                                            </View>


                                            {/* INPUT ROWS */}
                                            {implantTable.map((row, rowIndex) => (
                                                <View
                                                    key={rowIndex}
                                                    style={styles.implantDataRow}
                                                >
                                                    {row.map((value, columnIndex) => (
                                                        <TextInput
                                                            key={columnIndex}
                                                            style={styles.implantInput}
                                                            value={value}
                                                            onChangeText={(text) =>
                                                                updateImplantCell(
                                                                    rowIndex,
                                                                    columnIndex,
                                                                    text
                                                                )
                                                            }
                                                        />
                                                    ))}
                                                </View>
                                            ))}

                                        </View>
                                    </ScrollView>


                                    {/* ============================= */}
                                    {/* ADDITIONAL RESTORATIONS */}
                                    {/* ============================= */}

                                    <Text style={styles.implantSectionTitle}>
                                        Additional Restorations
                                    </Text>

                                    <View style={styles.implantOptionsRow}>
                                        {[
                                            "Bleaching Tray",
                                            "P.E.I",
                                            "Transparent Night Guard Soft / Hard Dual",
                                            "Full Arch Printed Master Model",
                                        ].map((item) => (

                                            <TouchableOpacity
                                                key={item}
                                                style={styles.implantOption}
                                                onPress={() => toggleAdditionalRestoration(item)}
                                                activeOpacity={0.7}
                                            >

                                                <Ionicons
                                                    name={
                                                        additionalRestorations.includes(item)
                                                            ? "checkbox"
                                                            : "square-outline"
                                                    }
                                                    size={20}
                                                    color={
                                                        additionalRestorations.includes(item)
                                                            ? "#1677FF"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text style={styles.implantOptionText}>
                                                    {item}
                                                </Text>

                                            </TouchableOpacity>

                                        ))}


                                    </View>


                                    {/* ============================= */}
                                    {/* DESIGN PREVIEW */}
                                    {/* ============================= */}

                                    <Text
                                        style={[
                                            styles.implantSectionTitle,
                                            styles.implantSpacing,
                                        ]}
                                    >
                                        Design Preview
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.implantOption}
                                        onPress={() => setDesignPreview(!designPreview)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={
                                                designPreview
                                                    ? "checkbox"
                                                    : "square-outline"
                                            }
                                            size={20}
                                            color={
                                                designPreview
                                                    ? "#1677FF"
                                                    : "#D1D5DB"
                                            }
                                        />

                                        <Text style={styles.implantOptionText}>
                                            Request a Design Preview Before Production
                                        </Text>
                                    </TouchableOpacity>



                                    <Text
                                        style={[
                                            styles.implantSectionTitle,
                                            styles.implantSpacing,
                                        ]}
                                    >
                                        Additional Instructions
                                    </Text>

                                    <TextInput
                                        style={styles.additionalInstructionsInput}
                                        multiline
                                        textAlignVertical="top"
                                        value={implantInstructions}
                                        onChangeText={setImplantInstructions}
                                        placeholder="Enter additional instructions"
                                    />



                                    <Text
                                        style={[
                                            styles.implantSectionTitle,
                                            styles.implantSpacing,
                                        ]}
                                    >
                                        Case Document
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.fileInput}
                                        activeOpacity={0.7}
                                        onPress={selectCaseDocument}
                                    >
                                        <View style={styles.chooseFileButton}>
                                            <Text style={styles.chooseFileText}>
                                                Choose File
                                            </Text>
                                        </View>

                                        <Text
                                            style={styles.noFileText}
                                            numberOfLines={1}
                                        >
                                            {caseDocument?.name || "No file chosen"}
                                        </Text>
                                    </TouchableOpacity>

                                    {caseDocument && (
                                        <View style={styles.selectedFileRow}>

                                            <Text
                                                style={styles.selectedFileName}
                                                numberOfLines={1}
                                            >
                                                {caseDocument.name}
                                            </Text>

                                            <TouchableOpacity
                                                style={styles.removeFileButton}
                                                onPress={() => setCaseDocument(null)}
                                            >
                                                <Text style={styles.removeFileText}>
                                                    Remove
                                                </Text>
                                            </TouchableOpacity>

                                        </View>
                                    )}
                                </View>
                            )}



                            {/* BUTTONS */}

                            <View style={styles.buttonRow}>

                                <TouchableOpacity
                                    style={styles.backButton}
                                >
                                    <Text style={styles.backText}>
                                        Back
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={goToStep2}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.nextText}>
                                        Next
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </>)}
                {currentStep === 2 && (
                    <>


                        {/* ============================== */}
                        {/* STEP 2 HEADER */}
                        {/* ============================== */}

                        <View style={styles.header}>

                            <TouchableOpacity
                                onPress={() => setCurrentStep(1)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#021E48"
                                />
                            </TouchableOpacity>


                            <Text style={styles.heading}>
                                Submit a Case
                            </Text>


                            <Text style={styles.stepText}>
                                2 of 3
                            </Text>

                        </View>


                        {/* ============================== */}
                        {/* STEP 2 PROGRESS */}
                        {/* ============================== */}

                        <View style={styles.progressContainer}>

                            {/* STEP 1 */}
                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />


                            {/* LINE */}
                            <View
                                style={[
                                    styles.progressLine,
                                    styles.activeLine,
                                ]}
                            />


                            {/* STEP 2 */}
                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />


                            {/* LINE */}
                            <View style={styles.progressLine} />


                            {/* STEP 3 */}
                            <View style={styles.inactiveCircle} />

                        </View>


                        {/* ============================== */}
                        {/* UPLOAD CARD */}
                        {/* ============================== */}

                        <View style={styles.uploadCard}>

                            {/* TITLE */}

                            <View style={styles.uploadTitleRow}>

                                <Text style={styles.uploadTitle}>
                                    2. Upload Digital Files (Max 5)
                                </Text>

                                <Text style={styles.requiredStar}>
                                    *
                                </Text>

                            </View>


                            {/* ACCEPTED FORMATS */}

                            <Text style={styles.acceptedFormats}>
                                Accepted formats: STL, OBJ, ZIP, JPG, JPEG, PNG
                            </Text>


                            {/* ============================== */}
                            {/* CHOOSE FILE BUTTON */}
                            {/* ============================== */}

                            <TouchableOpacity
                                style={styles.chooseFilesRow}
                                activeOpacity={0.7}
                                onPress={selectTestFile}
                            >

                                <View style={styles.chooseFilesButton}>

                                    <Text style={styles.chooseFilesText}>
                                        Choose Files
                                    </Text>

                                </View>


                                <Text style={styles.noFileChosenText}>
                                    {uploadedFiles.length > 0
                                        ? `${uploadedFiles.length} file${uploadedFiles.length > 1
                                            ? "s"
                                            : ""
                                        } selected`
                                        : "No file chosen"}
                                </Text>

                            </TouchableOpacity>
                            {uploadedFiles.map((file, index) => (
                                <View
                                    key={`${file}-${index}`}
                                    style={styles.selectedFileRow}
                                >

                                    <Text
                                        style={styles.selectedFileName}
                                        numberOfLines={1}
                                    >
                                        {file.name}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.removeFileButton}
                                        onPress={() => {
                                            setUploadedFiles((previous) =>
                                                previous.filter(
                                                    (_, fileIndex) => fileIndex !== index
                                                )
                                            );
                                        }}
                                    >
                                        <Text style={styles.removeFileText}>
                                            Remove
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            ))}
                            {step2Error !== "" && (
                                <Text style={styles.errorText}>
                                    {step2Error}
                                </Text>
                            )}

                            {/* ============================== */}
                            {/* UPLOAD / DRAG AREA */}
                            {/* ============================== */}

                            <TouchableOpacity
                                style={styles.uploadDropArea}
                                activeOpacity={0.7}
                                onPress={selectTestFile}
                            >

                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={34}
                                    color="#7B8494"
                                />


                                <Text style={styles.dropTitle}>
                                    Drag and drop files here
                                </Text>


                                <Text style={styles.dropSubtitle}>
                                    or tap to browse
                                </Text>

                            </TouchableOpacity>



                            {/* ============================== */}
                            {/* BUTTONS */}
                            {/* ============================== */}

                            <View style={styles.stepButtonRow}>

                                <TouchableOpacity
                                    style={styles.stepBackButton}
                                    onPress={() => setCurrentStep(1)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.stepBackText}>
                                        Back
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={styles.stepNextButton}
                                    onPress={goToStep3}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.stepNextText}>
                                        Next
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </>
                )}




                {currentStep === 3 && (
                    <>
                        <View style={styles.header}>

                            <TouchableOpacity
                                onPress={() => setCurrentStep(2)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#021E48"
                                />
                            </TouchableOpacity>

                            <Text style={styles.heading}>
                                Submit a Case
                            </Text>

                            <Text style={styles.stepText}>
                                3 of 3
                            </Text>

                        </View>


                        <View style={styles.progressContainer}>

                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressLine,
                                    styles.activeLine,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressLine,
                                    styles.activeLine,
                                ]}
                            />

                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.activeCircle,
                                ]}
                            />

                        </View>


                        <View style={styles.reviewContainer}>

                            <Text style={styles.reviewTitle}>
                                3. Review & Confirm
                            </Text>


                            <View style={styles.reviewCard}>

                                <TouchableOpacity
                                    style={styles.reviewCardHeader}
                                    onPress={() => setCaseDetailsOpen(!caseDetailsOpen)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.reviewCardTitle}>
                                        Case Details
                                    </Text>

                                    <Ionicons
                                        name={
                                            caseDetailsOpen
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#1F2937"
                                    />
                                </TouchableOpacity>


                                {caseDetailsOpen && (
                                    <View style={styles.detailsGrid}>

                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Patient ID
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {displayValue(patientId)}
                                            </Text>
                                        </View>


                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Patient Name
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {displayValue(patientName)}
                                            </Text>
                                        </View>


                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Gender
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {gender || "Not selected"}
                                            </Text>
                                        </View>


                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Age
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {displayValue(age)}
                                            </Text>
                                        </View>


                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Next Appointment
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {date
                                                    ? `${formatDate(date)} ${formatTime(time)}`
                                                    : " Not provided"}
                                            </Text>
                                        </View>


                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                Delivery Deadline
                                            </Text>

                                            <Text style={styles.detailValue}>
                                                {formatDate(deliveryDate)}
                                            </Text>
                                        </View>
                                        <View style={styles.detailItemFull}>
                                            <Text style={styles.label}>
                                                Case Stage
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(caseStages)}
                                            </Text>


                                        </View>

                                    </View>
                                )}

                            </View>



                            <View style={styles.reviewCard}>

                                <TouchableOpacity
                                    style={styles.reviewCardHeader}
                                    onPress={() => setShadeOpen(!shadeOpen)}
                                    activeOpacity={0.7}
                                >

                                    <Text style={styles.reviewCardTitle}>
                                        Shade Instructions
                                    </Text>

                                    <Ionicons
                                        name={
                                            shadeOpen
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#1F2937"
                                    />

                                </TouchableOpacity>


                                {shadeOpen && (
                                    <View style={styles.reviewDetails}>

                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Surface Texture
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(surfaceTexture)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Glazed Polish
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(glazedPolish)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Incisal Translucency
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(incisalTranslucency)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Prepared Tooth Shade
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(preparedToothShade)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Shade Guide Color
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayValue(shadeInstructions)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Material Type
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(materialTypes)}
                                            </Text>
                                        </View>


                                        <View style={styles.reviewDetailRow}>
                                            <Text style={styles.reviewDetailLabel}>
                                                Crown & Bridge
                                            </Text>

                                            <Text style={styles.reviewDetailValue}>
                                                {displayMultiple(crownBridgeTypes)}
                                            </Text>
                                        </View>

                                    </View>
                                )}
                            </View>


                            <View style={styles.reviewCard}>

                                <TouchableOpacity
                                    style={styles.reviewCardHeader}
                                    onPress={() =>
                                        setReviewImplantOpen((previous) => !previous)
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.reviewCardTitle}>
                                        Implant Instructions
                                    </Text>

                                    <Ionicons
                                        name={
                                            reviewImplantOpen
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#1F2937"
                                    />
                                </TouchableOpacity>
                                {reviewImplantOpen && (
                                    <>
                                        {implantTable
                                            .filter((row) => hasImplantData(row))
                                            .map((row, rowIndex) => (
                                                <View
                                                    key={rowIndex}
                                                    style={styles.implantReviewRow}
                                                >

                                                    <Text style={styles.implantRowTitle}>
                                                        Row {rowIndex + 1}
                                                    </Text>

                                                    <View style={styles.implantReviewDetails}>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Implant Type:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[0])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Platform Diameter:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[1])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Screw Retained:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[2])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Screw Retained Hybrid:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[3])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Cement Retained - Ti Abutment:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[4])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Zr Abutment:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[5])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Implant Bar Type:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[6])}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.implantReviewItem}>
                                                            <Text style={styles.implantReviewLabel}>
                                                                Attachment Type:
                                                            </Text>

                                                            <Text style={styles.implantReviewValue}>
                                                                {displayValue(row[7])}
                                                            </Text>
                                                        </View>

                                                    </View>

                                                </View>
                                            ))}

                                        <View style={styles.reviewDetails}>

                                            <View style={styles.reviewDetailRow}>
                                                <Text style={styles.reviewDetailLabel}>
                                                    Additional Restorations
                                                </Text>

                                                <Text style={styles.reviewDetailValue}>
                                                    {displayMultiple(additionalRestorations)}
                                                </Text>
                                            </View>

                                            <View style={styles.reviewDetailRow}>
                                                <Text style={styles.reviewDetailLabel}>
                                                    Design Preview
                                                </Text>

                                                <Text style={styles.reviewDetailValue}>
                                                    {designPreview
                                                        ? "Request a Design Preview Before Production"
                                                        : "NA"}
                                                </Text>
                                            </View>

                                            <View style={styles.reviewDetailRow}>
                                                <Text style={styles.reviewDetailLabel}>
                                                    Additional Instructions
                                                </Text>

                                                <Text style={styles.reviewDetailValue}>
                                                    {displayValue(implantInstructions)}
                                                </Text>
                                            </View>
                                        </View>
                                    </>

                                )}

                            </View>



                            <View style={styles.reviewCard}>

                                <TouchableOpacity
                                    style={styles.reviewCardHeader}
                                    onPress={() => setCaseDocumentOpen(!caseDocumentOpen)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.reviewCardTitle}>
                                        Case Document
                                    </Text>

                                    <Ionicons
                                        name={
                                            caseDocumentOpen
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#1F2937"
                                    />
                                </TouchableOpacity>

                                {caseDocumentOpen && (
                                    <View style={styles.fileReviewContainer}>

                                        <Text style={styles.fileReviewName}>
                                            {caseDocument?.name || "NA"}
                                        </Text>

                                    </View>
                                )}
                            </View>

                            <View style={styles.reviewCard}>

                                <TouchableOpacity
                                    style={styles.reviewCardHeader}
                                    onPress={() => setDigitalFilesOpen(!digitalFilesOpen)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.reviewCardTitle}>
                                        Digital Files
                                    </Text>

                                    <Ionicons
                                        name={
                                            digitalFilesOpen
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#1F2937"
                                    />
                                </TouchableOpacity>

                                {digitalFilesOpen && (
                                    <View style={styles.fileReviewContainer}>

                                        {uploadedFiles.length > 0 ? (

                                            uploadedFiles.map((file, index) => (

                                                <View
                                                    key={index}
                                                    style={styles.fileReviewRow}
                                                >

                                                    <Ionicons
                                                        name="document-outline"
                                                        size={18}
                                                        color="#0152A8"
                                                    />

                                                    <Text
                                                        style={styles.fileReviewName}
                                                    >
                                                        {file.name}
                                                    </Text>

                                                </View>

                                            ))

                                        ) : (

                                            <Text style={styles.naText}>
                                                NA
                                            </Text>

                                        )}

                                    </View>
                                )}
                            </View>


                            <View style={styles.additionalInfoCard}>

                                <Text style={styles.additionalInfoTitle}>
                                    Additional Instructions
                                </Text>

                                <View style={styles.additionalInfoBox}>

                                    <Ionicons
                                        name="information-circle-outline"
                                        size={18}
                                        color="#0152A8"
                                    />

                                    <Text style={styles.additionalInfoText}>
                                        Please ensure proper contact points and natural
                                        anatomical contours. Match shade with adjacent
                                        teeth. Check and adjust occlusion carefully before
                                        finalizing. Kindly send design preview before
                                        proceeding to production.
                                    </Text>

                                </View>

                            </View>


                            <View style={styles.confirmationSection}>

                                <TouchableOpacity
                                    style={styles.confirmationRow}
                                    onPress={() => {
                                        setConfirmDigitalMedical(!confirmDigitalMedical);
                                        setGdprError("");
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            confirmDigitalMedical
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={20}
                                        color={
                                            confirmDigitalMedical
                                                ? "#1677FF"
                                                : "#B8C0CC"
                                        }
                                    />

                                    <Text style={styles.confirmationText}>
                                        I confirm that all uploaded files are digital
                                        medical files and comply with applicable medical
                                        data regulations (GDPR).
                                    </Text>
                                </TouchableOpacity>

                                {gdprError !== "" && (
                                    <Text style={styles.confirmationError}>
                                        {gdprError}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={styles.confirmationRow}
                                    onPress={() => {
                                        setConfirmGdpr(!confirmGdpr);
                                        setAgreementError("");
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            confirmGdpr
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={20}
                                        color={
                                            confirmGdpr
                                                ? "#1677FF"
                                                : "#B8C0CC"
                                        }
                                    />

                                    <Text style={styles.confirmationText}>
                                        I have reviewed, understood and accept the
                                        Data Processing & Confidentiality Agreement.
                                    </Text>
                                </TouchableOpacity>

                                {agreementError !== "" && (
                                    <Text style={styles.confirmationError}>
                                        {agreementError}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={styles.confirmationRow}
                                    onPress={() => {
                                        setConfirmCaseInstructions(!confirmCaseInstructions);
                                        setConsentError("");
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            confirmCaseInstructions
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={20}
                                        color={
                                            confirmCaseInstructions
                                                ? "#1677FF"
                                                : "#B8C0CC"
                                        }
                                    />

                                    <Text style={styles.confirmationText}>
                                        I confirm that the patient has consented to
                                        sending these medical files (scans, photos)
                                        to the lab.
                                    </Text>
                                </TouchableOpacity>

                                {consentError !== "" && (
                                    <Text style={styles.confirmationError}>
                                        {consentError}
                                    </Text>
                                )}

                            </View>


                            <View style={styles.reviewButtonRow}>

                                <TouchableOpacity
                                    style={styles.reviewBackButton}
                                    onPress={() => setCurrentStep(2)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.reviewBackText}>
                                        Back
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={styles.submitButton}
                                    activeOpacity={0.8}
                                    onPress={submitCase}
                                >
                                    <Text style={styles.heading}>
                                        Edit Case
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </>
                )}


            </ScrollView>
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },


    /* HEADER */

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
    },

    heading: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: "#021E48",
        marginHorizontal: 20,
    },

    stepText: {
        fontSize: 14,
        color: "#6B7280",
    },


    /* PROGRESS */

    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },

    progressCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },

    activeCircle: {
        backgroundColor: "#0152A8",
    },

    inactiveCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#D1D5DB",
    },

    progressLine: {
        flex: 1,
        height: 3,
        backgroundColor: "#D1D5DB",
    },

    activeLine: {
        backgroundColor: "#0152A8",
    },


    /* PURCHASE ORDER */

    card: {
        marginHorizontal: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    cardTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0152A8",
        marginLeft: 8,
    },


    /* FORM */

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#021E48",
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 12,
        marginBottom: 16,
    },

    placeholder: {
        color: "#999999",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    halfInput: {
        width: "48%",
    },


    /* AGE */

    ageContainer: {
        width: "34%",
    },


    /* GENDER */

    genderSection: {
        width: "60%",
    },

    genderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    genderOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },

    genderLabel: {
        marginLeft: 6,
        fontSize: 15,
        color: "#374151",
    },


    /* CASE STAGE */

    caseOption: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
    },

    caseText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#374151",
    },


    /* ACCORDION */

    bottomSection: {
        marginHorizontal: 20,
        marginTop: 18,
    },

    accordionCard: {
        minHeight: 58,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        elevation: 2,
    },

    accordionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    accordionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginLeft: 12,
    },


    /* SHADE CONTAINER */

    shadeContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginTop: -8,
        marginBottom: 8,
        elevation: 2,
    },

    shadeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    shadeRowSpacing: {
        marginTop: 28,
    },

    shadeColumn: {
        width: "48%",
    },

    shadeLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#021E48",
        marginBottom: 14,
    },

    optionWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },

    shadeOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 14,
        marginBottom: 14,
        paddingVertical: 3,
        paddingHorizontal: 2,
    },

    shadeOptionText: {
        fontSize: 14,
        color: "#374151",
        marginLeft: 6,
    },


    /* SHADE GUIDE COLOR */

    shadeFullSection: {
        width: "100%",
    },

    shadeInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 15,
        color: "#374151",
    },


    /* MATERIAL */

    sectionSpacing: {
        marginTop: 28,
    },

    materialGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    materialOption: {
        width: "48%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },


    /* BUTTONS */

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },

    backButton: {
        width: "35%",
        height: 52,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    backText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0152A8",
    },

    nextButton: {
        width: "35%",
        height: 52,
        borderRadius: 8,
        backgroundColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    nextText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
    },


    implantContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginTop: -8,
        marginBottom: 8,
        elevation: 2,
    },

    implantHeading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#021E48",
        marginBottom: 12,
    },

    implantTable: {
        borderWidth: 1,
        borderColor: "#D9E0E5",
    },

    implantTopHeader: {
        flexDirection: "row",
    },

    implantInfoHeader: {
        width: 260,
    },

    restorationHeader: {
        width: 780,
    },

    implantHeaderCell: {
        height: 42,
        backgroundColor: "#D6E5DF",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#8F9E98",
        justifyContent: "center",
        alignItems: "center",
    },

    implantHeaderCellSmall: {
        width: 130,
        minHeight: 66,
        backgroundColor: "#D6E5DF",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#8F9E98",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
    },

    implantColumnRow: {
        flexDirection: "row",
    },

    implantHeaderText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#021E48",
        textAlign: "center",
    },

    implantDataRow: {
        flexDirection: "row",
        minHeight: 64,
        borderBottomWidth: 1,
        borderColor: "#D9E0E5",
        alignItems: "center",
    },

    implantInput: {
        width: 114,
        height: 38,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 7,
        marginHorizontal: 8,
        paddingHorizontal: 8,
        backgroundColor: "#FFFFFF",
    },

    implantSectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#021E48",
        marginTop: 18,
        marginBottom: 12,
    },

    implantOptionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },

    implantOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 18,
        marginBottom: 14,
    },

    implantOptionText: {
        fontSize: 14,
        color: "#374151",
        marginLeft: 7,
    },

    implantSpacing: {
        marginTop: 16,
    },

    additionalInstructionsInput: {
        width: "100%",
        minHeight: 100,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#374151",
    },

    fileInput: {
        height: 48,
        width: "100%",
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },

    chooseFileButton: {
        height: "100%",
        paddingHorizontal: 14,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F6F8",
        borderRightWidth: 1,
        borderRightColor: "#D9D9D9",
    },

    chooseFileText: {
        fontSize: 14,
        color: "#374151",
    },

    noFileText: {
        fontSize: 14,
        color: "#6B7280",
        marginLeft: 12,
    },
    /* ============================== */
    /* STEP 2 - UPLOAD FILES */
    /* ============================== */

    uploadCard: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
    },

    uploadTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    uploadTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0152A8",
    },

    requiredStar: {
        fontSize: 16,
        fontWeight: "700",
        color: "#DC2626",
        marginLeft: 3,
    },

    acceptedFormats: {
        fontSize: 11,
        color: "#4B5563",
        marginBottom: 12,
    },

    chooseFilesRow: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        marginHorizontal: 8,
    },

    chooseFilesButton: {
        height: "100%",
        paddingHorizontal: 14,
        backgroundColor: "#F1F3F5",
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "#D9D9D9",
    },

    chooseFilesText: {
        fontSize: 12,
        color: "#1F2937",
    },

    noFileChosenText: {
        fontSize: 11,
        color: "#6B7280",
        marginLeft: 10,
    },

    uploadDropArea: {
        height: 112,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#B9C4D3",
        borderRadius: 9,
        marginHorizontal: 8,
        marginTop: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFBFD",
    },

    dropTitle: {
        fontSize: 11,
        color: "#4B5563",
        marginTop: 5,
    },

    dropSubtitle: {
        fontSize: 10,
        color: "#6B7280",
        marginTop: 3,
    },

    stepButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 145,
        marginBottom: 20,
        paddingHorizontal: 8,
    },

    stepBackButton: {
        width: "35%",
        height: 48,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#0152A8",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    stepBackText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0152A8",
    },

    stepNextButton: {
        width: "35%",
        height: 48,
        borderRadius: 6,
        backgroundColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },

    stepNextText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    reviewContainer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },

    reviewTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0152A8",
        marginBottom: 10,
    },

    reviewCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E5E9",
        padding: 10,
        marginBottom: 8,
    },

    reviewCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    reviewCardTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F2937",
    },

    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    detailItem: {
        width: "50%",
        marginBottom: 8,
        paddingRight: 6,
    },

    detailItemFull: {
        width: "100%",
        marginBottom: 4,
    },

    detailLabel: {
        fontSize: 9,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 2,
    },

    detailValue: {
        fontSize: 10,
        color: "#1F2937",
    },

    reviewDetails: {
        marginTop: 4,
    },

    reviewDetailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F1F3",
    },

    reviewDetailLabel: {
        width: "40%",
        fontSize: 10,
        fontWeight: "600",
        color: "#374151",
    },

    reviewDetailValue: {
        width: "58%",
        fontSize: 10,
        color: "#1F2937",
        textAlign: "right",
    },

    implantReviewRow: {
        marginTop: 8,
        paddingBottom: 10,
    },

    implantRowTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#021E48",
        marginBottom: 8,
    },

    implantReviewDetails: {
        paddingLeft: 28,
    },

    implantReviewItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
    },

    implantReviewLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#1F2937",
    },

    implantReviewValue: {
        flex: 1,
        fontSize: 10,
        color: "#374151",
        marginLeft: 3,
    },
    fileReviewRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
    },

    fileReviewName: {
        fontSize: 10,
        color: "#374151",
        marginLeft: 7,
    },

    naText: {
        fontSize: 10,
        color: "#6B7280",
    },

    additionalInfoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E5E9",
        padding: 10,
        marginBottom: 10,
    },

    additionalInfoTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },

    additionalInfoBox: {
        flexDirection: "row",
        backgroundColor: "#DCE8FF",
        borderRadius: 5,
        padding: 9,
    },

    additionalInfoText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 13,
        color: "#374151",
        marginLeft: 6,
    },

    confirmationSection: {
        marginBottom: 12,
        marginHorizontal: 0,
    },

    confirmationRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 9,
    },

    confirmationText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 13,
        color: "#374151",
        marginLeft: 6,
    },

    reviewButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4,
        marginBottom: 20,
    },

    reviewBackButton: {
        width: "45%",
        height: 44,
        borderWidth: 1,
        borderColor: "#0152A8",
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    reviewBackText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0152A8",
    },
    fileReviewContainer: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
    },


    submitButton: {
        width: "45%",
        height: 44,
        borderRadius: 6,
        backgroundColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
    },

    submitButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    successScreen: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    successContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    successIconContainer: {
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    successDocument: {
        width: 38,
        height: 45,
        backgroundColor: "#EEF1F4",
        borderRadius: 3,
        paddingTop: 10,
        paddingHorizontal: 7,
    },

    documentLine: {
        height: 2,
        backgroundColor: "#374151",
        marginBottom: 5,
        width: "100%",
    },

    successCheckCircle: {
        position: "absolute",
        right: 2,
        bottom: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#34A853",
        justifyContent: "center",
        alignItems: "center",
    },

    successTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 8,
    },

    successMessage: {
        fontSize: 12,
        lineHeight: 17,
        color: "#374151",
        textAlign: "center",
        marginBottom: 16,
    },

    submitAnotherButton: {
        width: 170,
        height: 42,
        borderRadius: 6,
        backgroundColor: "#005EB8",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },

    submitAnotherText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    successHeader: {
        height: 60,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },

    successHeaderRight: {
        flexDirection: "row",
        alignItems: "center",
    },

    notificationButton: {
        width: 38,
        height: 38,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    notificationDot: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#EF4444",
    },

    profileButton: {
        justifyContent: "center",
        alignItems: "center",
    },

    successBottomNavigation: {
        height: 68,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },

    successNavItem: {
        width: "18%",
        alignItems: "center",
        justifyContent: "center",
    },

    successNavText: {
        fontSize: 8,
        color: "#1F2937",
        marginTop: 3,
    },

    successNavActiveText: {
        fontSize: 8,
        color: "#1677FF",
        marginTop: 3,
    },

    successNewCaseButton: {
        width: "22%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -20,
    },

    successNewCaseCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#005EB8",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        marginBottom: 2,
    },
    errorText: {
        color: "#DC2626",
        fontSize: 12,

    },
    selectedFileRow: {
        minHeight: 48,
        marginHorizontal: 8,
        marginTop: 10,
        paddingLeft: 12,
        paddingRight: 8,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectedFileName: {
        flex: 1,
        fontSize: 13,
        color: "#374151",
        marginRight: 10,
    },

    removeFileButton: {
        minWidth: 65,
        height: 32,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: "#DC3545",
        justifyContent: "center",
        alignItems: "center",
    },

    removeFileText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    confirmationError: {
        color: "#FF3B30",
        fontSize: 14,
        marginTop: -4,
        marginBottom: 12,
        marginLeft: 28,
    },
    accordionArrow: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6B7280",
    },
});