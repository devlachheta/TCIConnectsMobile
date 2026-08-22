import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../services/api";

import AdminAllDoctorList from "@/components/admindashboard/chat/AdminAllDoctorList";
import AdminDoctorChat from "@/components/admindashboard/chat/AdminDoctorChat";

// =====================================================
// DOCTOR TYPE
// =====================================================

type Doctor = {
  id: number | string;
  name: string;
  profile_image?: string | null;
  timestamp?: string | null;
  unread_count?: number;
};

// =====================================================
// ALL CHATS
// =====================================================

export default function AllChats() {
  const router = useRouter();
  const navigation = useNavigation();

  // =====================================================
  // STATE
  // =====================================================

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // HIDE / SHOW TAB BAR
  // =====================================================

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: selectedDoctor
        ? {
          display: "none",
        }
        : undefined,
    });
  }, [navigation, selectedDoctor]);

  // =====================================================
  // GET ACTIVE USERS
  // =====================================================

  const getActiveUsers = useCallback(async () => {
    try {
      const response = await api.get("/active-users");

      console.log(
        "Active Users:",
        response.data
      );

      const sortedDoctors = [...response.data].sort(
        (a, b) => {
          if (!a.timestamp && !b.timestamp) {
            return 0;
          }

          if (!a.timestamp) {
            return 1;
          }

          if (!b.timestamp) {
            return -1;
          }

          return (
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
          );
        }
      );

      setDoctors(sortedDoctors);
    } catch (error) {
      console.log(
        "Active users error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    getActiveUsers();
  }, [getActiveUsers]);

  // =====================================================
  // OPEN SELECTED DOCTOR CHAT
  // =====================================================

  if (selectedDoctor) {
    return (
      <SafeAreaView
        style={styles.chatScreen}
        edges={["top", "bottom"]}
      >
        <AdminDoctorChat
          doctor={selectedDoctor}
          onBack={() => {
            setSelectedDoctor(null);
            getActiveUsers();
          }}
        />
      </SafeAreaView>
    );
  }

  // =====================================================
  // ALL CHATS LIST
  // =====================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          All Chats
        </Text>
      </View>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#0864B9"
          />

          <Text style={styles.loadingText}>
            Loading users...
          </Text>
        </View>
      ) : doctors.length === 0 ? (
        // =====================================================
        // EMPTY
        // =====================================================

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No active users found
          </Text>
        </View>
      ) : (
        // =====================================================
        // DOCTOR LIST
        // =====================================================

        <View style={styles.content}>
          <AdminAllDoctorList
            doctors={doctors}
            onDoctorPress={(doctor) => {
              console.log(
                "Selected Doctor:",
                doctor
              );

              setSelectedDoctor(doctor);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  // =====================================================
  // MAIN LIST SCREEN
  // =====================================================

  container: {
    flex: 1,

    backgroundColor: "#F7F9FC",
  },

  // =====================================================
  // CHAT SCREEN
  // =====================================================

  chatScreen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  // =====================================================
  // HEADER
  // =====================================================

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

  // =====================================================
  // CONTENT
  // =====================================================

  content: {
    flex: 1,
  },

  // =====================================================
  // LOADING
  // =====================================================

  loadingContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,

    fontSize: 15,

    color: "#666",
  },

  // =====================================================
  // EMPTY
  // =====================================================

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 16,

    color: "#666",
  },
});