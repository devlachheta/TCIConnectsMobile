import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "@/services/api";
import { uploadCaseFile } from "@/services/caseService";

import EditStep1 from "./EditStep1";
import EditStep2 from "./EditStep2";
import EditStep3 from "./EditStep3";
import EditSuccess from "./EditSuccess";

const EMPTY_IMPLANT_TABLE = () =>
  Array.from(
    { length: 3 },
    () => Array(8).fill("")
  );

export default function EditCase() {
  const router = useRouter();

  const { caseId } =
    useLocalSearchParams<{
      caseId?: string;
    }>();

  const [patientName, setPatientName] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [date, setDate] =
    useState<Date | null>(null);

  const [time, setTime] =
    useState<Date | null>(null);

  const [deliveryDate, setDeliveryDate] =
    useState<Date | null>(null);

  const [shadeInstructions, setShadeInstructions] =
    useState("");

  const [implantInstructions, setImplantInstructions] =
    useState("");

  const [surfaceTexture, setSurfaceTexture] =
    useState<string[]>([]);

  const [glazedPolish, setGlazedPolish] =
    useState<string[]>([]);

  const [incisalTranslucency, setIncisalTranslucency] =
    useState<string[]>([]);

  const [preparedToothShade, setPreparedToothShade] =
    useState<string[]>([]);

  const [materialTypes, setMaterialTypes] =
    useState<string[]>([]);

  const [crownBridgeTypes, setCrownBridgeTypes] =
    useState<string[]>([]);

  const [caseStages, setCaseStages] =
    useState<string[]>([]);

  const [additionalRestorations, setAdditionalRestorations] =
    useState<string[]>([]);

  const [designPreview, setDesignPreview] =
    useState(false);

  const [implantTable, setImplantTable] =
    useState<string[][]>(
      EMPTY_IMPLANT_TABLE()
    );

  const [uploadedFiles, setUploadedFiles] =
    useState<
      DocumentPicker.DocumentPickerAsset[]
    >([]);

  const [caseDocument, setCaseDocument] =
    useState<
      DocumentPicker.DocumentPickerAsset | null
    >(null);

  const [caseDocumentIsNew, setCaseDocumentIsNew] =
    useState(false);

  const [existingFiles, setExistingFiles] =
    useState<any[]>([]);

  const [currentStep, setCurrentStep] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [updateSuccessful, setUpdateSuccessful] =
    useState(false);

  const [step1Error, setStep1Error] =
    useState("");

  const [step2Error, setStep2Error] =
    useState("");

  const [gdprError, setGdprError] =
    useState("");

  const [agreementError, setAgreementError] =
    useState("");

  const [consentError, setConsentError] =
    useState("");

  const [
    confirmDigitalMedical,
    setConfirmDigitalMedical,
  ] = useState(false);

  const [
    confirmGdpr,
    setConfirmGdpr,
  ] = useState(false);

  const [
    confirmCaseInstructions,
    setConfirmCaseInstructions,
  ] = useState(false);

  const parseLocalDate = (
    value:
      | string
      | null
      | undefined
  ): Date | null => {
    if (!value) {
      return null;
    }

    const datePart =
      value.split("T")[0];

    const parts =
      datePart
        .split("-")
        .map(Number);

    if (parts.length !== 3) {
      return null;
    }

    const [
      year,
      month,
      day,
    ] = parts;

    if (
      !year ||
      !month ||
      !day
    ) {
      return null;
    }

    return new Date(
      year,
      month - 1,
      day
    );
  };

  const parseTime = (
    value:
      | string
      | null
      | undefined
  ): Date | null => {
    if (!value) {
      return null;
    }

    const [
      hours,
      minutes,
    ] = value
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return null;
    }

    const result =
      new Date();

    result.setHours(hours);
    result.setMinutes(minutes);
    result.setSeconds(0);
    result.setMilliseconds(0);

    return result;
  };

  const normalizeArray = (
    value: any
  ): string[] => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value
        .split(",")
        .map(
          (item) =>
            item.trim()
        )
        .filter(Boolean);
    }

    return [];
  };

  const fetchCase = async () => {
    if (!caseId) {
      console.log(
        "No caseId found."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      console.log(
        "Fetching case:",
        caseId
      );

      const response =
        await api.get(
          `/cases/${caseId}`
        );

      const data =
        response.data;

      console.log(
        "EDIT CASE DATA:",
        data
      );

      setPatientName(
        data.patient_name || ""
      );

      setPatientId(
        data.patient_id !== null &&
          data.patient_id !== undefined
          ? String(data.patient_id)
          : ""
      );

      setAge(
        data.age !== null &&
          data.age !== undefined
          ? String(data.age)
          : ""
      );

      setGender(
        data.gender || ""
      );

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

      const details =
        data.details || {};

      setCaseStages(
        normalizeArray(
          details.case_stage
        )
      );

      setSurfaceTexture(
        normalizeArray(
          details.surface_texture
        )
      );

      setGlazedPolish(
        normalizeArray(
          details.glazed_polish
        )
      );

      setIncisalTranslucency(
        normalizeArray(
          details.incisal_translucency
        )
      );

      setPreparedToothShade(
        normalizeArray(
          details.prepared_tooth_shade
        )
      );

      setShadeInstructions(
        details.shade_guide_color || ""
      );

      setMaterialTypes(
        normalizeArray(
          details.material_type
        )
      );

      setCrownBridgeTypes(
        normalizeArray(
          details.crown_bridge
        )
      );

      setAdditionalRestorations(
        normalizeArray(
          details.additional_restorations
        )
      );

      setImplantInstructions(
        details.additional_instructions || ""
      );

      setDesignPreview(
        Boolean(
          details.design_preview
        )
      );

      const implants =
        Array.isArray(
          details.implant_details
        )
          ? details.implant_details
          : [];

      const table =
        Array.from(
          {
            length: 3,
          },
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
        table
      );

      const files =
        Array.isArray(data.files)
          ? data.files
          : [];

      setExistingFiles(
        files
      );

      const existingCaseDocument =
        files.find(
          (file: any) =>
            file.file_category ===
            "case_document"
        );

      if (
        existingCaseDocument
      ) {
        setCaseDocument({
          uri:
            existingCaseDocument.file_path ||
            "",
          name:
            existingCaseDocument.file_name ||
            "Case Document",
          mimeType:
            existingCaseDocument.file_type ||
            "application/pdf",
        } as DocumentPicker.DocumentPickerAsset);

        setCaseDocumentIsNew(false);
      } else {
        setCaseDocument(null);
        setCaseDocumentIsNew(false);
      }

    } catch (error: any) {
      console.log(
        "FETCH CASE ERROR:",
        error?.response?.data ||
        error
      );

      const detail =
        error?.response?.data?.detail;

      const message =
        typeof detail === "string"
          ? detail
          : "Failed to load case.";

      Alert.alert(
        "Error",
        message
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const toggleArrayValue = (
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >,
    value: string
  ) => {
    setter(
      (previous) =>
        previous.includes(value)
          ? previous.filter(
            (item) =>
              item !== value
          )
          : [
            ...previous,
            value,
          ]
    );
  };

  const toggleSurfaceTexture = (
    value: string
  ) => {
    toggleArrayValue(
      setSurfaceTexture,
      value
    );
  };

  const toggleGlazedPolish = (
    value: string
  ) => {
    toggleArrayValue(
      setGlazedPolish,
      value
    );
  };

  const toggleIncisalTranslucency = (
    value: string
  ) => {
    toggleArrayValue(
      setIncisalTranslucency,
      value
    );
  };

  const togglePreparedToothShade = (
    value: string
  ) => {
    toggleArrayValue(
      setPreparedToothShade,
      value
    );
  };

  const toggleMaterialType = (
    value: string
  ) => {
    toggleArrayValue(
      setMaterialTypes,
      value
    );
  };

  const toggleCrownBridgeType = (
    value: string
  ) => {
    toggleArrayValue(
      setCrownBridgeTypes,
      value
    );
  };

  const toggleCaseStage = (
    value: string
  ) => {
    toggleArrayValue(
      setCaseStages,
      value
    );
  };

  const toggleAdditionalRestoration = (
    value: string
  ) => {
    toggleArrayValue(
      setAdditionalRestorations,
      value
    );
  };

  const updateImplantCell = (
    rowIndex: number,
    columnIndex: number,
    value: string
  ) => {
    setImplantTable(
      (previous) => {
        const updated =
          previous.map(
            (row) => [
              ...row,
            ]
          );

        if (
          !updated[rowIndex]
        ) {
          updated[rowIndex] =
            Array(8).fill("");
        }

        updated[rowIndex][
          columnIndex
        ] = value;

        return updated;
      }
    );
  };

  const selectCaseDocument =
    async () => {
      try {
        const result =
          await DocumentPicker.getDocumentAsync(
            {
              type: "*/*",
              copyToCacheDirectory: true,
              multiple: false,
            }
          );

        if (
          result.canceled
        ) {
          return;
        }

        const file =
          result.assets?.[0];

        if (!file) {
          return;
        }

        setCaseDocument(
          file
        );

        setCaseDocumentIsNew(
          true
        );

      } catch (error) {
        console.log(
          "CASE DOCUMENT PICKER ERROR:",
          error
        );
      }
    };

  const removeCaseDocument =
    () => {
      setCaseDocument(null);
      setCaseDocumentIsNew(false);
    };

  const selectDigitalFiles =
    async () => {
      try {
        const result =
          await DocumentPicker.getDocumentAsync(
            {
              type: [
                "model/*",
                "image/*",
                "application/zip",
                "*/*",
              ],
              copyToCacheDirectory: true,
              multiple: true,
            }
          );

        if (
          result.canceled
        ) {
          return;
        }

        const selected =
          result.assets || [];

        if (
          selected.length === 0
        ) {
          return;
        }

        const existingDigitalCount =
          (
            existingFiles || []
          ).filter(
            (file: any) =>
              file.file_category ===
              "digital_file"
          ).length;

        const availableSlots =
          5 -
          existingDigitalCount -
          uploadedFiles.length;

        if (
          availableSlots <= 0
        ) {
          Alert.alert(
            "Maximum Files",
            "You can have a maximum of 5 digital files."
          );

          return;
        }

        if (
          selected.length >
          availableSlots
        ) {
          Alert.alert(
            "Maximum Files",
            `You can add only ${availableSlots} more file${availableSlots !== 1
              ? "s"
              : ""
            }.`
          );

          return;
        }

        setUploadedFiles(
          (previous) => {
            const combined = [
              ...previous,
              ...selected,
            ];

            const unique =
              combined.filter(
                (
                  file,
                  index,
                  array
                ) =>
                  index ===
                  array.findIndex(
                    (item) =>
                      item.name ===
                      file.name &&
                      item.size ===
                      file.size
                  )
              );

            return unique.slice(
              0,
              availableSlots
            );
          }
        );

        setStep2Error("");

      } catch (error) {
        console.log(
          "DIGITAL FILE PICKER ERROR:",
          error
        );
      }
    };

  const removeDigitalFile = (
    index: number
  ) => {
    setUploadedFiles(
      (previous) =>
        previous.filter(
          (
            _,
            fileIndex
          ) =>
            fileIndex !== index
        )
    );

    setStep2Error("");
  };

  const removeExistingFile = async (
    file: any
  ) => {
    if (!file?.id) {
      Alert.alert(
        "Error",
        "File ID is missing."
      );

      return;
    }

    Alert.alert(
      "Remove File",
      `Are you sure you want to remove "${file.file_name || "this file"}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(
                `/case-files/${file.id}`
              );

              setExistingFiles(
                (previous) =>
                  previous.filter(
                    (item) =>
                      item.id !==
                      file.id
                  )
              );

              setStep2Error("");

            } catch (
            error: any
            ) {
              console.log(
                "REMOVE EXISTING FILE ERROR:",
                error?.response?.data ||
                error
              );

              const detail =
                error?.response?.data?.detail;

              const message =
                typeof detail === "string"
                  ? detail
                  : "Failed to remove file.";

              Alert.alert(
                "Error",
                message
              );
            }
          },
        },
      ]
    );
  };

  const handleStep1Next =
    () => {
      if (
        !patientName.trim()
      ) {
        setStep1Error(
          "Patient Name is required."
        );

        return;
      }

      setStep1Error("");
      setCurrentStep(2);
    };

  const handleStep2Next =
    () => {
      const existingDigitalFiles =
        (
          existingFiles || []
        ).filter(
          (file: any) =>
            file.file_category ===
            "digital_file"
        );

      if (
        existingDigitalFiles.length === 0 &&
        uploadedFiles.length === 0
      ) {
        setStep2Error(
          "At least one digital file is required."
        );

        return;
      }

      const totalFiles =
        existingDigitalFiles.length +
        uploadedFiles.length;

      if (
        totalFiles > 5
      ) {
        setStep2Error(
          "Maximum 5 digital files are allowed."
        );

        return;
      }

      setStep2Error("");
      setCurrentStep(3);
    };

  const toggleDigitalMedical =
    () => {
      setConfirmDigitalMedical(
        (previous) =>
          !previous
      );

      setGdprError("");
    };

  const toggleGdpr =
    () => {
      setConfirmGdpr(
        (previous) =>
          !previous
      );

      setAgreementError("");
    };

  const toggleCaseInstructions =
    () => {
      setConfirmCaseInstructions(
        (previous) =>
          !previous
      );

      setConsentError("");
    };

  const submitCase =
    async () => {
      if (!caseId) {
        Alert.alert(
          "Error",
          "Case ID is missing."
        );

        return;
      }

      let hasError =
        false;

      if (
        !patientName.trim()
      ) {
        setStep1Error(
          "Patient Name is required."
        );

        hasError = true;
      } else {
        setStep1Error("");
      }

      const existingDigitalFiles =
        (
          existingFiles || []
        ).filter(
          (file: any) =>
            file.file_category ===
            "digital_file"
        );

      const totalFiles =
        existingDigitalFiles.length +
        uploadedFiles.length;

      if (
        totalFiles === 0
      ) {
        setStep2Error(
          "At least one digital file is required."
        );

        hasError = true;

      } else if (
        totalFiles > 5
      ) {
        setStep2Error(
          "Maximum 5 digital files are allowed."
        );

        hasError = true;

      } else {
        setStep2Error("");
      }

      if (
        !confirmDigitalMedical
      ) {
        setGdprError(
          "Please confirm the digital medical files."
        );

        hasError = true;
      } else {
        setGdprError("");
      }

      if (
        !confirmGdpr
      ) {
        setAgreementError(
          "Please accept the Data Processing & Confidentiality Agreement."
        );

        hasError = true;
      } else {
        setAgreementError("");
      }

      if (
        !confirmCaseInstructions
      ) {
        setConsentError(
          "Please confirm patient consent."
        );

        hasError = true;
      } else {
        setConsentError("");
      }

      if (
        hasError
      ) {
        return;
      }

      try {
        setSaving(true);

        const implantDetails =
          implantTable.map(
            (row) => ({
              implant_type:
                row[0] || "",
              platform_diameter:
                row[1] || "",
              screw_retained:
                row[2] || "",
              screw_retained_hybrid:
                row[3] || "",
              cement_retained_ti_abutment:
                row[4] || "",
              zr_abutment:
                row[5] || "",
              implant_bar_type:
                row[6] || "",
              attachment_type:
                row[7] || "",
            })
          );

        const payload = {
          patient_name:
            patientName.trim(),

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
        };

        console.log(
          "UPDATE CASE ID:",
          caseId
        );

        console.log(
          "UPDATE CASE PAYLOAD:",
          payload
        );

        const response =
          await api.put(
            `/cases/${caseId}`,
            payload
          );

        console.log(
          "UPDATE CASE RESPONSE:",
          response.data
        );

        for (
          const file
          of uploadedFiles
        ) {
          const uploadResponse =
            await uploadCaseFile(
              Number(caseId),
              file,
              "digital_file"
            );

          console.log(
            "DIGITAL FILE UPLOAD RESPONSE:",
            uploadResponse
          );
        }

        if (
          caseDocument &&
          caseDocumentIsNew
        ) {
          const caseDocumentResponse =
            await uploadCaseFile(
              Number(caseId),
              caseDocument,
              "case_document"
            );

          console.log(
            "CASE DOCUMENT UPLOAD RESPONSE:",
            caseDocumentResponse
          );
        }

        setUpdateSuccessful(
          true
        );

      } catch (error: any) {
        console.log(
          "UPDATE CASE ERROR:",
          error?.response?.data ||
          error
        );

        let errorMessage =
          "Failed to update case.";

        const detail =
          error?.response?.data?.detail;

        if (
          typeof detail === "string"
        ) {
          errorMessage =
            detail;

        } else if (
          Array.isArray(detail)
        ) {
          errorMessage =
            detail
              .map(
                (item: any) => {
                  if (
                    typeof item === "string"
                  ) {
                    return item;
                  }

                  if (
                    typeof item?.msg ===
                    "string"
                  ) {
                    return item.msg;
                  }

                  return JSON.stringify(
                    item
                  );
                }
              )
              .join("\n");

        } else if (
          detail &&
          typeof detail === "object"
        ) {
          errorMessage =
            JSON.stringify(
              detail
            );

        } else if (
          typeof error?.response?.data ===
          "string"
        ) {
          errorMessage =
            error.response.data;
        }

        Alert.alert(
          "Error",
          errorMessage
        );

      } finally {
        setSaving(false);
      }
    };

  if (
    loading
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#0152A8"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading case...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    updateSuccessful
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <EditSuccess
          onViewCases={() => {
            router.replace(
              "/(tabs)/cases"
            );
          }}
        />
      </SafeAreaView>
    );
  }

  if (
    currentStep === 1
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <EditStep1
          patientName={
            patientName
          }
          patientId={
            patientId
          }
          age={
            age
          }
          gender={
            gender
          }
          date={
            date
          }
          time={
            time
          }
          deliveryDate={
            deliveryDate
          }
          shadeInstructions={
            shadeInstructions
          }
          implantInstructions={
            implantInstructions
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
          materialTypes={
            materialTypes
          }
          crownBridgeTypes={
            crownBridgeTypes
          }
          caseStages={
            caseStages
          }
          additionalRestorations={
            additionalRestorations
          }
          designPreview={
            designPreview
          }
          onDesignPreviewChange={
            setDesignPreview
          }
          implantTable={
            implantTable
          }
          caseDocument={
            caseDocument
          }
          step1Error={
            step1Error
          }
          onPatientNameChange={
            (value) => {
              setPatientName(
                value
              );

              setStep1Error("");
            }
          }
          onPatientIdChange={
            setPatientId
          }
          onAgeChange={
            setAge
          }
          onGenderChange={
            setGender
          }
          onDateChange={
            setDate
          }
          onTimeChange={
            setTime
          }
          onDeliveryDateChange={
            setDeliveryDate
          }
          onShadeInstructionsChange={
            setShadeInstructions
          }
          onImplantInstructionsChange={
            setImplantInstructions
          }
          toggleSurfaceTexture={
            toggleSurfaceTexture
          }
          toggleGlazedPolish={
            toggleGlazedPolish
          }
          toggleIncisalTranslucency={
            toggleIncisalTranslucency
          }
          togglePreparedToothShade={
            togglePreparedToothShade
          }
          toggleMaterialType={
            toggleMaterialType
          }
          toggleCrownBridgeType={
            toggleCrownBridgeType
          }
          toggleCaseStage={
            toggleCaseStage
          }
          toggleAdditionalRestoration={
            toggleAdditionalRestoration
          }
          updateImplantCell={
            updateImplantCell
          }
          onSelectCaseDocument={
            selectCaseDocument
          }
          onRemoveCaseDocument={
            removeCaseDocument
          }
          onNext={
            handleStep1Next
          }
          onBack={() =>
            router.back()
          }
        />
      </SafeAreaView>
    );
  }

  if (
    currentStep === 2
  ) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={[
          "top",
          "bottom",
        ]}
      >
        <EditStep2
          uploadedFiles={
            uploadedFiles
          }
          existingFiles={
            existingFiles
          }
          step2Error={
            step2Error
          }
          onSelectFiles={
            selectDigitalFiles
          }
          onRemoveFile={
            removeDigitalFile
          }
          onRemoveExistingFile={
            removeExistingFile
          }
          onBack={() =>
            setCurrentStep(1)
          }
          onNext={
            handleStep2Next
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <EditStep3
        patientId={patientId}
        patientName={patientName}
        gender={gender}
        age={age}
        date={date}
        time={time}
        deliveryDate={deliveryDate}
        caseStages={caseStages}
        surfaceTexture={surfaceTexture}
        glazedPolish={glazedPolish}
        incisalTranslucency={incisalTranslucency}
        preparedToothShade={preparedToothShade}
        shadeInstructions={shadeInstructions}
        materialTypes={materialTypes}
        crownBridgeTypes={crownBridgeTypes}
        implantTable={implantTable}
        additionalRestorations={additionalRestorations}
        designPreview={designPreview}
        implantInstructions={implantInstructions}
        caseDocument={caseDocument}
        uploadedFiles={uploadedFiles}
        confirmDigitalMedical={confirmDigitalMedical}
        confirmGdpr={confirmGdpr}
        confirmCaseInstructions={confirmCaseInstructions}
        gdprError={gdprError}
        agreementError={agreementError}
        consentError={consentError}
        onToggleDigitalMedical={() => {
          setConfirmDigitalMedical(
            (previous) => !previous
          );
          setGdprError("");
        }}
        onToggleGdpr={() => {
          setConfirmGdpr(
            (previous) => !previous
          );
          setAgreementError("");
        }}
        onToggleCaseInstructions={() => {
          setConfirmCaseInstructions(
            (previous) => !previous
          );
          setConsentError("");
        }}
        onBack={() => {
          setCurrentStep(2);
        }}
        onSubmit={submitCase}
        saving={saving}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
  },
});