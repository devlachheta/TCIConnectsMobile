import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileMenu() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        setProfileName(user.full_name || "");

        if (user.profile_image) {
          const imageUrl = user.profile_image.startsWith("http")
            ? user.profile_image
            : `https://tcidentallab.com/tci-uploads/profile/${encodeURIComponent(
              user.profile_image
            )}`;

          setProfileImage(imageUrl);
        } else {
          setProfileImage(null);
        }
      }
    } catch (error) {
      console.log("Profile Menu Error:", error);
    }
  };

  return (
    <View style={styles.container}>

      {/* Profile Button */}
      <TouchableOpacity
        style={styles.profileButton}
        activeOpacity={0.8}
        onPress={() =>
          setMenuVisible((prev) => !prev)
        }
      >
        <View style={styles.profileTopRow}>

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons
                name="person"
                size={28}
                color="#8FA4BD"
              />
            )}
          </View>

          <Ionicons
            name={
              menuVisible
                ? "chevron-up"
                : "chevron-down"
            }
            size={18}
            color="#062653"
            style={styles.arrow}
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown */}
      {menuVisible && (
        <View style={styles.dropdown}>

          {/* Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/profile");
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#062653"
              />
            </View>

            <Text style={styles.menuText}>
              Profile
            </Text>
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              setMenuVisible(false);
              router.push("/(auth)/changepassword");
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#062653"
              />
            </View>

            <Text style={styles.menuText}>
              Change Password
            </Text>
          </TouchableOpacity>
          {/* Help */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              setMenuVisible(false);
              router.push("/(tabs)/profile");
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#062653"
              />
            </View>

            <Text style={styles.menuText}>
              Help & FAQ
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={async () => {
              setMenuVisible(false);

              await AsyncStorage.removeItem("access_token");
              await AsyncStorage.removeItem("user");

              router.replace("/(auth)/welcome");
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#EF4444"
              />
            </View>

            <Text
              style={[
                styles.menuText,
                styles.logoutText,
              ]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    zIndex: 99999,
    elevation: 20,
  },

  profileButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  imageContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8EEF6",
    borderWidth: 1,
    borderColor: "#D4DDE8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 23,
  },

  arrow: {
    marginLeft: 5,
  },

  profileName: {
    maxWidth: 100,
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#062653",
    textAlign: "center",
  },

  dropdown: {
    position: "absolute",
    top: 78,
    right: 0,
    width: 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E1E5EA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 15,
  },

  iconBox: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },

  logoutText: {
    color: "#EF4444",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 5,
  },
});