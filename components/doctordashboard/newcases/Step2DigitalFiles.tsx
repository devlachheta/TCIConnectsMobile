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

  step2Error: string;

  setStep2Error: (
    value: string
  ) => void;

  selectTestFile: () => Promise<void>;

  onBack: () => void;

  onNext: () => void;
};

export default function Step2DigitalFiles(
  props: Props
) {
  const removeFile = (
    index: number
  ) => {
    props.setUploadedFiles(
      (previous) =>
        previous.filter(
          (_, fileIndex) =>
            fileIndex !== index
        )
    );

    props.setStep2Error("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={
            props.onBack
          }
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

      {/* PROGRESS */}

      <View
        style={
          styles.progressContainer
        }
      >

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
          style={
            styles.progressLine
          }
        />

        <View
          style={
            styles.inactiveCircle
          }
        />

      </View>

      {/* CARD */}

      <View
        style={
          styles.uploadCard
        }
      >

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
          Accepted formats: STL,
          OBJ, ZIP, JPG, JPEG, PNG
        </Text>

        {/* CHOOSE */}

        <TouchableOpacity
          style={
            styles.chooseFilesRow
          }
          onPress={
            props.selectTestFile
          }
          activeOpacity={0.7}
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
              ? `${props.uploadedFiles.length} file${props.uploadedFiles.length >
                1
                ? "s"
                : ""
              } selected`
              : "No file chosen"}
          </Text>

        </TouchableOpacity>

        {/* FILE LIST */}

        {props.uploadedFiles.map(
          (
            file,
            index
          ) => (
            <View
              key={`${file.uri}-${index}`}
              style={
                styles.selectedFileRow
              }
            >

              <View
                style={
                  styles.fileInfo
                }
              >

                <Ionicons
                  name="document-outline"
                  size={18}
                  color="#0152A8"
                />

                <Text
                  style={
                    styles.selectedFileName
                  }
                  numberOfLines={1}
                >
                  {
                    file.name
                  }
                </Text>

              </View>

              <TouchableOpacity
                style={
                  styles.removeFileButton
                }
                onPress={() =>
                  removeFile(
                    index
                  )
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
          )
        )}

        {props.step2Error !== "" && (
          <Text
            style={
              styles.errorText
            }
          >
            {
              props.step2Error
            }
          </Text>
        )}

        {/* DROP AREA */}

        <TouchableOpacity
          style={
            styles.uploadDropArea
          }
          onPress={
            props.selectTestFile
          }
          activeOpacity={0.7}
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

        {/* BUTTONS */}

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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },

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

  inactiveCircle: {
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

  selectedFileRow: {
    minHeight: 48,
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  selectedFileName: {
    flex: 1,
    marginLeft: 8,
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
    justifyContent: "space-between",
    marginTop: 145,
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