import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menuItems = [
  {
    title: "Home",
    icon: "home-outline",
    activeIcon: "home",
    route: "/(admin)",
  },
  {
    title: "Cases",
    icon: "document-text-outline",
    activeIcon: "document-text",
    route: "/(admin)/recentcases",
  },
  {
    title: "Doctors",
    icon: "people-outline",
    activeIcon: "people",
    route: "/(admin)/alldoctors",
  },
  {
    title: "Chat",
    icon: "chatbubble-outline",
    activeIcon: "chatbubble",
    route: "/(admin)/chat",
  },
  {
    title: "Pricing",
    icon: "pricetag-outline",
    activeIcon: "pricetag",
    route: "/(admin)/pricing",
  },
];

export default function AdminFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigation = (route: string) => {
    const isHome =
      route === "/(admin)" ||
      route === "/(admin)/index";

    const isCurrentlyHome =
      pathname === "/" ||
      pathname === "/(admin)" ||
      pathname === "/(admin)/index";

    if (isHome && isCurrentlyHome) {
      return;
    }

    router.push(route as any);
  };
  return (
    <View style={styles.footer}>
      {menuItems.map((item) => {
        const isActive =
          item.title === "Home"
            ? pathname === "/(admin)" ||
            pathname === "/(admin)/index"
            : pathname.includes(
              item.route.split("/").pop() || ""
            );

        return (
          <TouchableOpacity
            key={item.title}
            style={styles.footerItem}
            onPress={() =>
              handleNavigation(item.route)
            }
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={
                  (isActive
                    ? item.activeIcon
                    : item.icon) as any
                }
                size={22}
                color={
                  isActive
                    ? "#0864B9"
                    : "#777"
                }
              />
            </View>

            <Text
              style={[
                styles.footerText,
                isActive &&
                styles.activeFooterText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 68,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 8,
  },

  footerItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    gap: 3,
  },

  iconContainer: {
    width: 32,
    height: 28,

    alignItems: "center",
    justifyContent: "center",
  },

  activeIconContainer: {
    // Active icon styling can be changed later
  },

  footerText: {
    fontSize: 11,
    color: "#777",
    fontWeight: "500",
  },

  activeFooterText: {
    color: "#0864B9",
    fontWeight: "600",
  },
});