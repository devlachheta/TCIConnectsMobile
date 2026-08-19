import AdminFooter from "@/components/admindashboard/AdminFooter";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Setting() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Setting
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>
          can't edit
        </Text>
      </View>
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  content: {
    flex: 1,
    padding: 24,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
});