import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UpdateCaseHeaderProps {
  currentStep: 1 | 2 | 3;
  onBack?: () => void;
}

export default function UpdateCaseHeader({
  currentStep,
  onBack,
}: UpdateCaseHeaderProps) {
  return (
    <View style={styles.container}>

      {/* =====================================
                HEADER
            ===================================== */}

      <View style={styles.header}>

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#021E48"
          />
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>
          Update Case
        </Text>

        {/* STEP */}

        <Text style={styles.stepText}>
          {currentStep} of 3
        </Text>

      </View>

      {/* =====================================
                PROGRESS BAR
            ===================================== */}

      <View style={styles.progressContainer}>

        {/* STEP 1 */}

        <View
          style={[
            styles.circle,
            currentStep >= 1 &&
            styles.activeCircle,
          ]}
        />

        {/* LINE 1 */}

        <View
          style={[
            styles.line,
            currentStep >= 2 &&
            styles.activeLine,
          ]}
        />

        {/* STEP 2 */}

        <View
          style={[
            styles.circle,
            currentStep >= 2 &&
            styles.activeCircle,
          ]}
        />

        {/* LINE 2 */}

        <View
          style={[
            styles.line,
            currentStep >= 3 &&
            styles.activeLine,
          ]}
        />

        {/* STEP 3 */}

        <View
          style={[
            styles.circle,
            currentStep >= 3 &&
            styles.activeCircle,
          ]}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 14,

    /*
     * Keep the header above the
     * scrollable content.
     */
    zIndex: 10,

    elevation: 4,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    color: "#0052A8",
  },

  stepText: {
    width: 40,
    textAlign: "right",
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 5,
  },

  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D1D5DB",
  },

  activeCircle: {
    backgroundColor: "#0152A8",
  },

  line: {
    flex: 1,
    height: 3,
    marginHorizontal: 3,
    backgroundColor: "#D1D5DB",
  },

  activeLine: {
    backgroundColor: "#0152A8",
  },

});