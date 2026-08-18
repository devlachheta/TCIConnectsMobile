import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    Platform,
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
} from "../../services/chatService";


// ============================================================
// CONFIGURATION
// ============================================================

// IMPORTANT:
//
// Replace this with the IP address of the computer
// running your FastAPI backend.
//
// Example:
// http://192.168.1.10:8000
//
// DO NOT use localhost when testing on a physical phone.
//
// Your phone and computer must be on the same Wi-Fi network.
//
const BACKEND_HTTP_URL =
    "http://192.168.1.10:8000";


// WebSocket URL is automatically created.
//
// http:// → ws://
// https:// → wss://
//
const BACKEND_WS_URL = "wss://tcidentallab.com/api";

// Your admin ID
const ADMIN_ID = 1;


// ============================================================
// MESSAGE INTERFACE
// ============================================================

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: boolean;
    timestamp: string;
}


// ============================================================
// WEBSOCKET RESPONSE TYPES
// ============================================================

interface WebSocketMessage {
    type: string;
    data?: Message | any;
    message?: string;
}


// ============================================================
// CHAT COMPONENT
// ============================================================

const Chat: React.FC = () => {

    const router = useRouter();


    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [currentUserId, setCurrentUserId] =
        useState<number | null>(null);

    const [admin, setAdmin] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [connected, setConnected] =
        useState(false);

    const [sending, setSending] =
        useState(false);


    // --------------------------------------------------------
    // REFS
    // --------------------------------------------------------

    const flatListRef =
        useRef<FlatList<Message>>(null);

    const wsRef =
        useRef<WebSocket | null>(null);

    const reconnectTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    const manuallyClosedRef =
        useRef(false);

    const connectingRef =
        useRef(false);


    // ========================================================
    // SCROLL
    // ========================================================

    const scrollToLatest = (
        animated: boolean = true
    ) => {

        setTimeout(() => {

            flatListRef.current?.scrollToEnd({
                animated,
            });

        }, 100);
    };


    // ========================================================
    // GET TOKEN
    // ========================================================
    const getToken = async (): Promise<string | null> => {
        try {
            const token = await SecureStore.getItemAsync(
                "access_token"
            );

            console.log(
                "🔐 WebSocket Access Token:",
                token ? "FOUND" : "NOT FOUND"
            );

            return token;
        } catch (error) {
            console.log(
                "❌ Error reading WebSocket token:",
                error
            );

            return null;
        }
    };

    // ========================================================
    // ADD MESSAGE SAFELY
    // ========================================================

    const addMessage = (
        incomingMessage: Message
    ) => {

        setMessages((previousMessages) => {

            // Prevent duplicate messages
            const alreadyExists =
                previousMessages.some(
                    (msg) =>
                        msg.id ===
                        incomingMessage.id
                );

            if (alreadyExists) {
                return previousMessages;
            }

            return [
                ...previousMessages,
                incomingMessage,
            ];
        });


        scrollToLatest(true);
    };


    // ========================================================
    // WEBSOCKET MESSAGE HANDLER
    // ========================================================

    const handleWebSocketMessage = useCallback(
        async (
            event: MessageEvent
        ) => {

            try {

                const response:
                    WebSocketMessage =
                    JSON.parse(
                        event.data
                    );


                console.log(
                    "WebSocket message:",
                    response
                );


                // ==========================================
                // CONNECTION
                // ==========================================

                if (
                    response.type ===
                    "connected"
                ) {

                    console.log(
                        "Chat WebSocket connected"
                    );

                    setConnected(true);

                    return;
                }


                // ==========================================
                // NEW MESSAGE
                // ==========================================

                if (
                    response.type ===
                    "message"
                ) {

                    const incomingMessage =
                        response.data as Message;


                    if (!incomingMessage) {
                        return;
                    }


                    addMessage(
                        incomingMessage
                    );


                    // --------------------------------------
                    // If message came from Admin
                    // mark it read immediately because
                    // doctor is currently inside chat.
                    // --------------------------------------

                    if (
                        currentUserId &&
                        incomingMessage.sender_id ===
                        ADMIN_ID &&
                        incomingMessage.receiver_id ===
                        currentUserId &&
                        !incomingMessage.is_read
                    ) {

                        // Mark through REST API
                        try {

                            await markMessagesRead(
                                currentUserId,
                                ADMIN_ID
                            );

                        } catch (error) {

                            console.log(
                                "Read status error:",
                                error
                            );
                        }


                        // Update local message
                        setMessages(
                            (previousMessages) =>
                                previousMessages.map(
                                    (msg) => {

                                        if (
                                            msg.id ===
                                            incomingMessage.id
                                        ) {

                                            return {
                                                ...msg,
                                                is_read:
                                                    true,
                                            };
                                        }

                                        return msg;
                                    }
                                )
                        );
                    }

                    return;
                }


                // ==========================================
                // MESSAGE SENT CONFIRMATION
                // ==========================================

                if (
                    response.type ===
                    "message_sent"
                ) {

                    const sentMessage =
                        response.data as Message;


                    if (!sentMessage) {
                        return;
                    }


                    addMessage(
                        sentMessage
                    );


                    return;
                }


                // ==========================================
                // MESSAGE READ
                // ==========================================

                if (
                    response.type ===
                    "message_read"
                ) {

                    const readData =
                        response.data;


                    if (
                        !readData?.message_id
                    ) {
                        return;
                    }


                    setMessages(
                        (previousMessages) =>
                            previousMessages.map(
                                (msg) => {

                                    if (
                                        msg.id ===
                                        readData.message_id
                                    ) {

                                        return {
                                            ...msg,
                                            is_read:
                                                true,
                                        };
                                    }

                                    return msg;
                                }
                            )
                    );


                    return;
                }


                // ==========================================
                // PONG
                // ==========================================

                if (
                    response.type ===
                    "pong"
                ) {

                    return;
                }

            } catch (error) {

                console.log(
                    "WebSocket message parsing error:",
                    error
                );
            }

        },
        [currentUserId]
    );


    // ========================================================
    // CONNECT WEBSOCKET
    // ========================================================

    const connectWebSocket = useCallback(
        async (
            userId: number
        ) => {

            // Prevent duplicate connections
            if (
                connectingRef.current
            ) {
                return;
            }


            if (
                wsRef.current &&
                (
                    wsRef.current.readyState ===
                    WebSocket.OPEN ||

                    wsRef.current.readyState ===
                    WebSocket.CONNECTING
                )
            ) {

                return;
            }


            connectingRef.current =
                true;


            try {

                const token =
                    await getToken();


                if (!token) {

                    console.log(
                        "JWT token not found"
                    );

                    connectingRef.current =
                        false;

                    return;
                }


                manuallyClosedRef.current =
                    false;

                const wsUrl =
                    `${BACKEND_WS_URL}/mobile-chat/ws/${userId}/${ADMIN_ID}?token=${encodeURIComponent(
                        token
                    )}`;

                console.log(
                    "Connecting WebSocket:",
                    wsUrl.replace(
                        token,
                        "***"
                    )
                );


                const ws =
                    new WebSocket(
                        wsUrl
                    );


                wsRef.current =
                    ws;


                // --------------------------------------------
                // OPEN
                // --------------------------------------------

                ws.onopen = () => {

                    console.log(
                        "WebSocket OPEN"
                    );

                    connectingRef.current =
                        false;

                    setConnected(true);
                };


                // --------------------------------------------
                // MESSAGE
                // --------------------------------------------

                ws.onmessage =
                    handleWebSocketMessage;


                // --------------------------------------------
                // ERROR
                // --------------------------------------------

                ws.onerror = (
                    error
                ) => {

                    console.log(
                        "WebSocket ERROR:",
                        error
                    );

                    setConnected(
                        false
                    );
                };


                // --------------------------------------------
                // CLOSE
                // --------------------------------------------

                ws.onclose = (
                    event
                ) => {

                    console.log(
                        "WebSocket CLOSED:",
                        event.code,
                        event.reason
                    );


                    connectingRef.current =
                        false;

                    setConnected(
                        false
                    );


                    wsRef.current =
                        null;


                    // Don't reconnect if screen
                    // intentionally closed.
                    if (
                        manuallyClosedRef.current
                    ) {

                        return;
                    }


                    // ----------------------------------------
                    // Reconnect after 3 seconds
                    // ----------------------------------------

                    reconnectTimeoutRef.current =
                        setTimeout(() => {

                            connectWebSocket(
                                userId
                            );

                        }, 3000);
                };


            } catch (error) {

                console.log(
                    "WebSocket connection error:",
                    error
                );

                connectingRef.current =
                    false;

                setConnected(
                    false
                );

            }

        },
        [
            handleWebSocketMessage,
        ]
    );


    // ========================================================
    // LOAD CHAT
    // ========================================================

    const loadChat = async () => {

        try {

            setLoading(true);


            // ------------------------------------------------
            // Get logged-in user
            // ------------------------------------------------

            const storedUser =
                await AsyncStorage.getItem(
                    "user"
                );


            if (!storedUser) {

                console.log(
                    "Logged-in user not found"
                );

                return;
            }


            const loggedUser =
                JSON.parse(
                    storedUser
                );


            const userId =
                Number(
                    loggedUser.id
                );


            if (!userId) {

                console.log(
                    "Invalid user ID"
                );

                return;
            }


            setCurrentUserId(
                userId
            );


            // ------------------------------------------------
            // Get Admin
            // ------------------------------------------------

            try {

                const adminData =
                    await getChatUser(
                        ADMIN_ID
                    );

                setAdmin(
                    adminData
                );

            } catch (error) {

                console.log(
                    "Admin loading error:",
                    error
                );
            }


            // ------------------------------------------------
            // Clear chat notification
            // ------------------------------------------------

            try {

                await markChatNotificationsRead(
                    userId
                );

            } catch (error) {

                console.log(
                    "Chat notification error:",
                    error
                );
            }


            // ------------------------------------------------
            // Load old messages
            // ------------------------------------------------

            const chatMessages =
                await getMessages(
                    userId,
                    ADMIN_ID
                );


            // ------------------------------------------------
            // Store messages
            // ------------------------------------------------

            setMessages(
                chatMessages || []
            );


            // ------------------------------------------------
            // Mark unread admin messages
            // ------------------------------------------------

            const hasUnreadAdminMessage =
                chatMessages.some(
                    (msg: Message) =>
                        msg.sender_id ===
                        ADMIN_ID &&

                        msg.receiver_id ===
                        userId &&

                        !msg.is_read
                );


            if (
                hasUnreadAdminMessage
            ) {

                try {

                    await markMessagesRead(
                        userId,
                        ADMIN_ID
                    );


                    setMessages(
                        (previousMessages) =>
                            previousMessages.map(
                                (msg) => {

                                    if (
                                        msg.sender_id ===
                                        ADMIN_ID &&

                                        msg.receiver_id ===
                                        userId
                                    ) {

                                        return {
                                            ...msg,
                                            is_read:
                                                true,
                                        };
                                    }

                                    return msg;
                                }
                            )
                    );

                } catch (error) {

                    console.log(
                        "Mark read error:",
                        error
                    );
                }
            }


            // ------------------------------------------------
            // Scroll
            // ------------------------------------------------

            setTimeout(() => {

                flatListRef.current?.scrollToEnd({
                    animated: false,
                });

            }, 200);


            // ------------------------------------------------
            // Connect WebSocket
            // ------------------------------------------------

            await connectWebSocket(
                userId
            );


        } catch (error) {

            console.log(
                "Chat loading error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadChat();


        return () => {

            manuallyClosedRef.current =
                true;


            // Cancel reconnect
            if (
                reconnectTimeoutRef.current
            ) {

                clearTimeout(
                    reconnectTimeoutRef.current
                );

                reconnectTimeoutRef.current =
                    null;
            }


            // Close WebSocket
            if (
                wsRef.current
            ) {

                wsRef.current.close();

                wsRef.current =
                    null;
            }


            setConnected(
                false
            );
        };

    }, []);


    // ========================================================
    // SEND MESSAGE
    // ========================================================

    const handleSend = () => {

        const trimmedMessage =
            message.trim();


        // Don't send empty
        if (
            !trimmedMessage
        ) {
            return;
        }


        // No user
        if (
            !currentUserId
        ) {
            return;
        }


        // WebSocket not connected
        if (
            !wsRef.current ||
            wsRef.current.readyState !==
            WebSocket.OPEN
        ) {

            console.log(
                "WebSocket is not connected"
            );

            return;
        }


        try {

            setSending(
                true
            );


            // ------------------------------------------------
            // Send through WebSocket
            // ------------------------------------------------

            wsRef.current.send(
                JSON.stringify({
                    type: "message",
                    message:
                        trimmedMessage,
                })
            );


            // Clear input
            setMessage("");


            // Backend will send
            // "message_sent" confirmation.
            //
            // We DON'T add the message
            // locally here because that would
            // create a duplicate.


        } catch (error) {

            console.log(
                "Send WebSocket error:",
                error
            );

        } finally {

            setSending(
                false
            );
        }
    };


    // ========================================================
    // RENDER MESSAGE
    // ========================================================

    const renderMessage = ({
        item,
    }: {
        item: Message;
    }) => {

        const isDoctor =
            item.sender_id ===
            currentUserId;


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

                    <Text
                        style={
                            styles.messageText
                        }
                    >
                        {item.message}
                    </Text>


                    <View
                        style={
                            styles.messageMeta
                        }
                    >

                        <Text
                            style={
                                styles.messageTime
                            }
                        >
                            {new Date(
                                item.timestamp
                            ).toLocaleTimeString(
                                [],
                                {
                                    hour:
                                        "2-digit",
                                    minute:
                                        "2-digit",
                                }
                            )}
                        </Text>


                        {isDoctor && (

                            <Text
                                style={
                                    styles.messageStatus
                                }
                            >

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


    // ========================================================
    // LOADING SCREEN
    // ========================================================

    if (loading) {

        return (

            <SafeAreaView
                style={
                    styles.safeArea
                }
            >

                <View
                    style={
                        styles.loadingContainer
                    }
                >

                    <ActivityIndicator
                        size="large"
                        color="#021E48"
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Loading chat...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }


    // ========================================================
    // UI
    // ========================================================

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

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <View
                    style={styles.header}
                >

                    <TouchableOpacity
                        style={
                            styles.backButton
                        }
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.7}
                    >

                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#021E48"
                        />

                    </TouchableOpacity>


                    <View
                        style={
                            styles.adminAvatar
                        }
                    >

                        <Text
                            style={
                                styles.adminAvatarText
                            }
                        >
                            A
                        </Text>

                    </View>


                    <View
                        style={
                            styles.headerInfo
                        }
                    >

                        <Text
                            style={
                                styles.headerTitle
                            }
                        >
                            {admin?.full_name ||
                                "Admin"}
                        </Text>


                        <View
                            style={
                                styles.connectionRow
                            }
                        >

                            <View
                                style={[
                                    styles.connectionDot,

                                    connected
                                        ? styles.onlineDot
                                        : styles.offlineDot,
                                ]}
                            />

                            <Text
                                style={
                                    styles.connectionText
                                }
                            >
                                {connected
                                    ? "Online"
                                    : "Connecting..."}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* ================================================= */}
                {/* MESSAGES */}
                {/* ================================================= */}

                <FlatList
                    ref={flatListRef}

                    style={
                        styles.messagesList
                    }

                    data={messages}

                    renderItem={
                        renderMessage
                    }

                    keyExtractor={(item) =>
                        item.id.toString()
                    }

                    showsVerticalScrollIndicator={
                        false
                    }

                    keyboardShouldPersistTaps="handled"

                    contentContainerStyle={
                        styles.messagesContainer
                    }

                    keyboardDismissMode="interactive"

                    onContentSizeChange={() => {

                        if (
                            messages.length > 0
                        ) {

                            scrollToLatest(
                                false
                            );
                        }
                    }}
                />


                {/* ================================================= */}
                {/* INPUT */}
                {/* ================================================= */}

                <View
                    style={
                        styles.inputContainer
                    }
                >

                    <TextInput
                        style={
                            styles.textInput
                        }

                        placeholder={
                            connected
                                ? "Type a message..."
                                : "Connecting..."
                        }

                        placeholderTextColor="#8A8A8A"

                        value={
                            message
                        }

                        onChangeText={
                            setMessage
                        }

                        multiline

                        editable={
                            connected &&
                            !sending
                        }

                        onSubmitEditing={() => {

                            if (
                                Platform.OS !==
                                "ios"
                            ) {

                                handleSend();
                            }

                        }}
                    />


                    <TouchableOpacity
                        style={[
                            styles.sendButton,

                            (
                                !connected ||
                                !message.trim() ||
                                sending
                            ) &&
                            styles.sendButtonDisabled,
                        ]}

                        onPress={
                            handleSend
                        }

                        disabled={
                            !connected ||
                            !message.trim() ||
                            sending
                        }

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


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },


    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },


    // ========================================================
    // LOADING
    // ========================================================

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },


    loadingText: {
        marginTop: 10,
        fontSize: 15,
        color: "#6B7280",
    },


    // ========================================================
    // HEADER
    // ========================================================

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


    headerInfo: {
        flex: 1,
    },


    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#021E48",
    },


    connectionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },


    connectionDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 5,
    },


    onlineDot: {
        backgroundColor: "#22C55E",
    },


    offlineDot: {
        backgroundColor: "#9CA3AF",
    },


    connectionText: {
        fontSize: 11,
        color: "#6B7280",
    },


    // ========================================================
    // MESSAGES
    // ========================================================

    messagesList: {
        flex: 1,
    },


    messagesContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
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


    // ========================================================
    // INPUT
    // ========================================================

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
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


    sendButtonDisabled: {
        opacity: 0.45,
    },

});