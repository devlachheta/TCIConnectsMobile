import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../services/api";

type DoctorDetails = {
  id: number | string;

  full_name?: string | null;
  name?: string | null;

  email?: string | null;
  phone?: string | null;

  business_name?: string | null;
  business_type?: string | null;

  country?: string | null;
  address?: string | null;

  license_number?: string | null;
  register_number?: string | null;

  vat_id?: string | null;

  accepted_terms?: boolean | null;

  status?: string | null;

  profile_image?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

export default function DoctorDetails() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();

  const [doctor, setDoctor] =
    useState<DoctorDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  // --------------------------------
  // GET DOCTOR DETAILS
  // --------------------------------

  const getDoctorDetails = async () => {
    try {
      if (!params.id) {
        console.log(
          "Doctor ID not found"
        );

        return;
      }

      const response = await api.get(
        `/user/${params.id}`
      );

      console.log(
        "Doctor Details:",
        response.data
      );

      setDoctor(response.data);
    } catch (error) {
      console.log(
        "Doctor details error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // LOAD
  // --------------------------------

  useEffect(() => {
    getDoctorDetails();
  }, [params.id]);

  // --------------------------------
  // PROFILE IMAGE
  // --------------------------------

  const getProfileImage = () => {
    if (!doctor?.profile_image) {
      return null;
    }

    return `https://tcidentallab.com/uploads/profile/${encodeURIComponent(
      doctor.profile_image
    )}`;
  };

  // --------------------------------
  // FORMAT DATE
  // --------------------------------

  const formatDate = (
    value?: string | null
  ) => {
    if (!value) {
      return "N/A";
    }

    return new Date(
      value
    ).toLocaleString();
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
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
            User Details
          </Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#0864B9"
          />

          <Text style={styles.loadingText}>
            Loading details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------
  // NOT FOUND
  // --------------------------------

  if (!doctor) {
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
            User Details
          </Text>
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons
            name="person-outline"
            size={50}
            color="#999"
          />

          <Text style={styles.emptyText}>
            Doctor details not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const profileImage =
    getProfileImage();

  const doctorName =
    doctor.full_name ||
    doctor.name ||
    "Unknown Doctor";

  const isApproved =
    doctor.status
      ?.toLowerCase()
      .includes("approved");

  // --------------------------------
  // MAIN UI
  // --------------------------------

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* =========================
          HEADER
      ========================== */}

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
          User Details
        </Text>
      </View>

      {/* =========================
          CONTENT
      ========================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            PROFILE CARD
        ========================== */}

        <View style={styles.profileCard}>
          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={styles.profilePlaceholder}
            >
              <Ionicons
                name="person-outline"
                size={45}
                color="#777"
              />
            </View>
          )}

          <Text style={styles.profileName}>
            {doctorName}
          </Text>

          <View
            style={[
              styles.statusBadge,
              isApproved
                ? styles.approvedBadge
                : styles.pendingBadge,
            ]}
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
              {doctor.status ||
                "Pending"}
            </Text>
          </View>
        </View>

        {/* =========================
            DETAILS CARD
        ========================== */}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>
            Doctor Information
          </Text>

          <View style={styles.divider} />

          {/* Full Name */}
          <DetailRow
            label="Full Name"
            value={doctorName}
          />

          {/* Email */}
          <DetailRow
            label="Email"
            value={
              doctor.email || "N/A"
            }
          />

          {/* Phone */}
          <DetailRow
            label="Phone"
            value={
              doctor.phone || "N/A"
            }
          />

          {/* Business Name */}
          <DetailRow
            label="Business Name"
            value={
              doctor.business_name ||
              "N/A"
            }
          />

          {/* Business Type */}
          <DetailRow
            label="Business Type"
            value={
              doctor.business_type ||
              "N/A"
            }
          />

          {/* Country */}
          <DetailRow
            label="Country"
            value={
              doctor.country || "N/A"
            }
          />

          {/* Address */}
          <DetailRow
            label="Address"
            value={
              doctor.address || "N/A"
            }
          />

          {/* Register Number */}
          <DetailRow
            label="Register Number"
            value={
              doctor.register_number ||
              doctor.license_number ||
              "N/A"
            }
          />

          {/* VAT */}
          <DetailRow
            label="VAT / TAX ID"
            value={
              doctor.vat_id || "N/A"
            }
          />

          {/* Accepted Terms */}
          <View
            style={styles.detailRow}
          >
            <Text style={styles.detailLabel}>
              Accepted Terms
            </Text>

            <View
              style={[
                styles.acceptedBadge,
                doctor.accepted_terms
                  ? styles.acceptedYes
                  : styles.acceptedNo,
              ]}
            >
              <Ionicons
                name={
                  doctor.accepted_terms
                    ? "checkmark"
                    : "close"
                }
                size={16}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.acceptedText
                }
              >
                {doctor.accepted_terms
                  ? "Yes"
                  : "No"}
              </Text>
            </View>
          </View>

          {/* Created At */}
          <DetailRow
            label="Created At"
            value={formatDate(
              doctor.created_at
            )}
          />

          {/* Last Updated */}
          <DetailRow
            label="Last Updated"
            value={formatDate(
              doctor.updated_at
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================
// DETAIL ROW COMPONENT
// ======================================

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text
        style={styles.detailValue}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F7F9FC",
  },

  // --------------------------------
  // HEADER
  // --------------------------------

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

  // --------------------------------
  // SCROLL
  // --------------------------------

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,

    paddingBottom: 35,
  },

  // --------------------------------
  // PROFILE
  // --------------------------------

  profileCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    alignItems: "center",

    paddingVertical: 28,
    paddingHorizontal: 20,

    marginBottom: 16,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  profileImage: {
    width: 95,
    height: 95,

    borderRadius: 48,

    marginBottom: 14,
  },

  profilePlaceholder: {
    width: 95,
    height: 95,

    borderRadius: 48,

    backgroundColor: "#F1F3F5",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  profileName: {
    fontSize: 23,

    fontWeight: "600",

    color: "#111",

    textAlign: "center",

    marginBottom: 12,
  },

  statusBadge: {
    flexDirection: "row",

    alignItems: "center",

    borderRadius: 20,

    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  approvedBadge: {
    backgroundColor: "#EAF7EA",
  },

  pendingBadge: {
    backgroundColor: "#FFF4E5",
  },

  statusDot: {
    width: 8,
    height: 8,

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

  // --------------------------------
  // DETAILS
  // --------------------------------

  detailsCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    paddingHorizontal: 18,
    paddingVertical: 22,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  sectionTitle: {
    fontSize: 21,

    fontWeight: "600",

    color: "#111",

    marginBottom: 15,
  },

  divider: {
    height: 1,

    backgroundColor: "#D0D0D0",

    marginBottom: 2,
  },

  detailRow: {
    flexDirection: "column",

    paddingVertical: 13,

    borderBottomWidth: 1,

    borderBottomColor: "#E8E8E8",
  },

  detailLabel: {
    fontSize: 14,

    fontWeight: "600",

    color: "#555",

    marginBottom: 5,
  },

  detailValue: {
    fontSize: 16,

    color: "#111",

    lineHeight: 22,
  },

  // --------------------------------
  // ACCEPTED TERMS
  // --------------------------------

  acceptedBadge: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    borderRadius: 7,

    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  acceptedYes: {
    backgroundColor: "#198754",
  },

  acceptedNo: {
    backgroundColor: "#DC3545",
  },

  acceptedText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "600",

    marginLeft: 4,
  },

  // --------------------------------
  // LOADING
  // --------------------------------

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

  // --------------------------------
  // EMPTY
  // --------------------------------

  emptyContainer: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  emptyText: {
    marginTop: 10,

    fontSize: 16,

    color: "#666",
  },
});