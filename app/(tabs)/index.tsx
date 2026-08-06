
import { SafeAreaView } from "react-native-safe-area-context";

import StatCard from "../../components/doctordashboard/StatCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";

export default function Index() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
        <DashboardHeader notificationCount={10}
        />
        <StatCard />
      </SafeAreaView>
    </>
  )
}
