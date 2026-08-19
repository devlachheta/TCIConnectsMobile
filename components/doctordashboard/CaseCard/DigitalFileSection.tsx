import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DigitalFile {
    id: number | string;
    fileName: string;
}

interface DigitalFileSectionProps {
    title: string;
    files: DigitalFile[];
    onDownload: (file: DigitalFile) => void;
}

export default function DigitalFileSection({
    title,
    files,
    onDownload,
}: DigitalFileSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{title}</Text>

            {files.map((file) => (
                <TouchableOpacity
                    key={file.id}
                    style={styles.fileContainer}
                    activeOpacity={0.8}
                    onPress={() => onDownload(file)}
                >
                    <View style={styles.leftSection}>
                        <Ionicons
                            name="document-text-outline"
                            size={22}
                            color="#0152A8"
                        />

                        <Text
                            style={styles.fileName}
                            numberOfLines={1}
                        >
                            {file.fileName}
                        </Text>
                    </View>

                    <Ionicons
                        name="download-outline"
                        size={22}
                        color="#0152A8"
                    />
                </TouchableOpacity>
            ))}
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

    fileContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: "#F8FAFC",

        borderWidth: 1,
        borderColor: "#E5E7EB",

        borderRadius: 10,

        paddingHorizontal: 14,
        paddingVertical: 14,

        marginBottom: 10,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    fileName: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "600",
        color: "#0152A8",
        flex: 1,
    },
});