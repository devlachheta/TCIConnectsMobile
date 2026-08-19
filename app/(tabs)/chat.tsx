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
import { SafeAreaView } from "react-native-safe-area-context";

import api from "@/services/api";

// =====================================================
// ADMIN CONFIGURATION
// =====================================================

// Change this if your admin has another ID.
const ADMIN_ID = 1;

const ADMIN_NAME = "Admin";

// If your admin profile image filename is known,
// you can put it here.
// Otherwise leave it null.
const ADMIN_PROFILE_IMAGE: string | null = null;

// =====================================================
// MESSAGE TYPE
// =====================================================

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: boolean;
    timestamp: string;
}

// =====================================================
// CHAT SCREEN
// =====================================================

export default function Chat() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const scrollViewRef =
        useRef<ScrollView>(null);

    const isNearBottom =
        useRef(true);

    const isFirstLoad =
        useRef(true);

    // =================================================
    // GET DOCTOR ID
    // =================================================

    const getDoctorId = async (): Promise<number | null> => {

        try {

            const storedUser =
                await AsyncStorage.getItem("user");

            if (!storedUser) {

                console.log(
                    "Doctor user not found"
                );

                return null;
            }

            const user =
                JSON.parse(storedUser);

            console.log(
                "Logged in Doctor ID:",
                user.id
            );

            return Number(user.id);

        } catch (error) {

            console.log(
                "Get doctor ID error:",
                error
            );

            return null;
        }
    };

    // =================================================
    // GET MESSAGES
    // =================================================

    const getMessages = async () => {

        try {

            const doctorId =
                await getDoctorId();

            if (!doctorId) {
                return;
            }

            const response =
                await api.get(
                    `/messages/${doctorId}/${ADMIN_ID}`
                );

            console.log(
                "Chat messages:",
                response.data
            );

            setMessages(response.data);

        } catch (error: any) {

            console.log(
                "Get messages error:",
                error?.response?.data ||
                error?.message ||
                error
            );

        } finally {

            setLoading(false);
        }
    };

    // =================================================
    // MARK MESSAGES AS READ
    // =================================================

    const markMessagesAsRead = async () => {

        try {

            const doctorId =
                await getDoctorId();

            if (!doctorId) {
                return;
            }

            await api.put(
                `/messages/read/${ADMIN_ID}/${doctorId}`
            );

            console.log(
                "Admin messages marked as read"
            );

        } catch (error: any) {

            console.log(
                "Mark messages as read error:",
                error?.response?.data ||
                error?.message ||
                error
            );
        }
    };

    // =================================================
    // OPEN CHAT
    // =================================================

    useEffect(() => {

        const openChat = async () => {

            await getMessages();

            await markMessagesAsRead();
        };

        openChat();

        isFirstLoad.current = true;
        isNearBottom.current = true;

    }, []);

    // =================================================
    // REFRESH MESSAGES
    // =================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                getMessages();

            }, 2000);

        return () => {

            clearInterval(interval);
        };

    }, []);

    // =================================================
    // HANDLE SCROLL
    // =================================================

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
            (
                contentOffset.y +
                layoutMeasurement.height
            );

        isNearBottom.current =
            distanceFromBottom < 80;
    };

    // =================================================
    // AUTO SCROLL
    // =================================================

    useEffect(() => {

        if (messages.length === 0) {
            return;
        }

        // First load
        if (isFirstLoad.current) {

            setTimeout(() => {

                scrollViewRef.current?.scrollToEnd({
                    animated: false,
                });

                isFirstLoad.current = false;

            }, 150);

            return;
        }

        // New message
        if (isNearBottom.current) {

            setTimeout(() => {

                scrollViewRef.current?.scrollToEnd({
                    animated: true,
                });

            }, 100);
        }

    }, [messages]);

    // =================================================
    // SEND MESSAGE
    // =================================================

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

            const doctorId =
                await getDoctorId();

            if (!doctorId) {
                return;
            }

            console.log(
                "Sending message:",
                {
                    sender_id: doctorId,
                    receiver_id: ADMIN_ID,
                    message: trimmedMessage,
                }
            );

            await api.post(
                "/send-message",
                {
                    sender_id: doctorId,
                    receiver_id: ADMIN_ID,
                    message: trimmedMessage,
                }
            );

            setMessage("");

            isNearBottom.current = true;

            await getMessages();

            setTimeout(() => {

                scrollViewRef.current?.scrollToEnd({
                    animated: true,
                });

            }, 150);

        } catch (error: any) {

            console.log(
                "Send message error:",
                error?.response?.data ||
                error?.message ||
                error
            );

        } finally {

            setSending(false);
        }
    };

    // =================================================
    // ADMIN PROFILE IMAGE
    // =================================================

    const profileImageUrl =
        ADMIN_PROFILE_IMAGE
            ? ADMIN_PROFILE_IMAGE.startsWith("http")
                ? ADMIN_PROFILE_IMAGE
                : `https://tcidentallab.com/tci-uploads/profile/${encodeURIComponent(
                    ADMIN_PROFILE_IMAGE
                )}`
            : null;

    // =================================================
    // UI
    // =================================================

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

            {/* =========================================
                HEADER
            ========================================= */}

            <SafeAreaView
                style={styles.safeArea}
                edges={["top"]}
            >
                <View style={styles.header}>

                    {/* Admin Profile */}

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
                                name="person"
                                size={22}
                                color="#777"
                            />

                        )}

                    </View>
                    {/* Admin Information */}

                    <View style={styles.adminInfo}>

                        <Text
                            style={styles.adminName}
                            numberOfLines={1}
                        >
                            {ADMIN_NAME}
                        </Text>

                        <Text style={styles.adminStatus}>
                            Admin
                        </Text>

                    </View>

                </View>
            </SafeAreaView>

            {/* =========================================
                MESSAGES
            ========================================= */}

            <View style={styles.messagesContainer}>

                {loading ? (

                    <View
                        style={
                            styles.loadingContainer
                        }
                    >

                        <ActivityIndicator
                            size="small"
                            color="#0864B9"
                        />

                        <Text
                            style={
                                styles.loadingText
                            }
                        >
                            Loading messages...
                        </Text>

                    </View>

                ) : messages.length === 0 ? (

                    <View
                        style={
                            styles.emptyContainer
                        }
                    >

                        <Ionicons
                            name="chatbubble-outline"
                            size={48}
                            color="#B8C2CC"
                        />

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            No messages yet
                        </Text>

                        <Text
                            style={
                                styles.emptySubText
                            }
                        >
                            Start a conversation with admin
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
                        showsVerticalScrollIndicator={
                            false
                        }
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >

                        {messages.map((item) => {

                            // Admin's message
                            const isAdminMessage =
                                String(
                                    item.sender_id
                                ) ===
                                String(ADMIN_ID);

                            return (

                                <View
                                    key={item.id}
                                    style={[
                                        styles.messageBubble,

                                        isAdminMessage
                                            ? styles.adminMessage
                                            : styles.doctorMessage,
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.messageText,

                                            isAdminMessage &&
                                            styles.adminMessageText,
                                        ]}
                                    >
                                        {item.message}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.messageTime,

                                            isAdminMessage &&
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

            {/* =========================================
                MESSAGE INPUT
            ========================================= */}

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
                            color="#FFFFFF"
                        />

                    ) : (

                        <Ionicons
                            name="send"
                            size={20}
                            color="#FFFFFF"
                        />

                    )}

                </TouchableOpacity>

            </View>

        </KeyboardAvoidingView>
    );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    safeArea: {
        backgroundColor: "#FFFFFF",
    },

    // ================================================
    // HEADER
    // ================================================

    header: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        paddingHorizontal: 18,
    },

    profile: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F1F3F5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E1E5EA",
    },

    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 22,
    },

    adminInfo: {
        flex: 1,
        justifyContent: "center",
    },

    adminName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
    },

    adminStatus: {
        fontSize: 12,
        color: "#777777",
        marginTop: 2,
    },

    // ================================================
    // MESSAGES
    // ================================================

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

    // ================================================
    // LOADING
    // ================================================

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: "#777777",
    },

    // ================================================
    // EMPTY
    // ================================================

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: "#777777",
        fontWeight: "600",
    },

    emptySubText: {
        marginTop: 5,
        fontSize: 13,
        color: "#999999",
    },

    // ================================================
    // MESSAGE BUBBLE
    // ================================================

    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 16,
        marginBottom: 10,
    },

    // Admin = LEFT

    adminMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderBottomLeftRadius: 4,
    },

    // Doctor = RIGHT

    doctorMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#0864B9",
        borderBottomRightRadius: 4,
    },

    messageText: {
        fontSize: 15,
        color: "#111111",
    },

    adminMessageText: {
        color: "#111111",
    },

    messageTime: {
        fontSize: 10,
        color: "#777777",
        marginTop: 4,
        alignSelf: "flex-end",
    },

    adminMessageTime: {
        color: "#777777",
    },

    // ================================================
    // INPUT
    // ================================================

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
        color: "#000000",
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