import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AuthHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        TCI Connect
      </Text>

      <TouchableOpacity style={styles.searchButton}>
        <Ionicons
          name="search"
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#0152A8",
    width: "100%",
  },

  title: {
    color: "#FFFFFF",

    fontSize: 20,

    fontWeight: "700",
  },
  searchButton: {
    width: 38,

    height: 38,

    borderRadius: 19,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#0A61C9",
  }
});
