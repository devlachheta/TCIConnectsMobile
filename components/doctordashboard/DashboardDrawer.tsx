import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface DashboardDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function DashboardDrawer({
  visible,
  onClose,
}: DashboardDrawerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable style={styles.drawer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >

            <View style={styles.header}>
              <Text style={styles.logo}>
                TCI Online
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.profileImage}>
                <Ionicons
                  name="person"
                  size={28}
                  color="#0152A8"
                />
              </View>


              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  Randy Orton
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push("/(tabs)/profile");
                  }}>
                  <Text style={styles.viewProfile}>
                    View Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.activeMenu}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)");
                }}
              >

                <Text style={styles.activeMenuText}>
                  Dashboard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/cases");
                }}
              >
                <Ionicons name="folder-open-outline" size={22} color="#4B5563" />
                <Text style={styles.menuText}>Cases</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/newcases")
                }}
              >
                <Ionicons name="add-circle-outline" size={22} color="#4B5563" />
                <Text style={styles.menuText}>New Case</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/chat")
                }
                }>
                <Ionicons name="chatbubble-outline" size={22} color="#4B5563" />
                <Text style={styles.menuText}>Chat</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/pricing");
                }}>
                <Ionicons
                  name="pricetag-outline"
                  size={22}
                  color="#4B5563"
                />
                <Text style={styles.menuText}>
                  Pricing
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/profile")
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={22}
                  color="#4B5563"
                />
                <Text style={styles.menuText}>
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/qa");
                }}>
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#4B5563"
                />
                <Text style={styles.menuText}>
                  Q&A
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/gdpr");
                }}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#4B5563"
                />
                <Text style={styles.menuText}>
                  GDPR / Privacy Policy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  onClose();
                  router.push("/(tabs)/helpfaq");
                }}>
                <Ionicons
                  name="headset-outline"
                  size={22}
                  color="#4B5563"
                />
                <Text style={styles.menuText}>
                  Help & FAQ
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.logoutItem}

                onPress={() => {
                  onClose();
                  router.push("/(auth)/welcome");
                }}>
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color="#EF4444"
                />
                <Text style={styles.logoutText}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal >
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  drawer: {
    width: "75%",
    height: "100%",
    backgroundColor: "#fff",
  },

  header: {
    height: 75,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0152A8",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F5F8FC",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    marginLeft: 14,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },


  viewProfile: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: 500
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  activeMenu: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0152A8",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },

  activeMenuText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  menuText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
    marginHorizontal: 18,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 14,
  },
});