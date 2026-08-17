import { StyleSheet, View } from "react-native";
import StatItem from "./StatItem";

interface StatCardProps {
    totalPatients: number;
}

export default function StatCard({
    totalPatients,
}: StatCardProps) {
    return (
        <View style={styles.container}>

            <StatItem
                title="Total Patient"
                value={String(totalPatients)}
                icon={require("@/assets/images/totalcasesimg.png")}
                iconBackgroundColor="#FFFFFF"
                cardColor="#E3F2EF"
            />

            <StatItem
                title="Create a new request"
                value="Submit a Case"
                icon={require("@/assets/images/submitsvg.png")}
                iconBackgroundColor="#FFFFFF"
                cardColor="#E3F1FA"
            />

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