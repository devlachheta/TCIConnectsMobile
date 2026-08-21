import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  patientName: string;
  setPatientName: (value: string) => void;
  patientId: string;
  setPatientId: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  date: Date | null;
  setDate: (value: Date | null) => void;
  time: Date | null;
  setTime: (value: Date | null) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (value: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;
  showDeliveryPicker: boolean;
  setShowDeliveryPicker: (value: boolean) => void;
  shadeOpen: boolean;
  setShadeOpen: (value: boolean) => void;
  implantOpen: boolean;
  setImplantOpen: (value: boolean) => void;
  surfaceTexture: string[];
  toggleSurfaceTexture: (value: string) => void;
  glazedPolish: string[];
  toggleGlazedPolish: (value: string) => void;
  incisalTranslucency: string[];
  toggleIncisalTranslucency: (value: string) => void;
  preparedToothShade: string[];
  togglePreparedToothShade: (value: string) => void;
  materialTypes: string[];
  toggleMaterialType: (value: string) => void;
  crownBridgeTypes: string[];
  toggleCrownBridgeType: (value: string) => void;
  caseStages: string[];
  toggleCaseStage: (value: string) => void;
  shadeInstructions: string;
  setShadeInstructions: (value: string) => void;
  implantInstructions: string;
  setImplantInstructions: (value: string) => void;
  additionalRestorations: string[];
  toggleAdditionalRestoration: (value: string) => void;
  designPreview: boolean;
  setDesignPreview: (value: boolean) => void;
  implantTable: string[][];
  updateImplantCell: (
    row: number,
    column: number,
    value: string
  ) => void;
  caseDocument: DocumentPicker.DocumentPickerAsset | null;
  setCaseDocument: (
    value: DocumentPicker.DocumentPickerAsset | null
  ) => void;
  selectCaseDocument: () => Promise<void>;
  step1Error: string;
  onNext: () => void;
  onBack: () => void;
};

export default function Step1CaseDetails(props: Props) {
  const formatDate = (value: Date | null) => {
    if (!value) {
      return "Not provided";
    }

    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${month}/${day}/${value.getFullYear()}`;
  };

  const formatTime = (value: Date | null) => {
    if (!value) {
      return "00:00";
    }

    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
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
          1 of 3
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

        <View style={styles.inactiveCircle} />

        <View style={styles.progressLine} />

        <View style={styles.inactiveCircle} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.contentScroll}
        keyboardShouldPersistTaps="handled"
      >
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

          <Text style={styles.label}>
            Patient Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            value={props.patientName}
            onChangeText={props.setPatientName}
          />

          {props.step1Error !== "" && (
            <Text style={styles.errorText}>
              {props.step1Error}
            </Text>
          )}

          <Text style={styles.label}>
            Patient ID
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter patient ID"
            value={props.patientId}
            onChangeText={props.setPatientId}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>
                Next Appt Date
              </Text>

              <Pressable
                style={styles.input}
                onPress={() =>
                  props.setShowDatePicker(true)
                }
              >
                <Text style={styles.placeholder}>
                  {formatDate(props.date)}
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
                  props.setShowTimePicker(true)
                }
              >
                <Text style={styles.placeholder}>
                  {formatTime(props.time)}
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
              props.setShowDeliveryPicker(true)
            }
          >
            <Text style={styles.placeholder}>
              {formatDate(props.deliveryDate)}
            </Text>
          </Pressable>

          <View style={styles.row}>
            <View style={styles.ageContainer}>
              <Text style={styles.label}>
                Age
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Years"
                keyboardType="numeric"
                value={props.age}
                onChangeText={props.setAge}
              />
            </View>

            <View style={styles.genderSection}>
              <Text style={styles.label}>
                Gender
              </Text>

              <View style={styles.genderRow}>
                {["Male", "Female"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.genderOption}
                    onPress={() =>
                      props.setGender(item)
                    }
                  >
                    <Ionicons
                      name={
                        props.gender === item
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={21}
                      color={
                        props.gender === item
                          ? "#1677FF"
                          : "#C5CCD8"
                      }
                    />

                    <Text style={styles.genderLabel}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
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
              onPress={() =>
                props.toggleCaseStage(item)
              }
            >
              <Ionicons
                name={
                  props.caseStages.includes(item)
                    ? "checkbox"
                    : "square-outline"
                }
                size={24}
                color={
                  props.caseStages.includes(item)
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

        {props.showDatePicker && (
          <DateTimePicker
            value={props.date || new Date()}
            mode="date"
            display="default"
            onChange={(_event, selected) => {
              props.setShowDatePicker(false);

              if (selected) {
                props.setDate(selected);
              }
            }}
          />
        )}

        {props.showTimePicker && (
          <DateTimePicker
            value={props.time || new Date()}
            mode="time"
            display="default"
            onChange={(_event, selected) => {
              props.setShowTimePicker(false);

              if (selected) {
                props.setTime(selected);
              }
            }}
          />
        )}

        {props.showDeliveryPicker && (
          <DateTimePicker
            value={props.deliveryDate || new Date()}
            mode="date"
            display="default"
            onChange={(_event, selected) => {
              props.setShowDeliveryPicker(false);

              if (selected) {
                props.setDeliveryDate(selected);
              }
            }}
          />
        )}

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.accordionCard}
            onPress={() =>
              props.setShadeOpen(!props.shadeOpen)
            }
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
                props.shadeOpen
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={22}
              color="#1F2937"
            />
          </TouchableOpacity>

          {props.shadeOpen && (
            <View style={styles.shadeContainer}>
              <OptionGroup
                title="Surface Texture"
                values={[
                  "Smooth",
                  "Moderate",
                  "Heavy",
                ]}
                selected={props.surfaceTexture}
                toggle={props.toggleSurfaceTexture}
              />

              <OptionGroup
                title="Glazed Polish"
                values={[
                  "High",
                  "Moderate",
                  "Light",
                ]}
                selected={props.glazedPolish}
                toggle={props.toggleGlazedPolish}
              />

              <OptionGroup
                title="Incisal Translucency"
                values={[
                  "None",
                  "0.5mm",
                  "1mm",
                  "Maximum 1.5mm",
                ]}
                selected={props.incisalTranslucency}
                toggle={props.toggleIncisalTranslucency}
              />

              <OptionGroup
                title="Prepared Tooth Shade"
                values={[
                  "Grey Discolored",
                  "Natural",
                ]}
                selected={props.preparedToothShade}
                toggle={props.togglePreparedToothShade}
              />

              <Text style={styles.shadeLabel}>
                Shade Guide Color
              </Text>

              <TextInput
                style={styles.shadeInput}
                placeholder="Enter shade guide color"
                value={props.shadeInstructions}
                onChangeText={
                  props.setShadeInstructions
                }
              />

              <Text
                style={[
                  styles.shadeLabel,
                  styles.sectionSpacing,
                ]}
              >
                Material Type
              </Text>

              <MaterialGrid
                values={[
                  "TITAN",
                  "Nickel-Chrome",
                  "Zirconia",
                  "PMMA",
                  "Multilayer Zirconia Katana",
                  "Chrome-Cobalt Kera CAD/CAM",
                ]}
                selected={props.materialTypes}
                toggle={props.toggleMaterialType}
              />

              <Text
                style={[
                  styles.shadeLabel,
                  styles.sectionSpacing,
                ]}
              >
                Crown & Bridge Instructions
              </Text>

              <MaterialGrid
                values={[
                  "Crown",
                  "Inlay/Onlay",
                  "Bridge",
                  "Post & Core",
                  "Full Contour Crown",
                  "Veneer",
                ]}
                selected={props.crownBridgeTypes}
                toggle={props.toggleCrownBridgeType}
              />
            </View>
          )}

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
              onPress={() =>
                props.setImplantOpen(
                  !props.implantOpen
                )
              }
              style={styles.accordionArrow}
            >
              <Ionicons
                name={
                  props.implantOpen
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="#1F2937"
              />
            </TouchableOpacity>
          </View>

          {props.implantOpen && (
            <View style={styles.implantContainer}>
              <Text style={styles.implantHeading}>
                Implant Information
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
              >
                <View style={styles.implantTable}>
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
                        style={
                          styles.implantHeaderCellSmall
                        }
                      >
                        <Text
                          style={
                            styles.implantHeaderText
                          }
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {props.implantTable.map(
                    (row, rowIndex) => (
                      <View
                        key={rowIndex}
                        style={styles.implantDataRow}
                      >
                        {row.map(
                          (
                            value,
                            columnIndex
                          ) => (
                            <TextInput
                              key={columnIndex}
                              style={
                                styles.implantInput
                              }
                              value={value}
                              onChangeText={(text) =>
                                props.updateImplantCell(
                                  rowIndex,
                                  columnIndex,
                                  text
                                )
                              }
                            />
                          )
                        )}
                      </View>
                    )
                  )}
                </View>
              </ScrollView>

              <Text
                style={styles.implantSectionTitle}
              >
                Additional Restorations
              </Text>

              {[
                "Bleaching Tray",
                "P.E.I",
                "Transparent Night Guard Soft / Hard Dual",
                "Full Arch Printed Master Model",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.implantOption}
                  onPress={() =>
                    props.toggleAdditionalRestoration(
                      item
                    )
                  }
                >
                  <Ionicons
                    name={
                      props.additionalRestorations.includes(
                        item
                      )
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={
                      props.additionalRestorations.includes(
                        item
                      )
                        ? "#1677FF"
                        : "#D1D5DB"
                    }
                  />

                  <Text
                    style={
                      styles.implantOptionText
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}

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
                onPress={() =>
                  props.setDesignPreview(
                    !props.designPreview
                  )
                }
              >
                <Ionicons
                  name={
                    props.designPreview
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color={
                    props.designPreview
                      ? "#1677FF"
                      : "#D1D5DB"
                  }
                />

                <Text
                  style={
                    styles.implantOptionText
                  }
                >
                  Request a Design Preview Before
                  Production
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
                style={
                  styles.additionalInstructionsInput
                }
                multiline
                textAlignVertical="top"
                value={props.implantInstructions}
                onChangeText={
                  props.setImplantInstructions
                }
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
                onPress={props.selectCaseDocument}
              >
                <View
                  style={
                    styles.chooseFileButton
                  }
                >
                  <Text
                    style={
                      styles.chooseFileText
                    }
                  >
                    Choose File
                  </Text>
                </View>

                <Text
                  style={styles.noFileText}
                  numberOfLines={1}
                >
                  {props.caseDocument?.name ||
                    "No file chosen"}
                </Text>
              </TouchableOpacity>

              {props.caseDocument && (
                <View style={styles.selectedFileRow}>
                  <View style={styles.selectedFileInfo}>
                    <Ionicons
                      name={
                        props.caseDocument.mimeType?.startsWith(
                          "video/"
                        )
                          ? "videocam-outline"
                          : props.caseDocument.mimeType?.startsWith(
                            "image/"
                          )
                            ? "image-outline"
                            : "document-outline"
                      }
                      size={20}
                      color="#0152A8"
                    />

                    <Text
                      style={
                        styles.selectedFileName
                      }
                      numberOfLines={1}
                    >
                      {props.caseDocument.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.removeFileButton
                    }
                    onPress={() =>
                      props.setCaseDocument(null)
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
              )}
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={props.onBack}
            >
              <Text style={styles.backText}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={props.onNext}
            >
              <Text style={styles.nextText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function OptionGroup({
  title,
  values,
  selected,
  toggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  toggle: (value: string) => void;
}) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.shadeLabel}>
        {title}
      </Text>

      <View style={styles.optionWrap}>
        {values.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.shadeOption}
            onPress={() => toggle(item)}
          >
            <Ionicons
              name={
                selected.includes(item)
                  ? "checkbox"
                  : "square-outline"
              }
              size={20}
              color={
                selected.includes(item)
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
  );
}

function MaterialGrid({
  values,
  selected,
  toggle,
}: {
  values: string[];
  selected: string[];
  toggle: (value: string) => void;
}) {
  return (
    <View style={styles.materialGrid}>
      {values.map((item) => (
        <TouchableOpacity
          key={item}
          style={styles.materialOption}
          onPress={() => toggle(item)}
        >
          <Ionicons
            name={
              selected.includes(item)
                ? "checkbox"
                : "square-outline"
            }
            size={20}
            color={
              selected.includes(item)
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
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },

  contentScroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  ageContainer: {
    width: "34%",
  },

  genderSection: {
    width: "60%",
  },

  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  genderLabel: {
    marginLeft: 6,
    color: "#374151",
  },

  caseOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  caseText: {
    marginLeft: 10,
    color: "#374151",
    fontSize: 15,
  },

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

  accordionArrow: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  shadeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: -8,
    marginBottom: 8,
    elevation: 2,
  },

  optionGroup: {
    marginBottom: 22,
  },

  shadeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#021E48",
    marginBottom: 12,
  },

  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  shadeOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 12,
  },

  shadeOptionText: {
    marginLeft: 6,
    color: "#374151",
    fontSize: 14,
  },

  shadeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 12,
  },

  sectionSpacing: {
    marginTop: 18,
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
    marginBottom: 14,
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

  implantColumnRow: {
    flexDirection: "row",
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

  implantHeaderText: {
    fontSize: 12,
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

  implantOption: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#374151",
    fontSize: 14,
  },

  noFileText: {
    marginLeft: 12,
    color: "#6B7280",
    flex: 1,
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

  selectedFileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  selectedFileName: {
    flex: 1,
    color: "#374151",
    marginLeft: 8,
  },

  removeFileButton: {
    backgroundColor: "#DC3545",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },

  removeFileText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  },

  nextText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 8,
  },
});