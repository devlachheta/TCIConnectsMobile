import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface AuthInputProps extends TextInputProps {

    error?: string;
}

export default function AuthInput({
    error,
    secureTextEntry,
    ...props
}: AuthInputProps) {
    const [hidePassword, setHidePassword] = useState(secureTextEntry);
    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={hidePassword}
                    placeholderTextColor="#fff"
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
                            color="#fff"
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
        width: "80%",
        alignSelf: "center",

    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: 18,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 48,
    },

    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        alignSelf: "center",
        alignItems: "center",
        color: "#fff",

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