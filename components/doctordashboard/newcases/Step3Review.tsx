import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  patientName: string;
  patientId: string;
  age: string;
  gender: string;
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
  uploadedFiles: DocumentPicker.DocumentPickerAsset[];
  caseDetailsOpen: boolean;
  setCaseDetailsOpen: (value: boolean) => void;
  shadeOpen: boolean;
  setShadeOpen: (value: boolean) => void;
  reviewImplantOpen: boolean;
  setReviewImplantOpen: (value: boolean) => void;
  caseDocumentOpen: boolean;
  setCaseDocumentOpen: (value: boolean) => void;
  digitalFilesOpen: boolean;
  setDigitalFilesOpen: (value: boolean) => void;
  additionalInfoOpen: boolean;
  setAdditionalInfoOpen: (value: boolean) => void;
  confirmDigitalMedical: boolean;
  setConfirmDigitalMedical: (value: boolean) => void;
  confirmGdpr: boolean;
  setConfirmGdpr: (value: boolean) => void;
  confirmCaseInstructions: boolean;
  setConfirmCaseInstructions: (value: boolean) => void;
  gdprError: string;
  setGdprError: (value: string) => void;
  agreementError: string;
  setAgreementError: (value: string) => void;
  consentError: string;
  setConsentError: (value: string) => void;
  submitting: boolean;
  caseSubmitted: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onSubmitAnother: () => void;
};

export default function Step3Review(
  props: Props
) {
  const displayValue = (
    value: string | null | undefined
  ) => {
    return value && value.trim() !== ""
      ? value
      : "NA";
  };

  const displayMultiple = (
    values: string[]
  ) => {
    return values.length > 0
      ? values.join(", ")
      : "NA";
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

    return `${month}/${day}/${value.getFullYear()}`;
  };

  const formatTime = (
    value: Date | null
  ) => {
    if (!value) {
      return "00:00";
    }

    return value.toTimeString().slice(0, 5);
  };

  if (props.caseSubmitted) {
    return (
      <View style={styles.successContainer}>
        <View
          style={
            styles.successIconContainer
          }
        >
          <View
            style={styles.successDocument}
          >
            <View
              style={styles.documentLine}
            />
            <View
              style={styles.documentLine}
            />
            <View
              style={styles.documentLine}
            />
          </View>

          <View
            style={styles.successCheckCircle}
          >
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
          Thank you. We'll review
          and contact{"\n"}
          you soon.
        </Text>

        <TouchableOpacity
          style={
            styles.submitAnotherButton
          }
          onPress={props.onSubmitAnother}
        >
          <Text
            style={
              styles.submitAnotherText
            }
          >
            Submit Another Case
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={props.onBack}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
        style={styles.contentScroll}
      >
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>
            3. Review & Confirm
          </Text>

          <ReviewCard
            title="Case Details"
            open={props.caseDetailsOpen}
            onPress={() =>
              props.setCaseDetailsOpen(
                !props.caseDetailsOpen
              )
            }
          >
            <View
              style={styles.detailsGrid}
            >
              <Detail
                label="Patient ID"
                value={props.patientId}
              />

              <Detail
                label="Patient Name"
                value={props.patientName}
              />

              <Detail
                label="Gender"
                value={
                  props.gender ||
                  "Not selected"
                }
              />

              <Detail
                label="Age"
                value={props.age}
              />

              <Detail
                label="Next Appointment"
                value={formatDate(props.date)}
              />

              <Detail
                label="Appointment Time"
                value={formatTime(props.time)}
              />

              <Detail
                label="Delivery Deadline"
                value={formatDate(
                  props.deliveryDate
                )}
              />

              <View
                style={
                  styles.detailItemFull
                }
              >
                <Text
                  style={styles.detailLabel}
                >
                  Case Stage
                </Text>

                <Text
                  style={styles.detailValue}
                >
                  {displayMultiple(
                    props.caseStages
                  )}
                </Text>
              </View>
            </View>
          </ReviewCard>

          <ReviewCard
            title="Shade Instructions"
            open={props.shadeOpen}
            onPress={() =>
              props.setShadeOpen(
                !props.shadeOpen
              )
            }
          >
            <ReviewRow
              label="Surface Texture"
              value={displayMultiple(
                props.surfaceTexture
              )}
            />

            <ReviewRow
              label="Glazed Polish"
              value={displayMultiple(
                props.glazedPolish
              )}
            />

            <ReviewRow
              label="Incisal Translucency"
              value={displayMultiple(
                props.incisalTranslucency
              )}
            />

            <ReviewRow
              label="Prepared Tooth Shade"
              value={displayMultiple(
                props.preparedToothShade
              )}
            />

            <ReviewRow
              label="Shade Guide Color"
              value={displayValue(
                props.shadeInstructions
              )}
            />

            <ReviewRow
              label="Material Type"
              value={displayMultiple(
                props.materialTypes
              )}
            />

            <ReviewRow
              label="Crown & Bridge"
              value={displayMultiple(
                props.crownBridgeTypes
              )}
            />
          </ReviewCard>

          <ReviewCard
            title="Implant Instructions"
            open={props.reviewImplantOpen}
            onPress={() =>
              props.setReviewImplantOpen(
                !props.reviewImplantOpen
              )
            }
          >
            {props.implantTable.map(
              (row, index) => (
                <View
                  key={index}
                  style={
                    styles.implantReviewRow
                  }
                >
                  {row.map(
                    (
                      value,
                      column
                    ) => (
                      <Text
                        key={column}
                        style={
                          styles.implantReviewValue
                        }
                      >
                        {value || "NA"}
                      </Text>
                    )
                  )}
                </View>
              )
            )}

            <ReviewRow
              label="Additional Restorations"
              value={displayMultiple(
                props.additionalRestorations
              )}
            />

            <ReviewRow
              label="Design Preview"
              value={
                props.designPreview
                  ? "Request a Design Preview Before Production"
                  : "NA"
              }
            />

            <ReviewRow
              label="Additional Instructions"
              value={displayValue(
                props.implantInstructions
              )}
            />
          </ReviewCard>

          <ReviewCard
            title="Case Document"
            open={props.caseDocumentOpen}
            onPress={() =>
              props.setCaseDocumentOpen(
                !props.caseDocumentOpen
              )
            }
          >
            <Text
              style={styles.fileReviewName}
            >
              {props.caseDocument?.name ||
                "NA"}
            </Text>
          </ReviewCard>

          <ReviewCard
            title="Digital Files"
            open={props.digitalFilesOpen}
            onPress={() =>
              props.setDigitalFilesOpen(
                !props.digitalFilesOpen
              )
            }
          >
            {props.uploadedFiles.length >
              0 ? (
              props.uploadedFiles.map(
                (file, index) => (
                  <View
                    key={`${file.uri}-${index}`}
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
                    >
                      {file.name}
                    </Text>
                  </View>
                )
              )
            ) : (
              <Text style={styles.naText}>
                NA
              </Text>
            )}
          </ReviewCard>

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
                contact points and natural
                anatomical contours. Match
                shade with adjacent teeth.
                Check and adjust occlusion
                carefully before finalizing.
                Kindly send design preview
                before proceeding to
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
                props.confirmDigitalMedical
              }
              text="I confirm that all uploaded files are digital medical files and comply with applicable medical data regulations (GDPR)."
              onPress={() => {
                props.setConfirmDigitalMedical(
                  !props.confirmDigitalMedical
                );
                props.setGdprError("");
              }}
              error={props.gdprError}
            />

            <Confirmation
              checked={props.confirmGdpr}
              text="I have reviewed, understood and accept the Data Processing & Confidentiality Agreement."
              onPress={() => {
                props.setConfirmGdpr(
                  !props.confirmGdpr
                );
                props.setAgreementError("");
              }}
              error={props.agreementError}
            />

            <Confirmation
              checked={
                props.confirmCaseInstructions
              }
              text="I confirm that the patient has consented to sending these medical files (scans, photos) to the lab."
              onPress={() => {
                props.setConfirmCaseInstructions(
                  !props.confirmCaseInstructions
                );
                props.setConsentError("");
              }}
              error={props.consentError}
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
              onPress={props.onBack}
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
              style={styles.submitButton}
              onPress={props.onSubmit}
              disabled={props.submitting}
            >
              <Text
                style={
                  styles.submitButtonText
                }
              >
                {props.submitting
                  ? "Submitting..."
                  : "Submit Case"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ReviewCard({
  title,
  open,
  onPress,
  children,
}: {
  title: string;
  open: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.reviewCard}>
      <TouchableOpacity
        style={styles.reviewCardHeader}
        onPress={onPress}
      >
        <Text
          style={styles.reviewCardTitle}
        >
          {title}
        </Text>

        <Ionicons
          name={
            open
              ? "chevron-up"
              : "chevron-down"
          }
          size={20}
          color="#1F2937"
        />
      </TouchableOpacity>

      {open && (
        <View
          style={styles.reviewCardBody}
        >
          {children}
        </View>
      )}
    </View>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={styles.reviewDetailRow}
    >
      <Text
        style={styles.reviewDetailLabel}
      >
        {label}
      </Text>

      <Text
        style={styles.reviewDetailValue}
      >
        {value}
      </Text>
    </View>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value || "NA"}
      </Text>
    </View>
  );
}

function Confirmation({
  checked,
  text,
  onPress,
  error,
}: {
  checked: boolean;
  text: string;
  onPress: () => void;
  error: string;
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.confirmationRow}
        onPress={onPress}
      >
        <Ionicons
          name={
            checked
              ? "checkbox"
              : "square-outline"
          }
          size={20}
          color={
            checked
              ? "#1677FF"
              : "#B8C0CC"
          }
        />

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
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },

  contentScroll: {
    flex: 1,
  },

  container: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 5,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#021E48",
  },

  stepText: {
    fontSize: 14,
    color: "#6B7280",
  },

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

  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#D1D5DB",
  },

  activeLine: {
    backgroundColor: "#0152A8",
  },

  reviewContainer: {
    paddingHorizontal: 16,
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
    borderColor: "#E1E6ED",
    marginBottom: 10,
    overflow: "hidden",
  },

  reviewCardHeader: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  reviewCardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  detailItem: {
    width: "48%",
    marginBottom: 14,
  },

  detailItemFull: {
    width: "100%",
  },

  detailLabel: {
    fontSize: 11,
    color: "#7B8494",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },

  reviewDetailRow: {
    marginBottom: 12,
  },

  reviewDetailLabel: {
    fontSize: 11,
    color: "#7B8494",
    marginBottom: 4,
  },

  reviewDetailValue: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },

  implantReviewRow: {
    backgroundColor: "#F7F9FC",
    borderRadius: 6,
    padding: 8,
    marginBottom: 7,
  },

  implantReviewValue: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 3,
  },

  fileReviewRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E6ED",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 7,
  },

  fileReviewName: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
    marginLeft: 8,
  },

  naText: {
    color: "#7B8494",
    fontSize: 13,
  },

  additionalInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E6ED",
    padding: 14,
    marginBottom: 10,
  },

  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  additionalInfoBox: {
    flexDirection: "row",
    backgroundColor: "#F2F7FC",
    borderRadius: 6,
    padding: 10,
  },

  additionalInfoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: "#4B5563",
    marginLeft: 8,
  },

  confirmationSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E6ED",
    padding: 14,
    marginBottom: 10,
  },

  confirmationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  confirmationText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
    marginLeft: 8,
  },

  confirmationError: {
    color: "#FF3B30",
    fontSize: 12,
    marginLeft: 28,
    marginBottom: 10,
  },

  reviewButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  reviewBackButton: {
    width: "35%",
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  reviewBackText: {
    color: "#0152A8",
    fontWeight: "600",
  },

  submitButton: {
    width: "55%",
    height: 48,
    borderRadius: 6,
    backgroundColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  successIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  successDocument: {
    width: 42,
    height: 52,
    borderWidth: 2,
    borderColor: "#0152A8",
    borderRadius: 5,
    padding: 8,
    justifyContent: "space-between",
  },

  documentLine: {
    height: 3,
    backgroundColor: "#0152A8",
  },

  successCheckCircle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#021E48",
    textAlign: "center",
    marginBottom: 10,
  },

  successMessage: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
  },

  submitAnotherButton: {
    width: "80%",
    height: 48,
    borderRadius: 7,
    backgroundColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  submitAnotherText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});