import { ImageSourcePropType, StyleSheet, View } from "react-native";
import StatItem from "./StatItem";

interface StatCardItem {
    title: string;
    value: string;
    icon: ImageSourcePropType;
    iconBackgroundColor: string;
    cardColor: string;
}

interface StatCardProps {
    cards: StatCardItem[];
}

export default function StatCard({ cards }: StatCardProps) {
    return (
        <View style={styles.container}>
            {cards.map((card, index) => (
                <StatItem
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    iconBackgroundColor={card.iconBackgroundColor}
                    cardColor={card.cardColor}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        marginTop: 10,
        marginBottom: 0,
    },
});