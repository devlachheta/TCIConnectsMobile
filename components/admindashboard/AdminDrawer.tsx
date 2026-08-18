import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
  Alert, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type AdminDrawerProps = {
  onClose: () => void;
};

export default function AdminDrawer({
  onClose,
}: AdminDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: "grid-outline",
      route: "/(admin)",
    },
    {
      title: "Recent Cases",
      icon: "document-text-outline",
      route: "/(admin)/recentcases",
    },
    {
      title: "All Doctors",
      icon: "person-add-outline",
      route: "/(admin)/alldoctors",
    },
    {
      title: "Chat",
      icon: "chatbubble-outline",
      route: "/(admin)/chat",
    },
    {
      title: "Pricing",
      icon: "pricetag-outline",
      route: "/(admin)/pricing",
    },
    {
      title: "Setting",
      icon: "settings-outline",
      route: "/(admin)/setting",
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const handleLogout = async () => {
    try {

      await SecureStore.deleteItemAsync("access_token");

      await AsyncStorage.removeItem("user");


      onClose();


      router.replace("/(auth)/welcome");
    } catch (error) {
      console.log("Logout Error:", error);

      Alert.alert(
        "Logout Error",
        "Unable to logout. Please try again."
      );
    }
  };

  return (
    <View style={styles.drawer}>

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Ionicons
          name="close"
          size={28}
          color="#111"
        />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          TCI Online
        </Text>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>

        {menuItems.map((item) => {

          const isActive =
            item.title === "Dashboard"
              ? pathname === "/(admin)"
              : pathname.includes(
                item.route.split("/").pop() || ""
              );

          return (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                isActive &&
                styles.activeMenuItem,
              ]}
              onPress={() =>
                handleNavigation(item.route)
              }
            >

              <Ionicons
                name={item.icon as any}
                size={24}
                color={
                  isActive
                    ? "#fff"
                    : "#111"
                }
              />

              <Text
                style={[
                  styles.menuText,
                  isActive &&
                  styles.activeMenuText,
                ]}
              >
                {item.title}
              </Text>

            </TouchableOpacity>
          );
        })}

        {/* Logout */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#111"
          />

          <Text style={styles.menuText}>
            Logout
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,

    width: 280,

    backgroundColor: "#fff",

    borderRightWidth: 1,
    borderRightColor: "#E5E5E5",

    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 25,

    zIndex: 100,
    elevation: 10,
  },

  closeButton: {
    position: "absolute",

    top: 20,
    right: 20,

    zIndex: 10,

    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginTop: 35,
    marginBottom: 55,

    paddingHorizontal: 10,
  },

  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1268E8",
  },

  menuContainer: {
    gap: 12,
  },

  menuItem: {
    height: 56,

    borderRadius: 30,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 24,

    gap: 18,
  },

  activeMenuItem: {
    backgroundColor: "#0864B9",
  },

  menuText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#111",
  },

  activeMenuText: {
    color: "#fff",
    fontWeight: "600",
  },
});