import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

interface Props {
    title: string;
    value: string;
    icon: ImageSourcePropType;
    iconBackgroundColor: string;
    cardColor: string;
}

export default function StatItem({
    title,
    value,
    icon,
    iconBackgroundColor,
    cardColor,
}: Props) {
    return (
        <View style={[
            styles.card,
            {
                backgroundColor: cardColor,
            },
        ]}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: iconBackgroundColor, },

                ]}
            >
                <Image
                    source={icon}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </View>


            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        borderRadius: 18,
        padding: 16,
        marginBottom: 10,
        height: "auto"
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    value: {
        fontSize: 18,
        fontWeight: "500",
        color: "#000",
    },
    icon: {
        width: 26.14,
        height: 22,
    },

    title: {
        marginTop: 6,
        color: "#666",
        fontSize: 14,
    },
});