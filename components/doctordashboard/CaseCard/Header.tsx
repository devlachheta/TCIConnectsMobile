import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
    caseId: string;
    status: string;
    onMenuPress?: () => void;
}

export default function Header({
    caseId,
    status,
    onMenuPress,
}: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require("@/assets/images/pdfsvg.png")}
                        style={styles.icon}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.caseTitle}>
                        Case #{caseId}
                    </Text>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={onMenuPress}
            >
                <Image
                    source={require("@/assets/images/buttonsvg.png")}
                    style={styles.buttonIcon}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 18,
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#E9EEF9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    icon: {
        width: 16.67,
        height: 13.33,
    },
    buttonIcon: {
        width: 4,
        height: 25
    },

    textContainer: {
        justifyContent: "center",
    },

    caseTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
    },

    statusBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#F2F2F2",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginTop: 8,
    },

    statusText: {
        fontSize: 15,
        fontFamily: "roboto",
        fontWeight: "500",
        color: "#808080",
    },

    menuButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
});