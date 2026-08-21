import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EditSuccessProps {
  onViewCases: () => void;
}

export default function EditSuccess({
  onViewCases,
}: EditSuccessProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.document}>
          <View style={styles.documentLine} />
          <View style={styles.documentLine} />
          <View style={styles.documentLine} />
        </View>

        <View style={styles.checkCircle}>
          <Ionicons
            name="checkmark"
            size={22}
            color="#FFFFFF"
          />
        </View>
      </View>

      <Text style={styles.title}>
        Case Updated Successfully!
      </Text>

      <Text style={styles.message}>
        Your case has been updated successfully.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onViewCases}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          View Cases
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  document: {
    width: 58,
    height: 72,
    borderWidth: 3,
    borderColor: "#0152A8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 13,
    justifyContent: "space-between",
  },

  documentLine: {
    height: 5,
    backgroundColor: "#0152A8",
    width: 34,
  },

  checkCircle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#00B451",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F7F9FC",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#021E48",
    textAlign: "center",
    marginBottom: 14,
  },

  message: {
    fontSize: 18,
    lineHeight: 27,
    color: "#737B89",
    textAlign: "center",
    marginBottom: 35,
  },

  button: {
    width: "85%",
    height: 58,
    borderRadius: 8,
    backgroundColor: "#0152A8",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});