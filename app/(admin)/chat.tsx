import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

type Doctor = {
  id: number | string;
  name: string;
  profile_image?: string | null;
  timestamp?: string | null;
  unread_count?: number;
};

export default function AllChats() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [loading, setLoading] = useState(true);

  // Get active users from backend
  const getActiveUsers = async () => {
    try {
      const response = await api.get("/active-users");

      console.log("Active Users:", response.data);

      setDoctors(response.data);
    } catch (error) {
      console.log("Active users error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial API call
  useEffect(() => {
    getActiveUsers();
  }, []);

  // Automatically refresh unread count every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getActiveUsers();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // --------------------------------
  // PARTICULAR DOCTOR CHAT
  // --------------------------------
  if (selectedDoctor) {
    return (
      <SafeAreaView
        style={styles.container}
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

  // --------------------------------
  // ALL CHATS / DOCTOR LIST
  // --------------------------------
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* Header */}
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

      {/* Loading */}
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
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No active users found
          </Text>
        </View>
      ) : (
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
  },

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