import { StyleSheet, View } from "react-native";
import StatItem from "./StatItem";

export default function StatCard() {
    return (
        <>
            <View style={styles.container}>
                <StatItem
                    title="Total Patient"
                    value="125"
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

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        marginTop: 10,
        marginBottom: 0
    },
});