import React from "react";
import {
    Pressable,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false
}: PrimaryButtonProps) {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </Pressable>

    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#0152A8",
        width: "80%",
        height: 55,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600"
    },
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        backgroundColor: "#9CA3AF",
    },
})