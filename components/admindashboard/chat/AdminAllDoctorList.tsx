import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
// COMPONENT PROPS
// =====================================================

type AdminAllDoctorListProps = {
  doctors: Doctor[];
  onDoctorPress: (doctor: Doctor) => void;
};

// =====================================================
// ADMIN ALL DOCTOR LIST
// =====================================================

export default function AdminAllDoctorList({
  doctors,
  onDoctorPress,
}: AdminAllDoctorListProps) {
  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  const getProfileImageUrl = (
    profileImage?: string | null
  ): string | null => {
    if (!profileImage) {
      return null;
    }

    // Already a complete URL
    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    // Already contains the profile upload path
    if (
      profileImage.includes(
        "/tci-uploads/profile/"
      )
    ) {
      return `https://tcidentallab.com${profileImage.startsWith("/")
          ? ""
          : "/"
        }${profileImage}`;
    }

    // Only filename
    return `https://tcidentallab.com/tci-uploads/profile/${encodeURIComponent(
      profileImage
    )}`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <View style={styles.card}>
      {/* =====================================================
          TITLE
      ===================================================== */}

      <Text style={styles.title}>
        Active Users
      </Text>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <View style={styles.divider} />

      {/* =====================================================
          DOCTOR LIST
      ===================================================== */}

      <ScrollView
        style={styles.doctorList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {doctors.map((doctor) => {
          // =====================================================
          // PROFILE IMAGE
          // =====================================================

          const imageUrl =
            getProfileImageUrl(
              doctor.profile_image
            );

          return (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorItem}
              onPress={() =>
                onDoctorPress(doctor)
              }
              activeOpacity={0.7}
            >
              {/* =====================================================
                  PROFILE
              ===================================================== */}

              <View
                style={
                  styles.profileContainer
                }
              >
                {imageUrl ? (
                  <Image
                    source={{
                      uri: imageUrl,
                    }}
                    style={
                      styles.profileImage
                    }
                    onError={(error) => {
                      console.log(
                        "PROFILE IMAGE ERROR:",
                        doctor.name
                      );

                      console.log(
                        "Original profile_image:",
                        doctor.profile_image
                      );

                      console.log(
                        "Generated image URL:",
                        imageUrl
                      );

                      console.log(
                        "Image error:",
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
                      size={22}
                      color="#777"
                    />
                  </View>
                )}
              </View>

              {/* =====================================================
                  DOCTOR NAME + UNREAD COUNT
              ===================================================== */}

              <View
                style={
                  styles.nameContainer
                }
              >
                <Text
                  style={styles.doctorName}
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>

                {Number(
                  doctor.unread_count
                ) > 0 ? (
                  <View
                    style={
                      styles.unreadBadge
                    }
                  >
                    <Text
                      style={
                        styles.unreadText
                      }
                    >
                      {doctor.unread_count}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* =====================================================
                  LAST ACTIVE
              ===================================================== */}

              <Text
                style={styles.lastActive}
              >
                {doctor.timestamp
                  ? new Date(
                    doctor.timestamp
                  ).toLocaleString()
                  : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  // =====================================================
  // CARD
  // =====================================================

  card: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,

    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 16,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  // =====================================================
  // TITLE
  // =====================================================

  title: {
    fontSize: 28,
    fontWeight: "500",

    color: "#111",

    marginBottom: 20,
  },

  // =====================================================
  // DIVIDER
  // =====================================================

  divider: {
    height: 1,

    backgroundColor: "#CFCFCF",
  },

  // =====================================================
  // DOCTOR ITEM
  // =====================================================

  doctorItem: {
    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",

    paddingVertical: 10,
  },

  // =====================================================
  // PROFILE
  // =====================================================

  profileContainer: {
    width: 52,

    alignItems: "flex-start",
    justifyContent: "center",

    marginRight: 8,
  },

  profileImage: {
    width: 40,
    height: 40,

    borderRadius: 20,
  },

  profilePlaceholder: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#F1F3F5",

    alignItems: "center",
    justifyContent: "center",
  },

  // =====================================================
  // NAME CONTAINER
  // =====================================================

  nameContainer: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    marginRight: 10,
  },

  doctorName: {
    flexShrink: 1,

    fontSize: 18,
    fontWeight: "400",

    color: "#111",
  },

  // =====================================================
  // UNREAD BADGE
  // =====================================================

  unreadBadge: {
    minWidth: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: "#DC3545",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 6,

    marginLeft: 8,
  },

  unreadText: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "600",
  },

  // =====================================================
  // LAST ACTIVE
  // =====================================================

  lastActive: {
    width: 125,

    fontSize: 14,

    color: "#666",

    textAlign: "right",
  },

  // =====================================================
  // DOCTOR LIST
  // =====================================================

  doctorList: {
    flex: 1,
  },
});