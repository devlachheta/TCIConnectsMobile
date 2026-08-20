import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import api from "@/services/api";

interface NotificationItem {
  id: number;
  message: string;
  is_read: boolean;
  case_id?: number | null;
  notification_type?: string | null;
  sender_id?: number | null;
  receiver_id?: number | null;
  created_at?: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const storedUser =
        await AsyncStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?.id) {
        return;
      }

      const response = await api.get(
        `/client/notifications/${user.id}`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const sortedNotifications = [...data].sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.log(
        "Error fetching notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleBellPress = () => {
    setShowDropdown(true);
  };

  const closeNotifications = () => {
    setShowDropdown(false);
  };

  const markAsRead = async (
    notificationId: number
  ) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((previous) =>
        previous.filter(
          (item) =>
            item.id !== notificationId
        )
      );

    } catch (error) {
      console.log(
        "Error marking notification as read:",
        error
      );
    }
  };

  /*
   * Badge shows unread notifications only.
   */
  const unreadCount = notifications.length;
  const visibleNotificationCount = Math.min(
    notifications.length,
    5
  );

  const notificationDropdownHeight =
    notifications.length === 0
      ? 150
      : 52 + visibleNotificationCount * 92;
  return (
    <View style={styles.wrapper}>

      {/* Notification Bell */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.notificationButton}
        onPress={handleBellPress}
      >
        <Ionicons
          name="notifications-outline"
          size={25}
          color="#0152A8"
        />

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Notification Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={
          closeNotifications
        }
      >
        <View style={styles.modalContainer}>

          {/* Background */}
          <Pressable
            style={styles.modalBackground}
            onPress={closeNotifications}
          />

          {/* Notification Box */}

          <View
            style={[
              styles.dropdown,
              {
                height: notificationDropdownHeight,
              },
            ]}
          >

            {/* Header */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.heading}>
                Notifications
              </Text>
            </View>
            {/* Loading */}
            {loading ? (
              <View
                style={
                  styles.loadingContainer
                }
              >
                <ActivityIndicator
                  size="small"
                  color="#0152A8"
                />
              </View>

            ) : notifications.length ===
              0 ? (

              <View
                style={
                  styles.emptyContainer
                }
              >
                <Text
                  style={styles.emptyText}
                >
                  No notifications found
                </Text>
              </View>

            ) : (

              /*
               * IMPORTANT:
               * This ScrollView belongs only
               * to the notification modal.
               */
              <ScrollView
                style={
                  styles.notificationList
                }
                contentContainerStyle={
                  styles.notificationListContent
                }
                showsVerticalScrollIndicator={
                  true
                }
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {notifications.map(
                  (item) => (

                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      style={[
                        styles.notificationItem,
                        !item.is_read &&
                        styles.unreadItem,
                      ]}
                      onPress={() =>
                        markAsRead(
                          item.id
                        )
                      }
                    >

                      <View
                        style={
                          styles.messageRow
                        }
                      >

                        {!item.is_read && (
                          <View
                            style={
                              styles.unreadDot
                            }
                          />
                        )}

                        <Text
                          style={
                            styles.notificationMessage
                          }
                        >
                          {item.message}
                        </Text>

                      </View>

                      <Text
                        style={
                          styles.notificationDate
                        }
                      >
                        {item.created_at}
                      </Text>

                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            )}

          </View>
        </View>
      </Modal >
    </View >
  );
}

const styles = StyleSheet.create({

  wrapper: {
    position: "relative",
    zIndex: 9999,
    elevation: 9999,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E5E5",

    justifyContent: "center",
    alignItems: "center",

    position: "relative",
  },

  badge: {
    position: "absolute",

    top: -7,
    right: -7,

    minWidth: 22,
    height: 22,

    paddingHorizontal: 5,

    borderRadius: 11,

    backgroundColor: "#FF0000",

    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  /*
   * Full-screen modal layer.
   */
  modalContainer: {
    flex: 1,
    position: "relative",
  },

  /*
   * Transparent background.
   * Tapping here closes notifications.
   */
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  /*
   * Notification popup.
   */
  dropdown: {
    position: "absolute",

    /*
     * Position near the header.
     */
    top: 100,
    right: 20,

    width: 320,


    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,
    shadowRadius: 12,

    elevation: 20,
  },

  dropdownHeader: {
    height: 52,

    paddingHorizontal: 14,

    justifyContent: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#D9DDE3",

    backgroundColor: "#FFFFFF",
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#202124",
  },

  /*
   * This is now the ONLY scrolling area.
   */
  notificationList: {
    flex: 1,
  },

  notificationListContent: {
    paddingBottom: 10,
  },

  notificationItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#D9DDE3",

    backgroundColor: "#FFFFFF",
  },

  unreadItem: {
    backgroundColor: "#FFFFFF",
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  unreadDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#0152A8",

    marginTop: 7,
    marginRight: 7,
  },

  notificationMessage: {
    flex: 1,

    fontSize: 15,
    lineHeight: 21,

    fontWeight: "700",

    color: "#202124",
  },

  notificationDate: {
    marginTop: 4,

    fontSize: 12,

    color: "#777777",
  },

  loadingContainer: {
    height: 100,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    height: 100,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#777777",
  },
});