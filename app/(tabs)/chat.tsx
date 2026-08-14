import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    getChatUser,
    getMessages,
    markChatNotificationsRead,
    markMessagesRead,
    sendMessage,
} from "../../services/chatService";

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: boolean;
    timestamp: string;
}

const ADMIN_ID = 1;

const Chat: React.FC = () => {
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        loadChat();
    }, []);

    useEffect(() => {
        if (!currentUserId) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const chatMessages = await getMessages(
                    currentUserId,
                    ADMIN_ID
                );

                setMessages(chatMessages);

                await markMessagesRead(
                    currentUserId,
                    ADMIN_ID
                );
            } catch (error) {
                console.log("Message refresh error:", error);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, [currentUserId]);

    const loadChat = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");

            if (!storedUser) {
                console.log("Logged-in user not found");
                return;
            }

            const loggedUser = JSON.parse(storedUser);
            const userId = Number(loggedUser.id);

            if (!userId) {
                console.log("Invalid user ID");
                return;
            }

            setCurrentUserId(userId);

            const adminData = await getChatUser(ADMIN_ID);
            setAdmin(adminData);

            await markChatNotificationsRead(userId);

            await markMessagesRead(
                userId,
                ADMIN_ID
            );

            const chatMessages = await getMessages(
                userId,
                ADMIN_ID
            );

            setMessages(chatMessages);
        } catch (error) {
            console.log("Chat loading error:", error);
        }
    };

    const handleSend = async () => {
        if (!message.trim() || !currentUserId) {
            return;
        }

        try {
            await sendMessage(
                currentUserId,
                ADMIN_ID,
                message.trim()
            );

            setMessage("");

            const updatedMessages = await getMessages(
                currentUserId,
                ADMIN_ID
            );

            setMessages(updatedMessages);

            await markMessagesRead(
                currentUserId,
                ADMIN_ID
            );
        } catch (error) {
            console.log("Send message error:", error);
        }
    };

    const renderMessage = ({
        item,
    }: {
        item: Message;
    }) => {
        const isDoctor =
            item.sender_id === currentUserId;

        return (
            <View
                style={[
                    styles.messageWrapper,
                    isDoctor
                        ? styles.doctorMessageWrapper
                        : styles.adminMessageWrapper,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isDoctor
                            ? styles.doctorBubble
                            : styles.adminBubble,
                    ]}
                >
                    <Text style={styles.messageText}>
                        {item.message}
                    </Text>

                    <View style={styles.messageMeta}>
                        <Text style={styles.messageTime}>
                            {new Date(
                                item.timestamp
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>

                        {isDoctor && (
                            <Text style={styles.messageStatus}>
                                {item.is_read
                                    ? " • Seen"
                                    : " • Sent"}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top"]}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                keyboardVerticalOffset={0}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#021E48"
                        />
                    </TouchableOpacity>

                    <View style={styles.adminAvatar}>
                        <Text style={styles.adminAvatarText}>
                            A
                        </Text>
                    </View>

                    <Text style={styles.headerTitle}>
                        {admin?.full_name || "Admin"}
                    </Text>
                </View>

                <FlatList
                    style={styles.messagesList}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={
                        styles.messagesContainer
                    }
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#8A8A8A"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="send"
                            size={19}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    header: {
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
        marginRight: 4,
    },

    adminAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8EEF7",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    adminAvatarText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#021E48",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#021E48",
    },

    messagesList: {
        flex: 1,
    },

    messagesContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 15,
    },

    messageWrapper: {
        width: "100%",
        marginBottom: 14,
    },

    doctorMessageWrapper: {
        alignItems: "flex-end",
    },

    adminMessageWrapper: {
        alignItems: "flex-start",
    },

    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
    },

    doctorBubble: {
        backgroundColor: "#DDF4E8",
        borderBottomRightRadius: 4,
    },

    adminBubble: {
        backgroundColor: "#F1F3F5",
        borderBottomLeftRadius: 4,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 21,
        color: "#1F2937",
    },

    messageMeta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 5,
    },

    messageTime: {
        fontSize: 10,
        color: "#777777",
    },

    messageStatus: {
        fontSize: 10,
        color: "#777777",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    textInput: {
        flex: 1,
        minHeight: 42,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: "#D6D9DE",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: "#1F2937",
        backgroundColor: "#F9FAFB",
    },

    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#021E48",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 7,
    },
});