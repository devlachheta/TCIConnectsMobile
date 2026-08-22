import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const QuestionAnswer = () => {
  const navigation = useNavigation();

  const [openOne, setOpenOne] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#021E48"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Questions & Answers
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainHeading}>
          Questions & Answers
        </Text>

        <View style={styles.accordionCard}>
          <TouchableOpacity
            style={[
              styles.questionHeader,
              openOne && styles.questionHeaderOpen,
            ]}
            activeOpacity={0.8}
            onPress={() => setOpenOne(!openOne)}
          >
            <View style={styles.questionLeft}>
              <View style={styles.questionIcon}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#021E48"
                />
              </View>

              <Text style={styles.questionTitle}>
                How do I submit files to the lab?
              </Text>
            </View>

            <Ionicons
              name={
                openOne
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={22}
              color="#021E48"
            />
          </TouchableOpacity>

          {openOne && (
            <View style={styles.answerBody}>
              <Text style={styles.answerTitle}>
                How to Submit Files to the Lab
              </Text>

              <View style={styles.stepBox}>
                <View
                  style={[
                    styles.iconBlock,
                    styles.red,
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={30}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    Complete Rx Form
                  </Text>

                  <Text style={styles.stepText}>
                    Required first. Fill patient info,
                    treatment notes, and submit.
                    {"\n"}
                    File upload is disabled until
                    completed.
                  </Text>
                </View>
              </View>

              <View style={styles.stepBox}>
                <View
                  style={[
                    styles.iconBlock,
                    styles.yellow,
                  ]}
                >
                  <Ionicons
                    name="folder-outline"
                    size={30}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    Prepare Files
                  </Text>

                  <Text style={styles.stepText}>
                    Supported formats: STL, PLY, OBJ,
                    JPEG, PNG.
                    {"\n"}
                    Name files: PatientID_Date
                    {"\n"}
                    (e.g., Patient123_2025-11-09.stl)
                  </Text>
                </View>
              </View>

              <View style={styles.stepBox}>
                <View
                  style={[
                    styles.iconBlock,
                    styles.orange,
                  ]}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={30}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    Upload Files
                  </Text>

                  <Text style={styles.stepText}>
                    Select the completed Rx case,
                    attach files, wait for upload
                    success.
                  </Text>
                </View>
              </View>

              <View style={styles.stepBox}>
                <View
                  style={[
                    styles.iconBlock,
                    styles.white,
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={30}
                    color="#0D2B52"
                  />
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    Accept GDPR Agreement
                  </Text>

                  <Text style={styles.stepText}>
                    Check the box confirming you've
                    read and accepted the Data
                    Processing Agreement.
                  </Text>
                </View>
              </View>

              <View style={styles.stepBox}>
                <View
                  style={[
                    styles.iconBlock,
                    styles.blue,
                  ]}
                >
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    size={30}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    Submit Case
                  </Text>

                  <Text style={styles.stepText}>
                    Click submit to securely send
                    files to the lab.
                  </Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Please submit each case separately to
                  ensure accurate processing and timely
                  delivery. For every patient case, fill
                  out a complete prescription (Rx) form
                  with all relevant details, and upload
                  all related digital files, photos, and
                  documents together in a single
                  submission.
                </Text>

                <Text style={styles.infoText}>
                  Submitting cases individually helps us
                  track each patient's treatment precisely
                  and avoid mix-ups. This also enables our
                  technicians to manufacture restorations
                  according to your specific instructions.
                </Text>

                <Text style={styles.infoTextLast}>
                  Thank you for your cooperation in
                  maintaining the highest quality of care
                  for your patients.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.accordionCard}>
          <TouchableOpacity
            style={[
              styles.questionHeader,
              openTwo && styles.questionHeaderOpen,
            ]}
            activeOpacity={0.8}
            onPress={() => setOpenTwo(!openTwo)}
          >
            <View style={styles.questionLeft}>
              <View style={styles.questionIcon}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#021E48"
                />
              </View>

              <Text style={styles.questionTitle}>
                Why don't you provide large cloud storage
                for my scan files? Where are my files kept?
              </Text>
            </View>

            <Ionicons
              name={
                openTwo
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={22}
              color="#021E48"
            />
          </TouchableOpacity>

          {openTwo && (
            <View style={styles.answerBody}>
              <Text style={styles.answerText}>
                Our platform is designed as a{" "}
                <Text style={styles.bold}>
                  workflow and communication tool
                </Text>
                , not a long-term archive for heavy scan
                files. Large STL/DICOM files are securely
                stored in the{" "}
                <Text style={styles.bold}>
                  lab's cloud
                </Text>
                .
              </Text>

              <Text style={styles.subHeading}>
                Your dashboard stores:
              </Text>

              <View style={styles.simpleList}>
                <Text style={styles.listItem}>
                  • Patient and prescription (Rx)
                  information
                </Text>

                <Text style={styles.listItem}>
                  • Case status and communication with
                  the lab
                </Text>

                <Text style={styles.listItem}>
                  • Light data such as previews or
                  limited photos
                </Text>
              </View>

              <Text style={styles.answerText}>
                Each dentist has a{" "}
                <Text style={styles.bold}>
                  5 GB storage limit
                </Text>{" "}
                to keep the platform fast and efficient.
              </Text>

              <Text style={styles.subHeading}>
                Your main scan archive remains:
              </Text>

              <View style={styles.simpleList}>
                <Text style={styles.listItem}>
                  • Locally in your clinic
                </Text>

                <Text style={styles.listItem}>
                  • In the lab's secure admin cloud
                  with retention policies
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionAnswer;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#021E48",
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },

  mainHeading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#021E48",
    textAlign: "center",
    marginBottom: 22,
  },

  accordionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9DEE5",
  },

  questionHeader: {
    minHeight: 58,
    backgroundColor: "#D5E5FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  questionHeaderOpen: {
    backgroundColor: "#D1E2F8",
  },

  questionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },

  questionIcon: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  questionTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#111827",
  },

  answerBody: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 18,
  },

  answerTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 18,
  },

  stepBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    minHeight: 88,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  iconBlock: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  red: {
    backgroundColor: "#EF5350",
  },

  yellow: {
    backgroundColor: "#F4B63F",
  },

  orange: {
    backgroundColor: "#F28C28",
  },

  blue: {
    backgroundColor: "#39A3E3",
  },

  white: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  stepText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#374151",
  },

  infoBox: {
    backgroundColor: "#E8F4FF",
    borderWidth: 1,
    borderColor: "#BCD CFF".replace(" ", ""),
    borderRadius: 5,
    padding: 14,
    marginTop: 4,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#24577F",
    marginBottom: 12,
  },

  infoTextLast: {
    fontSize: 12,
    lineHeight: 18,
    color: "#24577F",
  },

  answerText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
    marginBottom: 12,
  },

  bold: {
    fontWeight: "700",
    color: "#111827",
  },

  subHeading: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  simpleList: {
    marginBottom: 12,
  },

  listItem: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
    marginBottom: 4,
  },
});