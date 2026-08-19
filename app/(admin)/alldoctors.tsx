import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useRouter,
} from "expo-router";
import {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AdminFooter from "@/components/admindashboard/AdminFooter";
import api from "../../services/api";

type Doctor = {
  id: number | string;
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  status?: string;
  profile_image?: string | null;
};

export default function AllDoctors() {
  const router = useRouter();

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors");

      const sortedDoctors = [...response.data].sort(
        (a, b) => {
          // Pending doctors first
          if (
            a.status?.toLowerCase() === "pending" &&
            b.status?.toLowerCase() !== "pending"
          ) {
            return -1;
          }

          if (
            a.status?.toLowerCase() !== "pending" &&
            b.status?.toLowerCase() === "pending"
          ) {
            return 1;
          }

          return 0;
        }
      );

      console.log("Doctors:", sortedDoctors);

      setDoctors(sortedDoctors);
    } catch (error) {
      console.log(
        "Error fetching doctors:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, [])
  );



  const filteredDoctors =
    doctors.filter((doctor) => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return true;
      }

      return (
        doctor.full_name
          ?.toLowerCase()
          .includes(search) ||
        doctor.email
          ?.toLowerCase()
          .includes(search) ||
        doctor.phone
          ?.toLowerCase()
          .includes(search) ||
        doctor.business_name
          ?.toLowerCase()
          .includes(search)
      );
    });

  // ==========================================
  // OPEN DOCTOR DETAILS
  // ==========================================

  const openDoctorDetails = (
    doctor: Doctor
  ) => {
    router.push({
      pathname: "/doctordetails",
      params: {
        id: String(doctor.id),
      },
    });
  };

  // ==========================================
  // APPROVE / PENDING
  // ==========================================

  const toggleDoctorStatus = async (
    doctorId: number | string
  ) => {
    try {
      await api.put(
        `/toggle-doctor-status/${doctorId}`
      );

      // Get latest status from backend
      await fetchDoctors();
    } catch (error) {
      console.log(
        "Status update error:",
        error
      );
    }
  };

  // ==========================================
  // PROFILE IMAGE URL
  // ==========================================

  const getProfileImage = (
    profileImage?: string | null
  ) => {
    if (!profileImage) {
      return null;
    }

    return `https://tcidentallab.com/uploads/profile/${encodeURIComponent(
      profileImage
    )}`;
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom"]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={30}
              color="#000"
            />
          </TouchableOpacity>

          {/* <Text
            style={styles.headerTitle}
          >
            All Doctors
          </Text> */}
        </View>

        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color="#0864B9"
          />

          <Text
            style={styles.loadingText}
          >
            Loading doctors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN SCREEN
  // ==========================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#000"
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
        >
          All Doctors
        </Text>
      </View>

      {/* =====================================
          SCROLL CONTENT
      ====================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* =================================
            SEARCH
        ================================== */}

        <View
          style={styles.searchContainer}
        >
          <Ionicons
            name="search-outline"
            size={21}
            color="#777"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={
              setSearchTerm
            }
          />

          {searchTerm.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                setSearchTerm("")
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* =================================
            DOCTOR CARD
        ================================== */}

        <View style={styles.card}>



          {/* NO DOCTORS */}

          {filteredDoctors.length ===
            0 ? (
            <View
              style={
                styles.emptyContainer
              }
            >
              <Ionicons
                name="people-outline"
                size={45}
                color="#999"
              />

              <Text
                style={styles.emptyText}
              >
                No Doctors Found
              </Text>
            </View>
          ) : (
            filteredDoctors.map(
              (doctor) => {
                const profileImage =
                  getProfileImage(
                    doctor.profile_image
                  );

                const isApproved =
                  doctor.status
                    ?.toLowerCase() ===
                  "approved";

                return (
                  <View
                    key={doctor.id}
                    style={
                      styles.doctorCard
                    }
                  >
                    {/* =====================
                        PROFILE + NAME
                    ====================== */}

                    <View
                      style={
                        styles.topSection
                      }
                    >
                      {/* PROFILE */}

                      {profileImage ? (
                        <Image
                          source={{
                            uri: profileImage,
                          }}
                          style={styles.profileImage}
                          onError={(error) => {
                            console.log(
                              "PROFILE IMAGE ERROR:",
                              doctor.full_name,
                              profileImage,
                              error.nativeEvent
                            );
                          }}
                        />
                      ) : (
                        <View
                          style={
                            styles.profilePlaceholder
                          }
                        >
                          <Ionicons
                            name="person-outline"
                            size={25}
                            color="#777"
                          />
                        </View>
                      )}

                      {/* NAME */}

                      <View
                        style={
                          styles.nameContainer
                        }
                      >
                        <Text
                          style={
                            styles.doctorName
                          }
                          numberOfLines={
                            2
                          }
                        >
                          {doctor.full_name ||
                            "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* =====================
                        EMAIL
                    ====================== */}

                    <View
                      style={
                        styles.infoRow
                      }
                    >
                      <Ionicons
                        name="mail-outline"
                        size={19}
                        color="#666"
                      />

                      <Text
                        style={
                          styles.infoText
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {doctor.email ||
                          "N/A"}
                      </Text>
                    </View>

                    {/* =====================
                        PHONE
                    ====================== */}

                    <View
                      style={
                        styles.infoRow
                      }
                    >
                      <Ionicons
                        name="call-outline"
                        size={19}
                        color="#666"
                      />

                      <Text
                        style={
                          styles.infoText
                        }
                      >
                        {doctor.phone ||
                          "N/A"}
                      </Text>
                    </View>

                    {/* =====================
                        BUSINESS
                    ====================== */}

                    <View
                      style={
                        styles.infoRow
                      }
                    >
                      <Ionicons
                        name="business-outline"
                        size={19}
                        color="#666"
                      />

                      <Text
                        style={
                          styles.infoText
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {doctor.business_name ||
                          "N/A"}
                      </Text>
                    </View>

                    {/* =====================
                        STATUS + VIEW
                    ====================== */}

                    <View
                      style={
                        styles.bottomSection
                      }
                    >
                      {/* STATUS */}

                      <TouchableOpacity
                        style={[
                          styles.statusBadge,
                          isApproved
                            ? styles.approvedBadge
                            : styles.pendingBadge,
                        ]}
                        onPress={() =>
                          toggleDoctorStatus(
                            doctor.id
                          )
                        }
                        activeOpacity={
                          0.7
                        }
                      >
                        <View
                          style={[
                            styles.statusDot,
                            isApproved
                              ? styles.approvedDot
                              : styles.pendingDot,
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            isApproved
                              ? styles.approvedText
                              : styles.pendingText,
                          ]}
                        >
                          {isApproved
                            ? "Approved"
                            : "Pending"}
                        </Text>
                      </TouchableOpacity>

                      {/* VIEW */}

                      <TouchableOpacity
                        style={
                          styles.viewButton
                        }
                        onPress={() =>
                          openDoctorDetails(
                            doctor
                          )
                        }
                        activeOpacity={
                          0.7
                        }
                      >
                        <Ionicons
                          name="eye-outline"
                          size={21}
                          color="#0864B9"
                        />

                        <Text
                          style={
                            styles.viewText
                          }
                        >
                          View
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            )
          )}
        </View>
      </ScrollView>
      <AdminFooter />
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  searchContainer: {
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E0E0E0",

    borderRadius: 10,

    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 16,

    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    marginLeft: 9,

    fontSize: 15,

    color: "#111",
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    marginHorizontal: 16,

    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },


  divider: {
    height: 1,

    backgroundColor: "#CFCFCF",
  },

  doctorCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    marginBottom: 16,

    paddingHorizontal: 20,
    paddingVertical: 18,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  topSection: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  profileImage: {
    width: 48,
    height: 48,

    borderRadius: 24,
  },

  profilePlaceholder: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#F1F3F5",

    alignItems: "center",
    justifyContent: "center",
  },

  nameContainer: {
    flex: 1,

    marginLeft: 12,
  },

  doctorName: {
    fontSize: 19,

    fontWeight: "600",

    color: "#111",
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 9,
  },

  infoText: {
    flex: 1,

    marginLeft: 10,

    fontSize: 14,

    color: "#666",
  },

  bottomSection: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 5,
  },

  statusBadge: {
    flexDirection: "row",

    alignItems: "center",

    borderRadius: 20,

    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  approvedBadge: {
    backgroundColor: "#EAF7EA",
  },

  pendingBadge: {
    backgroundColor: "#FFF4E5",
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  approvedDot: {
    backgroundColor: "#198754",
  },

  pendingDot: {
    backgroundColor: "#F39C12",
  },

  statusText: {
    fontSize: 13,

    fontWeight: "600",
  },

  approvedText: {
    color: "#198754",
  },

  pendingText: {
    color: "#F39C12",
  },

  viewButton: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 8,

    backgroundColor: "#EEF6FF",
  },

  viewText: {
    marginLeft: 5,

    fontSize: 14,

    fontWeight: "600",

    color: "#0864B9",
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
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 50,
  },

  emptyText: {
    marginTop: 10,

    fontSize: 16,

    color: "#666",
  },
});