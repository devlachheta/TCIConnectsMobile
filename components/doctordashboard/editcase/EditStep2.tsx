import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import UpdateCaseHeader from "./UpdateCaseHeader";

interface EditStep2Props {
  uploadedFiles: DocumentPicker.DocumentPickerAsset[];

  existingFiles: any[];

  step2Error: string;

  onSelectFiles: () => void;

  onRemoveFile: (index: number) => void;

  onRemoveExistingFile: (file: any) => void;

  onBack: () => void;

  onNext: () => void;
}

export default function EditStep2({
  uploadedFiles,
  existingFiles,
  step2Error,
  onSelectFiles,
  onRemoveFile,
  onRemoveExistingFile,
  onBack,
  onNext,
}: EditStep2Props) {

  /*
   * Existing files already saved in the database.
   *
   * Only digital files should appear on Step 2.
   *
   * The Case PDF is handled separately in Step 1.
   */
  const existingDigitalFiles =
    (existingFiles || []).filter(
      (file: any) =>
        file.file_category ===
        "digital_file"
    );

  /*
   * Total number of digital files currently
   * attached to the case.
   */
  const totalFiles =
    existingDigitalFiles.length +
    uploadedFiles.length;

  return (
    <View style={styles.container}>

      {/* =================================================
                FIXED UPDATE CASE HEADER
                ================================================= */}

      <UpdateCaseHeader
        currentStep={2}
        onBack={onBack}
      />

      {/* =================================================
                ONLY THIS SECTION SCROLLS
                ================================================= */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >

        {/* =================================================
                    MAIN CARD
                    ================================================= */}

        <View
          style={styles.uploadCard}
        >

          {/* =============================================
                        TITLE
                        ============================================= */}

          <View
            style={
              styles.uploadTitleRow
            }
          >

            <Text
              style={
                styles.uploadTitle
              }
            >
              2. Upload Digital Files
              {" "}
              (Max 5)
            </Text>

            <Text
              style={
                styles.requiredStar
              }
            >
              *
            </Text>

          </View>

          <Text
            style={
              styles.acceptedFormats
            }
          >
            • Accepted formats:
            {" "}

            <Text
              style={
                styles.formatBold
              }
            >
              STL, OBJ, ZIP,
              JPG, JPEG, PNG
            </Text>
          </Text>

          {/* =============================================
                        CHOOSE FILES
                        ============================================= */}

          <TouchableOpacity
            style={
              styles.chooseFilesRow
            }
            activeOpacity={0.7}
            onPress={
              onSelectFiles
            }
          >

            <View
              style={
                styles.chooseFilesButton
              }
            >

              <Text
                style={
                  styles.chooseFilesText
                }
              >
                Choose Files
              </Text>

            </View>

            <Text
              style={
                styles.noFileChosenText
              }
              numberOfLines={1}
            >
              {totalFiles > 0
                ? `${totalFiles} file${totalFiles !== 1
                  ? "s"
                  : ""
                } selected`
                : "No file chosen"}
            </Text>

          </TouchableOpacity>

          {/* =============================================
                        ERROR
                        ============================================= */}

          {step2Error !== "" && (

            <Text
              style={
                styles.errorText
              }
            >
              {step2Error}
            </Text>

          )}

          {/* =============================================
                        EXISTING DIGITAL FILES
                        ============================================= */}

          {existingDigitalFiles.length >
            0 && (

              <View
                style={
                  styles.filesSection
                }
              >

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Existing Digital Files
                </Text>

                {existingDigitalFiles.map(
                  (
                    file: any,
                    index: number
                  ) => (

                    <View
                      key={
                        file.id ||
                        `existing-${index}`
                      }
                      style={
                        styles.fileRow
                      }
                    >

                      {/* FILE ICON */}

                      <View
                        style={
                          styles.fileIconContainer
                        }
                      >

                        <Ionicons
                          name="document-outline"
                          size={20}
                          color="#0152A8"
                        />

                      </View>

                      {/* FILE NAME */}

                      <Text
                        style={
                          styles.fileName
                        }
                        numberOfLines={1}
                      >
                        {
                          file.file_name ||
                          "Digital file"
                        }
                      </Text>

                      {/* REMOVE */}

                      <TouchableOpacity
                        style={
                          styles.removeButton
                        }
                        activeOpacity={
                          0.8
                        }
                        onPress={() =>
                          onRemoveExistingFile(
                            file
                          )
                        }
                      >

                        <Text
                          style={
                            styles.removeButtonText
                          }
                        >
                          Remove
                        </Text>

                      </TouchableOpacity>

                    </View>

                  )
                )}

              </View>

            )}

          {/* =============================================
                        NEW FILES
                        ============================================= */}

          {uploadedFiles.length >
            0 && (

              <View
                style={
                  styles.filesSection
                }
              >

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  New Files
                </Text>

                {uploadedFiles.map(
                  (
                    file,
                    index
                  ) => (

                    <View
                      key={
                        `${file.name}-${index}`
                      }
                      style={
                        styles.fileRow
                      }
                    >

                      {/* FILE ICON */}

                      <View
                        style={
                          styles.fileIconContainer
                        }
                      >

                        <Ionicons
                          name="document-outline"
                          size={20}
                          color="#0152A8"
                        />

                      </View>

                      {/* FILE NAME */}

                      <Text
                        style={
                          styles.fileName
                        }
                        numberOfLines={1}
                      >
                        {
                          file.name ||
                          "New file"
                        }
                      </Text>

                      {/* REMOVE */}

                      <TouchableOpacity
                        style={
                          styles.removeButton
                        }
                        activeOpacity={
                          0.8
                        }
                        onPress={() =>
                          onRemoveFile(
                            index
                          )
                        }
                      >

                        <Text
                          style={
                            styles.removeButtonText
                          }
                        >
                          Remove
                        </Text>

                      </TouchableOpacity>

                    </View>

                  )
                )}

              </View>

            )}

          {/* =============================================
                        UPLOAD AREA
                        ============================================= */}

          <TouchableOpacity
            style={
              styles.uploadDropArea
            }
            activeOpacity={0.7}
            onPress={
              onSelectFiles
            }
          >

            <Ionicons
              name="cloud-upload-outline"
              size={34}
              color="#7B8494"
            />

            <Text
              style={
                styles.dropTitle
              }
            >
              Drag and drop files
              here
            </Text>

            <Text
              style={
                styles.dropSubtitle
              }
            >
              or tap to browse
            </Text>

          </TouchableOpacity>

          {/* =============================================
                        NAVIGATION BUTTONS
                        ============================================= */}

          <View
            style={
              styles.stepButtonRow
            }
          >

            {/* PREVIOUS */}

            <TouchableOpacity
              style={
                styles.stepBackButton
              }
              activeOpacity={0.8}
              onPress={
                onBack
              }
            >

              <Text
                style={
                  styles.stepBackText
                }
              >
                Previous
              </Text>

            </TouchableOpacity>

            {/* NEXT */}

            <TouchableOpacity
              style={
                styles.stepNextButton
              }
              activeOpacity={0.8}
              onPress={
                onNext
              }
            >

              <Text
                style={
                  styles.stepNextText
                }
              >
                Next
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  // =========================================================
  // PAGE
  // =========================================================

  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },

  // =========================================================
  // MAIN CARD
  // =========================================================

  uploadCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
  },

  // =========================================================
  // TITLE
  // =========================================================

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

  formatBold: {
    fontWeight: "700",
  },

  // =========================================================
  // CHOOSE FILES
  // =========================================================

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
    fontWeight: "500",
  },

  noFileChosenText: {
    flex: 1,
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 10,
    marginRight: 10,
  },

  // =========================================================
  // ERROR
  // =========================================================

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
    marginHorizontal: 8,
  },

  // =========================================================
  // FILE SECTIONS
  // =========================================================

  filesSection: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#021E48",
    marginHorizontal: 8,
    marginBottom: 8,
  },

  // =========================================================
  // FILE ROW
  // =========================================================

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E1E5EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  fileIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 7,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  fileName: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    fontSize: 13,
    color: "#374151",
  },

  // =========================================================
  // REMOVE BUTTON
  // =========================================================

  removeButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
  },

  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // =========================================================
  // UPLOAD AREA
  // =========================================================

  uploadDropArea: {
    height: 112,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#B9C4D3",
    borderRadius: 9,
    marginHorizontal: 8,
    marginTop: 14,
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

  // =========================================================
  // BUTTONS
  // =========================================================

  stepButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
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
    color: "#0152A8",
    fontSize: 16,
    fontWeight: "600",
  },

  stepNextButton: {
    width: "35%",
    height: 48,
    borderRadius: 6,
    backgroundColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  stepNextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

});