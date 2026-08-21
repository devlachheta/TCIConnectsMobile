import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import UpdateCaseHeader from "./UpdateCaseHeader";

type EditStep1Props = {
  patientName: string;
  patientId: string;
  age: string;
  gender: string;

  date: Date | null;
  time: Date | null;
  deliveryDate: Date | null;

  shadeInstructions: string;
  implantInstructions: string;

  surfaceTexture: string[];
  glazedPolish: string[];
  incisalTranslucency: string[];
  preparedToothShade: string[];

  materialTypes: string[];
  crownBridgeTypes: string[];
  caseStages: string[];
  additionalRestorations: string[];

  designPreview: boolean;
  onDesignPreviewChange: (value: boolean) => void;

  implantTable: string[][];

  caseDocument:
  | DocumentPicker.DocumentPickerAsset
  | null;

  step1Error: string;

  onPatientNameChange: (value: string) => void;
  onPatientIdChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: string) => void;

  onDateChange: (value: Date | null) => void;
  onTimeChange: (value: Date | null) => void;
  onDeliveryDateChange: (value: Date | null) => void;

  onShadeInstructionsChange: (value: string) => void;
  onImplantInstructionsChange: (value: string) => void;

  toggleSurfaceTexture: (value: string) => void;
  toggleGlazedPolish: (value: string) => void;
  toggleIncisalTranslucency: (value: string) => void;
  togglePreparedToothShade: (value: string) => void;
  toggleMaterialType: (value: string) => void;
  toggleCrownBridgeType: (value: string) => void;
  toggleCaseStage: (value: string) => void;
  toggleAdditionalRestoration: (value: string) => void;

  updateImplantCell: (
    rowIndex: number,
    columnIndex: number,
    value: string
  ) => void;

  onSelectCaseDocument: () => void;
  onRemoveCaseDocument: () => void;

  onNext: () => void;
  onBack: () => void;
};

export default function EditStep1({
  patientName,
  patientId,
  age,
  gender,
  date,
  time,
  deliveryDate,
  shadeInstructions,
  implantInstructions,
  surfaceTexture,
  glazedPolish,
  incisalTranslucency,
  preparedToothShade,
  materialTypes,
  crownBridgeTypes,
  caseStages,
  additionalRestorations,
  designPreview,
  onDesignPreviewChange,
  implantTable,
  caseDocument,
  step1Error,
  onPatientNameChange,
  onPatientIdChange,
  onAgeChange,
  onGenderChange,
  onDateChange,
  onTimeChange,
  onDeliveryDateChange,
  onShadeInstructionsChange,
  onImplantInstructionsChange,
  toggleSurfaceTexture,
  toggleGlazedPolish,
  toggleIncisalTranslucency,
  togglePreparedToothShade,
  toggleMaterialType,
  toggleCrownBridgeType,
  toggleCaseStage,
  toggleAdditionalRestoration,
  updateImplantCell,
  onSelectCaseDocument,
  onRemoveCaseDocument,
  onNext,
  onBack,
}: EditStep1Props) {
  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const [showDeliveryPicker, setShowDeliveryPicker] =
    useState(false);

  const [shadeOpen, setShadeOpen] =
    useState(false);

  const [implantOpen, setImplantOpen] =
    useState(false);

  const parseDisplayDate = (
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

    const year = value.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const parseDisplayTime = (
    value: Date | null
  ) => {
    if (!value) {
      return "00:00";
    }

    const hours = String(
      value.getHours()
    ).padStart(2, "0");

    const minutes = String(
      value.getMinutes()
    ).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const Checkbox = ({
    checked,
    label,
    onPress,
  }: {
    checked: boolean;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
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
            : "#D1D5DB"
        }
      />

      <Text style={styles.optionText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pageContainer}>
      <UpdateCaseHeader
        currentStep={1}
        onBack={onBack}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={
                styles.cardTitleContainer
              }
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#0152A8"
              />

              <Text
                style={styles.cardTitle}
              >
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
            value={patientName}
            onChangeText={
              onPatientNameChange
            }
          />

          {step1Error !== "" && (
            <Text style={styles.errorText}>
              {step1Error}
            </Text>
          )}

          <Text style={styles.label}>
            Patient ID
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter patient ID"
            value={patientId}
            onChangeText={
              onPatientIdChange
            }
          />

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
                <Text
                  style={
                    styles.placeholder
                  }
                >
                  {parseDisplayDate(date)}
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
                <Text
                  style={
                    styles.placeholder
                  }
                >
                  {parseDisplayTime(time)}
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
            <Text
              style={styles.placeholder}
            >
              {parseDisplayDate(
                deliveryDate
              )}
            </Text>
          </Pressable>

          <View style={styles.row}>
            <View
              style={styles.ageContainer}
            >
              <Text style={styles.label}>
                Age
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Years"
                keyboardType="numeric"
                value={age}
                onChangeText={
                  onAgeChange
                }
              />
            </View>

            <View
              style={styles.genderSection}
            >
              <Text style={styles.label}>
                Gender
              </Text>

              <View
                style={styles.genderRow}
              >
                <TouchableOpacity
                  style={
                    styles.genderOption
                  }
                  onPress={() =>
                    onGenderChange(
                      "Male"
                    )
                  }
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

                  <Text
                    style={
                      styles.genderLabel
                    }
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.genderOption
                  }
                  onPress={() =>
                    onGenderChange(
                      "Female"
                    )
                  }
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

                  <Text
                    style={
                      styles.genderLabel
                    }
                  >
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
            <Checkbox
              key={item}
              checked={caseStages.includes(
                item
              )}
              label={item}
              onPress={() =>
                toggleCaseStage(item)
              }
            />
          ))}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(
              _event,
              selectedDate
            ) => {
              setShowDatePicker(false);

              if (selectedDate) {
                onDateChange(
                  selectedDate
                );
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display="default"
            onChange={(
              _event,
              selectedTime
            ) => {
              setShowTimePicker(false);

              if (selectedTime) {
                onTimeChange(
                  selectedTime
                );
              }
            }}
          />
        )}

        {showDeliveryPicker && (
          <DateTimePicker
            value={
              deliveryDate ||
              new Date()
            }
            mode="date"
            display="default"
            onChange={(
              _event,
              selectedDate
            ) => {
              setShowDeliveryPicker(
                false
              );

              if (selectedDate) {
                onDeliveryDateChange(
                  selectedDate
                );
              }
            }}
          />
        )}

        <View
          style={styles.bottomSection}
        >
          <TouchableOpacity
            style={
              styles.accordionCard
            }
            onPress={() =>
              setShadeOpen(
                !shadeOpen
              )
            }
          >
            <View
              style={
                styles.accordionLeft
              }
            >
              <Ionicons
                name="color-palette-outline"
                size={24}
                color="#1F2937"
              />

              <Text
                style={
                  styles.accordionTitle
                }
              >
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

          {shadeOpen && (
            <View
              style={
                styles.shadeContainer
              }
            >
              <View
                style={styles.shadeRow}
              >
                <View
                  style={
                    styles.shadeColumn
                  }
                >
                  <Text
                    style={
                      styles.shadeLabel
                    }
                  >
                    Surface Texture
                  </Text>

                  <View
                    style={
                      styles.optionWrap
                    }
                  >
                    {[
                      "Smooth",
                      "Moderate",
                      "Heavy",
                    ].map((item) => (
                      <Checkbox
                        key={item}
                        checked={surfaceTexture.includes(
                          item
                        )}
                        label={item}
                        onPress={() =>
                          toggleSurfaceTexture(
                            item
                          )
                        }
                      />
                    ))}
                  </View>
                </View>

                <View
                  style={
                    styles.shadeColumn
                  }
                >
                  <Text
                    style={
                      styles.shadeLabel
                    }
                  >
                    Glazed Polish
                  </Text>

                  <View
                    style={
                      styles.optionWrap
                    }
                  >
                    {[
                      "High",
                      "Moderate",
                      "Light",
                    ].map((item) => (
                      <Checkbox
                        key={item}
                        checked={glazedPolish.includes(
                          item
                        )}
                        label={item}
                        onPress={() =>
                          toggleGlazedPolish(
                            item
                          )
                        }
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View
                style={styles.shadeRow}
              >
                <View
                  style={
                    styles.shadeColumn
                  }
                >
                  <Text
                    style={
                      styles.shadeLabel
                    }
                  >
                    Incisal Translucency
                  </Text>

                  <View
                    style={
                      styles.optionWrap
                    }
                  >
                    {[
                      "None",
                      "0.5mm",
                      "1mm",
                      "Maximum 1.5mm",
                    ].map((item) => (
                      <Checkbox
                        key={item}
                        checked={incisalTranslucency.includes(
                          item
                        )}
                        label={item}
                        onPress={() =>
                          toggleIncisalTranslucency(
                            item
                          )
                        }
                      />
                    ))}
                  </View>
                </View>

                <View
                  style={
                    styles.shadeColumn
                  }
                >
                  <Text
                    style={
                      styles.shadeLabel
                    }
                  >
                    Prepared Tooth Shade
                  </Text>

                  <View
                    style={
                      styles.optionWrap
                    }
                  >
                    {[
                      "Grey Discolored",
                      "Natural",
                    ].map((item) => (
                      <Checkbox
                        key={item}
                        checked={preparedToothShade.includes(
                          item
                        )}
                        label={item}
                        onPress={() =>
                          togglePreparedToothShade(
                            item
                          )
                        }
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Text
                style={
                  styles.shadeLabel
                }
              >
                Shade Guide Color
              </Text>

              <TextInput
                style={
                  styles.shadeInput
                }
                placeholder="Enter shade guide color"
                value={shadeInstructions}
                onChangeText={
                  onShadeInstructionsChange
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

              <View
                style={
                  styles.materialGrid
                }
              >
                {[
                  "TITAN",
                  "Nickel-Chrome",
                  "Zirconia",
                  "PMMA",
                  "Multilayer Zirconia Katana",
                  "Chrome-Cobalt Kera CAD/CAM",
                ].map((item) => (
                  <Checkbox
                    key={item}
                    checked={materialTypes.includes(
                      item
                    )}
                    label={item}
                    onPress={() =>
                      toggleMaterialType(
                        item
                      )
                    }
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.shadeLabel,
                  styles.sectionSpacing,
                ]}
              >
                Crown & Bridge Instructions
              </Text>

              <View
                style={
                  styles.materialGrid
                }
              >
                {[
                  "Crown",
                  "Inlay/Onlay",
                  "Bridge",
                  "Post & Core",
                  "Full Contour Crown",
                  "Veneer",
                ].map((item) => (
                  <Checkbox
                    key={item}
                    checked={crownBridgeTypes.includes(
                      item
                    )}
                    label={item}
                    onPress={() =>
                      toggleCrownBridgeType(
                        item
                      )
                    }
                  />
                ))}
              </View>
            </View>
          )}

          <View
            style={
              styles.accordionCard
            }
          >
            <View
              style={
                styles.accordionLeft
              }
            >
              <Ionicons
                name="medical-outline"
                size={24}
                color="#1F2937"
              />

              <Text
                style={
                  styles.accordionTitle
                }
              >
                Implant Instructions
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setImplantOpen(
                  !implantOpen
                )
              }
            >
              <Ionicons
                name={
                  implantOpen
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color="#1F2937"
              />
            </TouchableOpacity>
          </View>

          {implantOpen && (
            <View
              style={
                styles.implantContainer
              }
            >
              <Text
                style={
                  styles.implantHeading
                }
              >
                Implant Information
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  true
                }
                nestedScrollEnabled
              >
                <View
                  style={
                    styles.implantTable
                  }
                >
                  <View
                    style={
                      styles.implantColumnRow
                    }
                  >
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

                  {implantTable.map(
                    (
                      row,
                      rowIndex
                    ) => (
                      <View
                        key={rowIndex}
                        style={
                          styles.implantDataRow
                        }
                      >
                        {row.map(
                          (
                            value,
                            columnIndex
                          ) => (
                            <TextInput
                              key={
                                columnIndex
                              }
                              style={
                                styles.implantInput
                              }
                              value={value}
                              onChangeText={(
                                text
                              ) =>
                                updateImplantCell(
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
                style={
                  styles.implantSectionTitle
                }
              >
                Additional Restorations
              </Text>

              {[
                "Bleaching Tray",
                "P.E.I",
                "Transparent Night Guard Soft / Hard Dual",
                "Full Arch Printed Master Model",
              ].map((item) => (
                <Checkbox
                  key={item}
                  checked={additionalRestorations.includes(
                    item
                  )}
                  label={item}
                  onPress={() =>
                    toggleAdditionalRestoration(
                      item
                    )
                  }
                />
              ))}

              <Text
                style={[
                  styles.implantSectionTitle,
                  styles.implantSpacing,
                ]}
              >
                Design Preview
              </Text>

              <Checkbox
                checked={designPreview}
                label="Request a Design Preview Before Production"
                onPress={() =>
                  onDesignPreviewChange(
                    !designPreview
                  )
                }
              />

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
                value={
                  implantInstructions
                }
                onChangeText={
                  onImplantInstructionsChange
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
                style={
                  styles.fileInput
                }
                onPress={
                  onSelectCaseDocument
                }
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
                  style={
                    styles.noFileText
                  }
                  numberOfLines={1}
                >
                  {caseDocument?.name ||
                    "No file chosen"}
                </Text>
              </TouchableOpacity>

              {caseDocument && (
                <View
                  style={
                    styles.selectedFileRow
                  }
                >
                  <Text
                    style={
                      styles.selectedFileName
                    }
                    numberOfLines={1}
                  >
                    {caseDocument.name}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.removeFileButton
                    }
                    onPress={
                      onRemoveCaseDocument
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

          <View
            style={styles.buttonRow}
          >
            <TouchableOpacity
              style={
                styles.backButton
              }
              onPress={onBack}
            >
              <Text
                style={styles.backText}
              >
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.nextButton
              }
              onPress={onNext}
            >
              <Text
                style={styles.nextText}
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
    color: "#021E48",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
    color: "#374151",
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
    marginTop: 10,
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

  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginRight: 14,
  },

  optionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#374151",
  },

  errorText: {
    color: "#DC2626",
    marginBottom: 12,
    fontSize: 13,
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
    marginBottom: 20,
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
  },

  shadeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#374151",
  },

  sectionSpacing: {
    marginTop: 28,
  },

  materialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    marginTop: 20,
    marginBottom: 10,
  },

  implantSpacing: {
    marginTop: 24,
  },

  designPreviewText: {
    fontSize: 14,
    color: "#374151",
  },

  additionalInstructionsInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    color: "#374151",
  },

  fileInput: {
    height: 48,
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
    backgroundColor: "#F5F6F8",
    borderRightWidth: 1,
    borderRightColor: "#D9D9D9",
  },

  chooseFileText: {
    fontSize: 14,
    color: "#374151",
  },

  noFileText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
  },

  selectedFileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F7F9FC",
    borderRadius: 8,
  },

  selectedFileName: {
    flex: 1,
    color: "#374151",
  },

  removeFileButton: {
    marginLeft: 10,
  },

  removeFileText: {
    color: "#DC2626",
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
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
  },

  nextText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});