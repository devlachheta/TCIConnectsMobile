import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "@/components/doctordashboard/doctordashboardheader";

export default function Home() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
            <DashboardHeader />
        </SafeAreaView>
    );
}