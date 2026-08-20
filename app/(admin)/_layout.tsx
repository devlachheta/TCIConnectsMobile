import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0152A8",
        tabBarInactiveTintColor: "#777",
        tabBarHideOnKeyboard: false,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Cases */}
      <Tabs.Screen
        name="recentcases"
        options={{
          title: "Cases",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="folder-open"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Doctors */}
      <Tabs.Screen
        name="alldoctors"
        options={{
          title: "Doctors",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Pricing */}
      <Tabs.Screen
        name="pricing/index"
        options={{
          title: "Pricing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="pricetag"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="doctordetails"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pricing/add-category"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="pricing/add-material"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="pricing/add-price"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="pricing/edit-price"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}