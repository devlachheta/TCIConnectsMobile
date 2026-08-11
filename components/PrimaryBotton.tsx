import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
};
export default function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    buttonStyle,
    textStyle,
}: PrimaryButtonProps) {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                buttonStyle,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={[styles.buttonText, textStyle]}>
                    {title}
                </Text>
            )}
        </Pressable>

    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        alignSelf: "center",
        height: 55,
        backgroundColor: "#024F9D",
        borderRadius: 50,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
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