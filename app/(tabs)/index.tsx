
import CaseCard from "@/components/doctordashboard/CaseCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";
import FilterSection from "@/components/doctordashboard/FilterSection";
import api from "@/services/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/doctordashboard/StatCard";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCases, setTotalCases] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCases = async () => {
    try {
      setLoading(true);


      const response = await api.get("/cases", {
        params: {
          page: 1,
          limit: 10,
          status: statusFilter || undefined,
          deadline: deadlineFilter || undefined,
          search: searchTerm || undefined,
        },
      });



      console.log("Doctor Cases:", response.data);
      setCases(response.data.items);
      setTotalCases(response.data.total);

    } catch (error) {
      console.log("Error fetching doctor cases:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCases();
  }, [statusFilter, deadlineFilter]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <DashboardHeader />
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
          <StatCard totalPatients={totalCases} />
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
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            <Image
              source={require("@/assets/images/searchsvg.png")}
              style={styles.searchIcon}
              contentFit="contain"
            />
          </View>
          <FilterSection
            onApply={(status, deadline) => {
              setStatusFilter(status);
              setDeadlineFilter(deadline);
            }}
            onReset={() => {
              setStatusFilter("");
              setDeadlineFilter("");
            }}
          />
          {/* CASES */}
          {loading ? (
            <ActivityIndicator
              size="large"
              style={styles.loader}
            />
          ) : cases.length === 0 ? (
            <Text style={styles.noCases}>
              No cases found
            </Text>
          ) : (
            cases.map((item) => (
              <CaseCard
                key={item.id}
                caseData={item}

                onEdit={(caseData) => {
                  router.push({
                    pathname: "/edit-case",
                    params: {
                      caseId: String(caseData.id),
                    },
                  });
                }}

                onCaseDeleted={(deletedId) => {
                  setCases((prevCases) =>
                    prevCases.filter(
                      (caseItem) =>
                        caseItem.id !== deletedId
                    )
                  );

                  setTotalCases((prevTotal) =>
                    Math.max(prevTotal - 1, 0)
                  );
                }}
              />
            ))
          )}
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
    loader: {
      marginTop: 30,
    },

    noCases: {
      textAlign: "center",
      marginTop: 30,
      fontSize: 16,
      color: "#666",
    },
  }
);