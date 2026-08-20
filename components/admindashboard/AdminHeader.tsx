import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AdminHeaderProps = {
  onMenuPress: () => void;
};

export default function AdminHeader({
  onMenuPress,
}: AdminHeaderProps) {
  return (
    <View style={styles.header}>

      {/* Left Side */}
      <View style={styles.leftSection}>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
        >
          <Ionicons
            name="menu"
            size={30}
            color="#111"
          />
        </TouchableOpacity>



      </View>

      {/* Right Side */}
      <View style={styles.rightSection}>

        {/* Notification */}
        <TouchableOpacity
          style={styles.notificationButton}
        >
          <Ionicons
            name="notifications-outline"
            size={27}
            color="#555"
          />

          {/* Notification Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              3
            </Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* TCI LAB */}
        <Text style={styles.brand}>
          TCI LAB
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 82,
    backgroundColor: "#fff",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 20,
    paddingEnd: 10,
    marginBottom: 10,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuButton: {
    width: 45,
    height: 45,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },


  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationButton: {
    width: 40,
    height: 40,

    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#E5E5E5",

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  badge: {
    position: "absolute",
    right: -3,
    top: -3,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  divider: {
    width: 1,
    height: 45,

    backgroundColor: "#E5E5E5",

    marginHorizontal: 15,
  },

  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginLeft: -5,
  },
});