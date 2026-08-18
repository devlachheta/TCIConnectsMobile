import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import api from "../../../services/api";

type Doctor = {
  id: number | string;
  name: string;
  profile_image?: string | null;
  timestamp?: string | null;
  unread_count?: number;
};

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  timestamp: string;
};

type AdminDoctorChatProps = {
  doctor: Doctor;
  onBack: () => void;
};

export default function AdminDoctorChat({
  doctor,
  onBack,
}: AdminDoctorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // --------------------------------
  // SCROLL STATE
  // --------------------------------

  const isNearBottom = useRef(true);
  const isFirstLoad = useRef(true);

  // --------------------------------
  // GET ADMIN ID
  // --------------------------------

  const getAdminId = async (): Promise<number | null> => {
    try {
      const storedUser =
        await AsyncStorage.getItem("user");

      if (!storedUser) {
        console.log("Admin user not found");
        return null;
      }

      const user = JSON.parse(storedUser);

      return Number(user.id);
    } catch (error) {
      console.log("Get admin ID error:", error);
      return null;
    }
  };

  // --------------------------------
  // GET MESSAGES
  // --------------------------------

  const getMessages = async () => {
    try {
      const adminId = await getAdminId();

      if (!adminId) {
        return;
      }

      const response = await api.get(
        `/messages/${adminId}/${doctor.id}`
      );

      setMessages(response.data);
    } catch (error) {
      console.log(
        "Get messages error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // MARK MESSAGES AS READ
  // --------------------------------

  const markMessagesAsRead = async () => {
    try {
      const adminId = await getAdminId();

      if (!adminId) {
        return;
      }

      await api.put(
        `/messages/read/${doctor.id}/${adminId}`
      );

      console.log(
        "Messages marked as read"
      );
    } catch (error) {
      console.log(
        "Mark messages as read error:",
        error
      );
    }
  };

  // --------------------------------
  // OPEN CHAT
  // --------------------------------

  useEffect(() => {
    const openChat = async () => {
      await getMessages();
      await markMessagesAsRead();
    };

    openChat();

    isFirstLoad.current = true;
    isNearBottom.current = true;
  }, [doctor.id]);

  // --------------------------------
  // REFRESH MESSAGES EVERY 2 SECONDS
  // --------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [doctor.id]);

  // --------------------------------
  // CHECK WHETHER USER IS NEAR BOTTOM
  // --------------------------------

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const {
      layoutMeasurement,
      contentOffset,
      contentSize,
    } = event.nativeEvent;

    const distanceFromBottom =
      contentSize.height -
      (contentOffset.y +
        layoutMeasurement.height);

    isNearBottom.current =
      distanceFromBottom < 80;
  };

  // --------------------------------
  // AUTO SCROLL
  // --------------------------------

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    if (isFirstLoad.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({
          animated: false,
        });

        isFirstLoad.current = false;
      }, 150);

      return;
    }

    if (isNearBottom.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  }, [messages]);

  // --------------------------------
  // SEND MESSAGE
  // --------------------------------

  const sendMessage = async () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    try {
      setSending(true);

      const adminId = await getAdminId();

      if (!adminId) {
        return;
      }

      await api.post("/send-message", {
        sender_id: adminId,
        receiver_id: doctor.id,
        message: trimmedMessage,
      });

      setMessage("");

      isNearBottom.current = true;

      await getMessages();

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({
          animated: true,
        });
      }, 150);
    } catch (error) {
      console.log(
        "Send message error:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  // --------------------------------
  // PROFILE IMAGE URL
  // --------------------------------

  const profileImageUrl =
    doctor.profile_image
      ? `https://tcidentallab.com/uploads/profile/${encodeURIComponent(
        doctor.profile_image
      )}`
      : null;

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={0}
    >
      {/* =========================
          HEADER
      ========================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="#000"
          />
        </TouchableOpacity>

        {/* Doctor Profile Image */}
        <View style={styles.profile}>
          {profileImageUrl ? (
            <Image
              source={{
                uri: profileImageUrl,
              }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons
              name="person-outline"
              size={21}
              color="#777"
            />
          )}
        </View>

        {/* Doctor Name */}
        <View style={styles.doctorInfo}>
          <Text
            style={styles.doctorName}
            numberOfLines={1}
          >
            {doctor.name}
          </Text>
        </View>
      </View>

      {/* =========================
          MESSAGES
      ========================== */}

      <View style={styles.messagesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color="#0864B9"
            />

            <Text style={styles.loadingText}>
              Loading messages...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={
              styles.messageContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {messages.map((item) => {
              const isDoctorMessage =
                String(item.sender_id) ===
                String(doctor.id);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.messageBubble,
                    isDoctorMessage
                      ? styles.doctorMessage
                      : styles.adminMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      !isDoctorMessage &&
                      styles.adminMessageText,
                    ]}
                  >
                    {item.message}
                  </Text>

                  <Text
                    style={[
                      styles.messageTime,
                      !isDoctorMessage &&
                      styles.adminMessageTime,
                    ]}
                  >
                    {new Date(
                      item.timestamp
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* =========================
          MESSAGE INPUT
      ========================== */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!sending}
          textAlignVertical="center"
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            sending &&
            styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={sending}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color="#fff"
            />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color="#fff"
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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

    paddingHorizontal: 14,
  },

  backButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },

  profile: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#F1F3F5",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,

    overflow: "hidden",
  },

  profileImage: {
    width: 40,
    height: 40,

    borderRadius: 20,
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  // --------------------------------
  // MESSAGES
  // --------------------------------

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  messageList: {
    flex: 1,
  },

  messageContent: {
    flexGrow: 1,

    justifyContent: "flex-end",

    paddingTop: 12,
    paddingBottom: 12,
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
    marginTop: 8,

    fontSize: 14,
    color: "#777",
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
    fontSize: 15,
    color: "#777",
  },

  // --------------------------------
  // MESSAGE BUBBLE
  // --------------------------------

  messageBubble: {
    maxWidth: "78%",

    paddingHorizontal: 14,
    paddingVertical: 9,

    borderRadius: 16,

    marginBottom: 10,
  },

  doctorMessage: {
    alignSelf: "flex-start",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E5E5",

    borderBottomLeftRadius: 4,
  },

  adminMessage: {
    alignSelf: "flex-end",

    backgroundColor: "#0864B9",

    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    color: "#111",
  },

  adminMessageText: {
    color: "#FFFFFF",
  },

  messageTime: {
    fontSize: 10,

    color: "#777",

    marginTop: 4,

    alignSelf: "flex-end",
  },

  adminMessageTime: {
    color: "#E5E5E5",
  },

  // --------------------------------
  // INPUT
  // --------------------------------

  inputContainer: {
    flexDirection: "row",

    alignItems: "flex-end",

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  input: {
    flex: 1,

    minHeight: 45,
    maxHeight: 110,

    backgroundColor: "#F1F3F5",

    borderRadius: 22,

    paddingHorizontal: 18,
    paddingVertical: 10,

    fontSize: 15,
    color: "#000",

    marginRight: 8,
  },

  sendButton: {
    width: 45,
    height: 45,

    borderRadius: 23,

    backgroundColor: "#0864B9",

    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.6,
  },
});