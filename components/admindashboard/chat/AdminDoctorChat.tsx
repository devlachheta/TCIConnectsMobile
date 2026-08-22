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
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import api from "../../../services/api";

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
// MESSAGE TYPE
// =====================================================

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  timestamp: string;
};

// =====================================================
// PROPS
// =====================================================

type AdminDoctorChatProps = {
  doctor: Doctor;
  onBack: () => void;
};

// =====================================================
// ADMIN DOCTOR CHAT
// =====================================================

export default function AdminDoctorChat({
  doctor,
  onBack,
}: AdminDoctorChatProps) {
  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Keyboard height
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] =
    useState(true);

  const messagesOffset = useRef(0);

  // =====================================================
  // SCROLL
  // =====================================================

  const currentScrollY = useRef(0);
  const previousContentHeight = useRef(0);
  const shouldRestoreScroll = useRef(false);

  const scrollViewRef =
    useRef<ScrollView>(null);

  // =====================================================
  // WEBSOCKET
  // =====================================================

  const websocketRef =
    useRef<WebSocket | null>(null);

  // =====================================================
  // SCROLL STATE
  // =====================================================

  const isNearBottom = useRef(true);
  const isFirstLoad = useRef(true);

  // =====================================================
  // GET ADMIN ID
  // =====================================================

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
      console.log(
        "Get admin ID error:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // KEYBOARD HANDLING
  // =====================================================

  useEffect(() => {
    const keyboardShowSubscription =
      Keyboard.addListener(
        "keyboardDidShow",
        (event) => {
          const height =
            event.endCoordinates.height;

          console.log(
            "Keyboard height:",
            height
          );

          setKeyboardHeight(height);

          // Scroll to latest message after
          // keyboard has appeared.
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({
              animated: true,
            });
          }, 100);
        }
      );

    const keyboardHideSubscription =
      Keyboard.addListener(
        "keyboardDidHide",
        () => {
          console.log("Keyboard hidden");

          setKeyboardHeight(0);

          setTimeout(() => {
            if (isNearBottom.current) {
              scrollViewRef.current?.scrollToEnd({
                animated: false,
              });
            }
          }, 100);
        }
      );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  // =====================================================
  // GET MESSAGES
  // =====================================================

  const getMessages = async () => {
    try {
      const adminId = await getAdminId();

      if (!adminId) {
        return;
      }

      const response = await api.get(
        `/messages/${adminId}/${doctor.id}?limit=30&offset=0`
      );

      const newMessages: Message[] =
        response.data;

      console.log(
        `Loaded ${newMessages.length} messages`
      );

      setMessages(newMessages);

      messagesOffset.current =
        newMessages.length;

      setHasMoreMessages(
        newMessages.length === 30
      );
    } catch (error) {
      console.log(
        "Get messages error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD OLDER MESSAGES
  // =====================================================

  const loadOlderMessages = async () => {
    if (
      loadingOlder ||
      !hasMoreMessages
    ) {
      return;
    }

    try {
      const adminId = await getAdminId();

      if (!adminId) {
        return;
      }

      setLoadingOlder(true);

      previousContentHeight.current = 0;
      shouldRestoreScroll.current = true;

      const offset =
        messagesOffset.current;

      console.log(
        `Loading older messages: limit=30 offset=${offset}`
      );

      const response = await api.get(
        `/messages/${adminId}/${doctor.id}?limit=30&offset=${offset}`
      );

      const olderMessages: Message[] =
        response.data;

      console.log(
        `Received ${olderMessages.length} older messages`
      );

      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      setMessages(
        (previousMessages) => {
          const existingIds = new Set(
            previousMessages.map(
              (item) => item.id
            )
          );

          const uniqueOlderMessages =
            olderMessages.filter(
              (item) =>
                !existingIds.has(item.id)
            );

          return [
            ...uniqueOlderMessages,
            ...previousMessages,
          ];
        }
      );

      messagesOffset.current +=
        olderMessages.length;

      if (olderMessages.length < 30) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.log(
        "Load older messages error:",
        error
      );
    } finally {
      setLoadingOlder(false);
    }
  };

  // =====================================================
  // CONNECT WEBSOCKET
  // =====================================================

  const connectWebSocket = async (
    adminId: number
  ) => {
    try {
      const wsUrl =
        `wss://tcidentallab.com/ws/chat/${adminId}`;

      console.log(
        "Connecting Admin WebSocket:",
        wsUrl
      );

      const ws = new WebSocket(wsUrl);

      websocketRef.current = ws;

      ws.onopen = () => {
        console.log(
          "Admin WebSocket connected"
        );
      };

      ws.onmessage = (event) => {
        try {
          const incomingMessage: Message =
            JSON.parse(event.data);

          console.log(
            "Admin received WebSocket message:",
            incomingMessage
          );

          // =====================================================
          // ONLY CURRENT DOCTOR CONVERSATION
          // =====================================================

          const isCurrentConversationMessage =
            (
              String(
                incomingMessage.sender_id
              ) === String(doctor.id) &&
              String(
                incomingMessage.receiver_id
              ) === String(adminId)
            ) ||
            (
              String(
                incomingMessage.sender_id
              ) === String(adminId) &&
              String(
                incomingMessage.receiver_id
              ) === String(doctor.id)
            );

          if (
            !isCurrentConversationMessage
          ) {
            return;
          }

          setMessages(
            (prevMessages) => {
              const alreadyExists =
                prevMessages.some(
                  (item) =>
                    item.id ===
                    incomingMessage.id
                );

              if (alreadyExists) {
                return prevMessages;
              }

              return [
                ...prevMessages,
                incomingMessage,
              ];
            }
          );
        } catch (error) {
          console.log(
            "WebSocket message parse error:",
            error
          );
        }
      };

      ws.onerror = (error) => {
        console.log(
          "Admin WebSocket error:",
          error
        );
      };

      ws.onclose = (event) => {
        console.log(
          "Admin WebSocket closed:",
          event.code,
          event.reason
        );
      };
    } catch (error) {
      console.log(
        "Admin WebSocket connection error:",
        error
      );
    }
  };

  // =====================================================
  // MARK MESSAGES AS READ
  // =====================================================

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

  // =====================================================
  // OPEN CHAT
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const openChat = async () => {
      const adminId = await getAdminId();

      if (!adminId || !isMounted) {
        return;
      }

      await getMessages();

      await markMessagesAsRead();

      if (isMounted) {
        await connectWebSocket(adminId);
      }

      isFirstLoad.current = true;
      isNearBottom.current = true;
    };

    openChat();

    return () => {
      isMounted = false;

      if (websocketRef.current) {
        console.log(
          "Closing Admin WebSocket"
        );

        websocketRef.current.close();

        websocketRef.current = null;
      }
    };
  }, [doctor.id]);

  // =====================================================
  // HANDLE SCROLL
  // =====================================================

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const {
      layoutMeasurement,
      contentOffset,
      contentSize,
    } = event.nativeEvent;

    const currentY =
      contentOffset.y;

    currentScrollY.current =
      currentY;

    const distanceFromBottom =
      contentSize.height -
      (
        currentY +
        layoutMeasurement.height
      );

    isNearBottom.current =
      distanceFromBottom < 80;

    // =====================================================
    // LOAD OLDER MESSAGES
    // =====================================================

    if (
      currentY <= 50 &&
      !loadingOlder &&
      hasMoreMessages
    ) {
      previousContentHeight.current =
        contentSize.height;

      shouldRestoreScroll.current =
        true;

      loadOlderMessages();
    }
  };

  // =====================================================
  // RESTORE SCROLL AFTER LOADING OLDER MESSAGES
  // =====================================================

  const handleContentSizeChange = (
    width: number,
    height: number
  ) => {
    if (
      shouldRestoreScroll.current &&
      previousContentHeight.current > 0
    ) {
      const heightDifference =
        height -
        previousContentHeight.current;

      scrollViewRef.current?.scrollTo({
        y:
          currentScrollY.current +
          heightDifference,
        animated: false,
      });

      shouldRestoreScroll.current =
        false;
    }
  };

  // =====================================================
  // AUTO SCROLL
  // =====================================================

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

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const adminId =
        await getAdminId();

      if (!adminId) {
        return;
      }

      const ws =
        websocketRef.current;

      // =====================================================
      // CHECK WEBSOCKET
      // =====================================================

      if (
        !ws ||
        ws.readyState !==
        WebSocket.OPEN
      ) {
        console.log(
          "Admin WebSocket is not connected"
        );

        return;
      }

      console.log(
        "Admin sending message:",
        {
          receiver_id: doctor.id,
          message: trimmedMessage,
        }
      );

      ws.send(
        JSON.stringify({
          receiver_id:
            Number(doctor.id),
          message:
            trimmedMessage,
        })
      );

      setMessage("");

      isNearBottom.current =
        true;
    } catch (error) {
      console.log(
        "Send message error:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  const getProfileImageUrl = (
    profileImage?: string | null
  ): string | null => {
    if (!profileImage) {
      return null;
    }

    // Already complete URL
    if (
      profileImage.startsWith(
        "http://"
      ) ||
      profileImage.startsWith(
        "https://"
      )
    ) {
      return profileImage;
    }

    // Already contains upload path
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

  const profileImageUrl =
    getProfileImageUrl(
      doctor.profile_image
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <View style={styles.screen}>

      {/* =====================================================
          HEADER
      ===================================================== */}

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

        {/* Profile */}
        <View style={styles.profile}>
          {profileImageUrl ? (
            <Image
              source={{
                uri: profileImageUrl,
              }}
              style={styles.profileImage}
              onError={(error) => {
                console.log(
                  "CHAT PROFILE IMAGE ERROR:",
                  doctor.name
                );

                console.log(
                  "Original profile_image:",
                  doctor.profile_image
                );

                console.log(
                  "Generated image URL:",
                  profileImageUrl
                );

                console.log(
                  "Image error:",
                  error.nativeEvent
                );
              }}
            />
          ) : (
            <Ionicons
              name="person-outline"
              size={21}
              color="#777"
            />
          )}
        </View>

        {/* Doctor name */}
        <View style={styles.doctorInfo}>
          <Text
            style={styles.doctorName}
            numberOfLines={1}
          >
            {doctor.name}
          </Text>
        </View>
      </View>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

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
            contentContainerStyle={[
              styles.messageContent,
              {
                // Space for input when keyboard
                // is closed/open.
                paddingBottom:
                  keyboardHeight > 0
                    ? keyboardHeight + 80
                    : 80,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onContentSizeChange={
              handleContentSizeChange
            }
            scrollEventThrottle={16}
          >
            {/* Loading older messages */}
            {loadingOlder && (
              <View
                style={styles.loadingOlder}
              >
                <ActivityIndicator
                  size="small"
                  color="#0864B9"
                />

                <Text
                  style={
                    styles.loadingOlderText
                  }
                >
                  Loading older messages...
                </Text>
              </View>
            )}

            {/* Messages */}
            {messages.map((item) => {
              const isDoctorMessage =
                String(
                  item.sender_id
                ) ===
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
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* =====================================================
          MESSAGE INPUT
      ===================================================== */}

      <View
        style={[
          styles.inputContainer,
          {
            // Move input completely above
            // Android keyboard.
            bottom: keyboardHeight,
          },
        ]}
      >
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
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  // =====================================================
  // SCREEN
  // =====================================================

  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  // =====================================================
  // HEADER
  // =====================================================

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

  // =====================================================
  // MESSAGES
  // =====================================================

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
  },

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // EMPTY
  // =====================================================

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 15,

    color: "#777",
  },

  // =====================================================
  // MESSAGE BUBBLE
  // =====================================================

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

  // =====================================================
  // INPUT CONTAINER
  // =====================================================

  inputContainer: {
    position: "absolute",

    left: 0,
    right: 0,

    bottom: 0,

    flexDirection: "row",

    alignItems: "flex-end",

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  // =====================================================
  // INPUT
  // =====================================================

  input: {
    flex: 1,

    minHeight: 45,
    maxHeight: 100,

    backgroundColor: "#F1F3F5",

    borderRadius: 22,

    paddingHorizontal: 18,

    fontSize: 15,

    color: "#000",

    marginRight: 8,
  },

  // =====================================================
  // SEND BUTTON
  // =====================================================

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

  // =====================================================
  // LOADING OLDER
  // =====================================================

  loadingOlder: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 10,

    flexDirection: "row",

    gap: 8,
  },

  loadingOlderText: {
    fontSize: 13,

    color: "#777",
  },
});