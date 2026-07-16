import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
    label: string;
    error?: string;
}

export default function AuthInput({
    label,
    error,
    secureTextEntry,
    ...props
}: AuthInputProps) {
    const [hidePassword, setHidePassword] = useState(secureTextEntry);
    return (
        <View style={styles.container}>

            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={hidePassword}
                    placeholderTextColor="#94A3B8"
                    {...props}
                />

                {secureTextEntry && (
                    <Pressable
                        onPress={() => setHidePassword(!hidePassword)}
                        style={styles.icon}
                    >
                        <Ionicons
                            name={hidePassword ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#64748B"
                        />
                    </Pressable>
                )}
            </View>

            {/* Error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 18,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: 8,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        height: 55,
        fontSize: 16,
        alignSelf: "center",
        alignItems: "center"
    },

    icon: {
        paddingLeft: 10,
    },

    error: {
        marginTop: 5,
        color: "#EF4444",
        fontSize: 13,
    },
});