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
        width: "100%",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: 30,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 50,
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        height: 55,
        fontSize: 16,
        alignSelf: "center",
        alignItems: "center",
        color: "#fff"
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