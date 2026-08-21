import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import UpdateCaseHeader from "./UpdateCaseHeader";

type EditStep3Props = {
  patientId: string;
  patientName: string;
  gender: string;
  age: string;
  date: Date | null;
  time: Date | null;
  deliveryDate: Date | null;
  caseStages: string[];
  surfaceTexture: string[];
  glazedPolish: string[];
  incisalTranslucency: string[];
  preparedToothShade: string[];
  shadeInstructions: string;
  materialTypes: string[];
  crownBridgeTypes: string[];
  implantTable: string[][];
  additionalRestorations: string[];
  designPreview: boolean;
  implantInstructions: string;
  caseDocument:
  | DocumentPicker.DocumentPickerAsset
  | null;
  uploadedFiles:
  DocumentPicker.DocumentPickerAsset[];
  confirmDigitalMedical: boolean;
  confirmGdpr: boolean;
  confirmCaseInstructions: boolean;
  gdprError: string;
  agreementError: string;
  consentError: string;
  onToggleDigitalMedical: () => void;
  onToggleGdpr: () => void;
  onToggleCaseInstructions: () => void;
  onBack: () => void;
  onSubmit: () => void;
  saving?: boolean;
};

export default function EditStep3({
  patientId,
  patientName,
  gender,
  age,
  date,
  time,
  deliveryDate,
  caseStages,
  surfaceTexture,
  glazedPolish,
  incisalTranslucency,
  preparedToothShade,
  shadeInstructions,
  materialTypes,
  crownBridgeTypes,
  implantTable,
  additionalRestorations,
  designPreview,
  implantInstructions,
  caseDocument,
  uploadedFiles,
  confirmDigitalMedical,
  confirmGdpr,
  confirmCaseInstructions,
  gdprError,
  agreementError,
  consentError,
  onToggleDigitalMedical,
  onToggleGdpr,
  onToggleCaseInstructions,
  onBack,
  onSubmit,
  saving = false,
}: EditStep3Props) {
  const [
    caseDetailsOpen,
    setCaseDetailsOpen,
  ] = useState(true);

  const [
    shadeOpen,
    setShadeOpen,
  ] = useState(true);

  const [
    reviewImplantOpen,
    setReviewImplantOpen,
  ] = useState(true);

  const [
    caseDocumentOpen,
    setCaseDocumentOpen,
  ] = useState(true);

  const [
    digitalFilesOpen,
    setDigitalFilesOpen,
  ] = useState(true);

  const displayValue = (
    value: string | undefined
  ) => {
    return value &&
      value.trim() !== ""
      ? value
      : "Not provided";
  };

  const displayMultiple = (
    values: string[]
  ) => {
    return values.length > 0
      ? values.join(", ")
      : "Not Selected";
  };

  const formatDate = (
    value: Date | null
  ) => {
    if (!value) {
      return "Not provided";
    }

    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      value.getDate()
    ).padStart(2, "0");

    const year =
      value.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const formatTime = (
    value: Date | null
  ) => {
    if (!value) {
      return "Not provided";
    }

    const hours = String(
      value.getHours()
    ).padStart(2, "0");

    const minutes = String(
      value.getMinutes()
    ).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const hasImplantData = (
    row: string[]
  ) => {
    return row.some(
      (value) =>
        value.trim() !== ""
    );
  };

  const Confirmation = ({
    checked,
    text,
    error,
    onPress,
  }: {
    checked: boolean;
    text: string;
    error: string;
    onPress: () => void;
  }) => {
    return (
      <View
        style={
          styles.confirmationContainer
        }
      >
        <TouchableOpacity
          style={
            styles.confirmationRow
          }
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
          }}
        >
          <View
            style={[
              styles.checkbox,
              checked &&
              styles.checkboxChecked,
            ]}
          >
            {checked && (
              <Ionicons
                name="checkmark"
                size={16}
                color="#FFFFFF"
              />
            )}
          </View>

          <Text
            style={
              styles.confirmationText
            }
          >
            {text}
          </Text>
        </TouchableOpacity>

        {error !== "" && (
          <Text
            style={
              styles.confirmationError
            }
          >
            {error}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={
        styles.pageContainer
      }
    >
      <UpdateCaseHeader
        currentStep={3}
        onBack={onBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={
            styles.reviewContainer
          }
        >
          <Text
            style={
              styles.reviewTitle
            }
          >
            3. Review & Confirm
          </Text>

          <View
            style={
              styles.reviewCard
            }
          >
            <TouchableOpacity
              style={
                styles.reviewCardHeader
              }
              onPress={() =>
                setCaseDetailsOpen(
                  !caseDetailsOpen
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.reviewCardTitle
                }
              >
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
              <View
                style={
                  styles.detailsGrid
                }
              >
                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Patient ID
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {displayValue(
                      patientId
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Patient Name
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {displayValue(
                      patientName
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Gender
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {gender ||
                      "Not selected"}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Age
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {displayValue(
                      age
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Next Appointment
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatDate(date)}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Appointment Time
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatTime(time)}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItem
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Delivery Deadline
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {formatDate(
                      deliveryDate
                    )}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailItemFull
                  }
                >
                  <Text
                    style={
                      styles.detailLabel
                    }
                  >
                    Case Stage
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                  >
                    {displayMultiple(
                      caseStages
                    )}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={
              styles.reviewCard
            }
          >
            <TouchableOpacity
              style={
                styles.reviewCardHeader
              }
              onPress={() =>
                setShadeOpen(
                  !shadeOpen
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.reviewCardTitle
                }
              >
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
              <View
                style={
                  styles.reviewDetails
                }
              >
                {[
                  [
                    "Surface Texture",
                    displayMultiple(
                      surfaceTexture
                    ),
                  ],
                  [
                    "Glazed Polish",
                    displayMultiple(
                      glazedPolish
                    ),
                  ],
                  [
                    "Incisal Translucency",
                    displayMultiple(
                      incisalTranslucency
                    ),
                  ],
                  [
                    "Prepared Tooth Shade",
                    displayMultiple(
                      preparedToothShade
                    ),
                  ],
                  [
                    "Shade Guide Color",
                    displayValue(
                      shadeInstructions
                    ),
                  ],
                  [
                    "Material Type",
                    displayMultiple(
                      materialTypes
                    ),
                  ],
                  [
                    "Crown & Bridge",
                    displayMultiple(
                      crownBridgeTypes
                    ),
                  ],
                ].map(
                  (item) => (
                    <View
                      key={item[0]}
                      style={
                        styles.reviewDetailRow
                      }
                    >
                      <Text
                        style={
                          styles.reviewDetailLabel
                        }
                      >
                        {item[0]}
                      </Text>

                      <Text
                        style={
                          styles.reviewDetailValue
                        }
                      >
                        {item[1]}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>

          <View
            style={
              styles.reviewCard
            }
          >
            <TouchableOpacity
              style={
                styles.reviewCardHeader
              }
              onPress={() =>
                setReviewImplantOpen(
                  !reviewImplantOpen
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.reviewCardTitle
                }
              >
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
                  .filter(
                    hasImplantData
                  )
                  .map(
                    (
                      row,
                      index
                    ) => (
                      <View
                        key={index}
                        style={
                          styles.implantReviewRow
                        }
                      >
                        <Text
                          style={
                            styles.implantRowTitle
                          }
                        >
                          Row {index + 1}
                        </Text>

                        {[
                          "Implant Type",
                          "Platform Diameter",
                          "Screw Retained",
                          "Screw Retained Hybrid",
                          "Cement Retained - Ti Abutment",
                          "Zr Abutment",
                          "Implant Bar Type",
                          "Attachment Type",
                        ].map(
                          (
                            label,
                            column
                          ) => (
                            <View
                              key={
                                label
                              }
                              style={
                                styles.implantReviewItem
                              }
                            >
                              <Text
                                style={
                                  styles.implantReviewLabel
                                }
                              >
                                {label}
                              </Text>

                              <Text
                                style={
                                  styles.implantReviewValue
                                }
                              >
                                {displayValue(
                                  row[
                                  column
                                  ]
                                )}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    )
                  )}

                <View
                  style={
                    styles.reviewDetails
                  }
                >
                  <View
                    style={
                      styles.reviewDetailRow
                    }
                  >
                    <Text
                      style={
                        styles.reviewDetailLabel
                      }
                    >
                      Additional Restorations
                    </Text>

                    <Text
                      style={
                        styles.reviewDetailValue
                      }
                    >
                      {displayMultiple(
                        additionalRestorations
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.reviewDetailRow
                    }
                  >
                    <Text
                      style={
                        styles.reviewDetailLabel
                      }
                    >
                      Design Preview
                    </Text>

                    <Text
                      style={
                        styles.reviewDetailValue
                      }
                    >
                      {designPreview
                        ? "Request a Design Preview Before Production"
                        : "NA"}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.reviewDetailRow
                    }
                  >
                    <Text
                      style={
                        styles.reviewDetailLabel
                      }
                    >
                      Additional Instructions
                    </Text>

                    <Text
                      style={
                        styles.reviewDetailValue
                      }
                    >
                      {displayValue(
                        implantInstructions
                      )}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <View
            style={
              styles.reviewCard
            }
          >
            <TouchableOpacity
              style={
                styles.reviewCardHeader
              }
              onPress={() =>
                setCaseDocumentOpen(
                  !caseDocumentOpen
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.reviewCardTitle
                }
              >
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
              <View
                style={
                  styles.fileReviewContainer
                }
              >
                <View
                  style={
                    styles.fileReviewRow
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#0152A8"
                  />

                  <Text
                    style={
                      styles.fileReviewName
                    }
                    numberOfLines={1}
                  >
                    {caseDocument?.name ||
                      "NA"}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={
              styles.reviewCard
            }
          >
            <TouchableOpacity
              style={
                styles.reviewCardHeader
              }
              onPress={() =>
                setDigitalFilesOpen(
                  !digitalFilesOpen
                )
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.reviewCardTitle
                }
              >
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
              <View
                style={
                  styles.fileReviewContainer
                }
              >
                {uploadedFiles.length >
                  0 ? (
                  uploadedFiles.map(
                    (
                      file,
                      index
                    ) => (
                      <View
                        key={`${file.name}-${index}`}
                        style={
                          styles.fileReviewRow
                        }
                      >
                        <Ionicons
                          name={
                            file.mimeType?.startsWith(
                              "video/"
                            )
                              ? "videocam-outline"
                              : file.mimeType?.startsWith(
                                "image/"
                              )
                                ? "image-outline"
                                : "document-outline"
                          }
                          size={18}
                          color="#0152A8"
                        />

                        <Text
                          style={
                            styles.fileReviewName
                          }
                          numberOfLines={1}
                        >
                          {file.name}
                        </Text>
                      </View>
                    )
                  )
                ) : (
                  <Text
                    style={
                      styles.naText
                    }
                  >
                    NA
                  </Text>
                )}
              </View>
            )}
          </View>

          <View
            style={
              styles.additionalInfoCard
            }
          >
            <Text
              style={
                styles.additionalInfoTitle
              }
            >
              Additional Instructions
            </Text>

            <View
              style={
                styles.additionalInfoBox
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#0152A8"
              />

              <Text
                style={
                  styles.additionalInfoText
                }
              >
                Please ensure proper
                contact points and
                natural anatomical
                contours. Match shade
                with adjacent teeth.
                Check and adjust
                occlusion carefully
                before finalizing.
                Kindly send design
                preview before
                proceeding to
                production.
              </Text>
            </View>
          </View>

          <View
            style={
              styles.confirmationSection
            }
          >
            <Confirmation
              checked={
                confirmDigitalMedical
              }
              onPress={
                onToggleDigitalMedical
              }
              error={
                gdprError
              }
              text="I confirm that all uploaded files are digital medical files and comply with applicable medical data regulations (GDPR)."
            />

            <Confirmation
              checked={
                confirmGdpr
              }
              onPress={
                onToggleGdpr
              }
              error={
                agreementError
              }
              text="I have reviewed, understood and accept the Data Processing & Confidentiality Agreement."
            />

            <Confirmation
              checked={
                confirmCaseInstructions
              }
              onPress={
                onToggleCaseInstructions
              }
              error={
                consentError
              }
              text="I confirm that the patient has consented to sending these medical files (scans, photos) to the lab."
            />
          </View>

          <View
            style={
              styles.reviewButtonRow
            }
          >
            <TouchableOpacity
              style={
                styles.reviewBackButton
              }
              activeOpacity={0.8}
              onPress={onBack}
            >
              <Text
                style={
                  styles.reviewBackText
                }
              >
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                saving &&
                styles.disabledButton,
              ]}
              disabled={saving}
              activeOpacity={0.8}
              onPress={onSubmit}
            >
              <Text
                style={
                  styles.submitButtonText
                }
              >
                {saving
                  ? "Updating..."
                  : "Update Case"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  scrollView: {
    flex: 1,
  },

  container: {
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#F7F9FC",
  },

  reviewContainer: {
    marginHorizontal: 20,
  },

  reviewTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#021E48",
    marginBottom: 15,
  },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 14,
    padding: 16,
    elevation: 2,
  },

  reviewCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  detailsGrid: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  detailItem: {
    width: "50%",
    marginBottom: 18,
  },

  detailItemFull: {
    width: "100%",
  },

  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
  },

  detailValue: {
    fontSize: 14,
    color: "#1F2937",
  },

  reviewDetails: {
    marginTop: 18,
  },

  reviewDetailRow: {
    marginBottom: 14,
  },

  reviewDetailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  reviewDetailValue: {
    fontSize: 14,
    color: "#1F2937",
  },

  implantReviewRow: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },

  implantRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0152A8",
    marginBottom: 10,
  },

  implantReviewItem: {
    marginBottom: 8,
  },

  implantReviewLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  implantReviewValue: {
    fontSize: 14,
    color: "#1F2937",
    marginTop: 2,
  },

  fileReviewContainer: {
    marginTop: 15,
  },

  fileReviewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  fileReviewName: {
    marginLeft: 8,
    flex: 1,
    color: "#374151",
    fontSize: 14,
  },

  naText: {
    color: "#6B7280",
  },

  additionalInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },

  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#021E48",
    marginBottom: 10,
  },

  additionalInfoBox: {
    flexDirection: "row",
    backgroundColor: "#F3F7FC",
    borderRadius: 8,
    padding: 12,
  },

  additionalInfoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#374151",
  },

  confirmationSection: {
    marginBottom: 20,
  },

  confirmationContainer: {
    marginBottom: 12,
  },

  confirmationRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#B8C0CC",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  checkboxChecked: {
    backgroundColor: "#1677FF",
    borderColor: "#1677FF",
  },

  confirmationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#374151",
  },

  confirmationError: {
    color: "#DC2626",
    fontSize: 12,
    marginLeft: 30,
    marginTop: 3,
  },

  reviewButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  reviewBackButton: {
    width: "35%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  reviewBackText: {
    color: "#0152A8",
    fontSize: 16,
    fontWeight: "600",
  },

  submitButton: {
    width: "55%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },
});