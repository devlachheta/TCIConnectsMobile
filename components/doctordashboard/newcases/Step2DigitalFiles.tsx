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
  uploadedFiles:
  DocumentPicker.DocumentPickerAsset[];

  setUploadedFiles: React.Dispatch<
    React.SetStateAction<
      DocumentPicker.DocumentPickerAsset[]
    >
  >;

  uploadProgress: Record<
    string,
    number
  >;

  setUploadProgress: React.Dispatch<
    React.SetStateAction<
      Record<string, number>
    >
  >;

  step2Error: string;

  setStep2Error: (
    value: string
  ) => void;

  selectTestFile: () => Promise<void>;

  removeUploadedFile: (
    uri: string
  ) => void;

  submitting: boolean;

  onBack: () => void;

  onNext: () => void;
};

export default function Step2DigitalFiles(
  props: Props
) {
  const getFileIcon = (
    file: DocumentPicker.DocumentPickerAsset
  ) => {
    if (
      file.mimeType?.startsWith(
        "video/"
      )
    ) {
      return "videocam-outline";
    }

    if (
      file.mimeType?.startsWith(
        "image/"
      )
    ) {
      return "image-outline";
    }

    return "document-outline";
  };

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
          2 of 3
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

        <View style={styles.progressLine} />

        <View
          style={styles.inactiveCircle}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.container
        }
        style={styles.contentScroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.uploadCard}>
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
            Accepted formats: STL, OBJ,
            ZIP, JPG, JPEG, PNG, MP4,
            MOV, AVI, MKV, WEBM
          </Text>

          <TouchableOpacity
            style={
              styles.chooseFilesRow
            }
            onPress={
              props.selectTestFile
            }
            activeOpacity={0.7}
            disabled={
              props.submitting
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
            >
              {props.uploadedFiles
                .length > 0
                ? `${props.uploadedFiles
                  .length
                } file${props.uploadedFiles
                  .length > 1
                  ? "s"
                  : ""
                } selected`
                : "No file chosen"}
            </Text>
          </TouchableOpacity>

          {props.uploadedFiles.map(
            (file, index) => {
              const progress =
                Math.round(
                  props.uploadProgress[
                  file.uri
                  ] ?? 0
                );

              return (
                <View
                  key={`${file.uri}-${index}`}
                  style={
                    styles.selectedFileCard
                  }
                >
                  <View
                    style={
                      styles.fileTopRow
                    }
                  >
                    <View
                      style={
                        styles.fileInfo
                      }
                    >
                      <Ionicons
                        name={
                          getFileIcon(
                            file
                          ) as any
                        }
                        size={22}
                        color="#0152A8"
                      />

                      <Text
                        style={
                          styles.selectedFileName
                        }
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={
                        styles.removeFileButton
                      }
                      onPress={() =>
                        props.removeUploadedFile(
                          file.uri
                        )
                      }
                      disabled={
                        props.submitting
                      }
                    >
                      <Text
                        style={
                          styles.removeFileText
                        }
                      >
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={
                      styles.fileProgressRow
                    }
                  >
                    <View
                      style={
                        styles.fileProgressBackground
                      }
                    >
                      <View
                        style={[
                          styles.fileProgressFill,
                          {
                            width: `${progress}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={
                        styles.fileProgressText
                      }
                    >
                      {progress}%
                    </Text>
                  </View>
                </View>
              );
            }
          )}

          {props.step2Error !== "" && (
            <Text
              style={
                styles.errorText
              }
            >
              {props.step2Error}
            </Text>
          )}

          <TouchableOpacity
            style={
              styles.uploadDropArea
            }
            onPress={
              props.selectTestFile
            }
            activeOpacity={0.7}
            disabled={
              props.submitting
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
              Drag and drop files here
            </Text>

            <Text
              style={
                styles.dropSubtitle
              }
            >
              or tap to browse
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.stepButtonRow
            }
          >
            <TouchableOpacity
              style={
                styles.stepBackButton
              }
              onPress={
                props.onBack
              }
              disabled={
                props.submitting
              }
            >
              <Text
                style={
                  styles.stepBackText
                }
              >
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.stepNextButton
              }
              onPress={
                props.onNext
              }
              disabled={
                props.submitting
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
    justifyContent:
      "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 35,
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
    marginTop: 12,
    marginBottom: 16,
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
    backgroundColor: "#D1D5DB",
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#D1D5DB",
  },

  activeLine: {
    backgroundColor: "#0152A8",
  },

  uploadCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
  },

  uploadTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0152A8",
  },

  requiredStar: {
    color: "#DC2626",
    fontWeight: "700",
    marginLeft: 3,
  },

  acceptedFormats: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 4,
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
  },

  chooseFilesButton: {
    height: "100%",
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#F1F3F5",
    borderRightWidth: 1,
    borderRightColor: "#D9D9D9",
  },

  chooseFilesText: {
    fontSize: 12,
    color: "#1F2937",
  },

  noFileChosenText: {
    marginLeft: 10,
    fontSize: 11,
    color: "#6B7280",
  },

  selectedFileCard: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  fileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  fileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  selectedFileName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#374151",
  },

  removeFileButton: {
    backgroundColor: "#DC3545",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  removeFileText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  fileProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  fileProgressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },

  fileProgressFill: {
    height: "100%",
    backgroundColor: "#0152A8",
    borderRadius: 5,
  },

  fileProgressText: {
    width: 42,
    marginLeft: 8,
    fontSize: 11,
    color: "#374151",
    textAlign: "right",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 10,
  },

  uploadDropArea: {
    height: 112,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#B9C4D3",
    borderRadius: 9,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent:
      "space-between",
    marginTop: 30,
    marginBottom: 20,
  },

  stepBackButton: {
    width: "35%",
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  stepBackText: {
    color: "#0152A8",
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
    fontWeight: "600",
  },
});