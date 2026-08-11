
import CaseCard from "@/components/doctordashboard/CaseCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";
import FilterSection from "@/components/doctordashboard/FilterSection";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/doctordashboard/StatCard";

export default function Index() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <DashboardHeader notificationCount={10}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi Sagar,</Text>

            <Text style={styles.subHeading}>
              Here's your case overview
            </Text>
          </View>
          <StatCard />

          <View>
            <Text style={styles.latest}>
              Latest Cases
            </Text>

          </View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              style={styles.searchInput}
            />

            <Image
              source={require("@/assets/images/searchsvg.png")}
              style={styles.searchIcon}
              contentFit="contain"
            />
          </View>
          <FilterSection />
          <CaseCard />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: "#F7F9FC",
    },
    scrollContainer: {
      paddingBottom: 30,
    },

    greetingContainer: {
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 23.27,
    },

    greeting: {
      fontSize: 22,
      fontWeight: "700",
      fontFamily: "roboto",
      color: "#000",
    },

    subHeading: {
      marginTop: 6,
      fontSize: 16,
      color: "#6B7280",
      lineHeight: 22,
    },
    latest: {
      fontFamily: "Roboto",
      fontWeight: "600",
      fontSize: 20,
      marginLeft: 18,
      marginTop: 20,
    },

    searchContainer: {
      marginHorizontal: 18,
      marginTop: 16,
      height: 45,
      borderWidth: 1,
      borderColor: "#C2C6D4",
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
    },

    searchInput: {
      flex: 1,
      fontSize: 18,
      color: "#666666",
      paddingVertical: 0,
    },

    searchIcon: {
      width: 18,
      height: 18,
    },
  }
);