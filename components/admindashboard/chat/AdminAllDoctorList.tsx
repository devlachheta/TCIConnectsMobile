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

type Doctor = {
  id: number | string;
  name: string;
  profile_image?: string | null;
  timestamp?: string | null;
  unread_count?: number;
};

type AdminAllDoctorListProps = {
  doctors: Doctor[];
  onDoctorPress: (doctor: Doctor) => void;
};

export default function AdminAllDoctorList({
  doctors,
  onDoctorPress,
}: AdminAllDoctorListProps) {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>
        Active Users
      </Text>

      {/* Divider */}
      <View style={styles.divider} />


      {/* Doctor List */}
      <ScrollView
        style={styles.doctorList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.doctorItem}
            onPress={() => onDoctorPress(doctor)}
            activeOpacity={0.7}
          >
            {/* Profile */}
            <View style={styles.profileContainer}>
              {doctor.profile_image ? (
                <Image
                  source={{
                    uri: `https://tcidentallab.com/uploads/profile/${encodeURIComponent(
                      doctor.profile_image
                    )}`,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#777"
                  />
                </View>
              )}
            </View>

            {/* Doctor Name + Unread Count */}
            <View style={styles.nameContainer}>
              <Text
                style={styles.doctorName}
                numberOfLines={1}
              >
                {doctor.name}
              </Text>

              {Number(doctor.unread_count) > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>
                    {doctor.unread_count}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Last Active */}
            <Text style={styles.lastActive}>
              {doctor.timestamp
                ? new Date(
                  doctor.timestamp
                ).toLocaleString()
                : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
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

  title: {
    fontSize: 28,
    fontWeight: "500",
    color: "#111",

    marginBottom: 20,
  },

  divider: {
    height: 1,

    backgroundColor: "#CFCFCF",
  },

  doctorItem: {
    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",

    paddingVertical: 10,
  },

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

  lastActive: {
    width: 125,

    fontSize: 14,

    color: "#666",

    textAlign: "right",
  },
  doctorList: {
    flex: 1
  },
});