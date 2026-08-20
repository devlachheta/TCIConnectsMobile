import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FooterActionsProps {
    onEdit?: () => void;
    onDelete: () => void;
}
export default function FooterActions({
    onEdit,
    onDelete,
}: FooterActionsProps) {
    return (
        <View style={styles.container}>
            {onEdit && (
                <>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onEdit}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="create-outline"
                            size={15}
                            color="#0152A8"
                        />

                        <Text style={styles.editText}>
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />
                </>
            )}

            <View style={styles.divider} />

            <TouchableOpacity
                style={styles.button}
                onPress={onDelete}
                activeOpacity={0.8}
            >
                <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#E53935"
                />

                <Text style={styles.deleteText}>
                    Delete
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },

    button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 54,
    },

    editText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#0152A8",
    },

    divider: {
        width: 1,
        backgroundColor: "#E5E7EB",
    },

    deleteText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#E53935",
    },
});