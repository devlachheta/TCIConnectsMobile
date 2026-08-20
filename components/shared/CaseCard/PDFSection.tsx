import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PDFSectionProps {
    fileName: string;
    onPress: () => void;
}

export default function PDFSection({
    fileName,
    onPress,
}: PDFSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Case PDF
            </Text>

            <TouchableOpacity
                style={styles.pdfButton}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Ionicons
                    name="eye-outline"
                    size={22}
                    color="#0152A8"
                />

                <Text style={styles.fileName}>
                    {fileName}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666666",
        marginBottom: 12,
    },

    pdfButton: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#F8FAFC",

        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",

        paddingVertical: 12,
        paddingHorizontal: 14,
    },

    fileName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "600",
        color: "#0152A8",
    },
});