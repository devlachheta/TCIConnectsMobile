
import CaseCard from "@/components/doctordashboard/CaseCard/DoctorCaseCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";
import FilterSection from "@/components/shared/FilterSection";
import api from "@/services/api";
import { Image } from "expo-image";
import { useEffect, useState, useRef } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "@/components/shared/StatCard";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index() {
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCases, setTotalCases] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const fetchCases = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cases", {
        params: {
          page: 1,
          limit: 10,
          status: statusFilter || undefined,
          deadline: deadlineFilter || undefined,
          search: searchTerm.trim() || undefined,
        },
      });

      const newCases = response.data.items || [];

      setCases(newCases);
      setTotalCases(response.data.total || 0);

      setPage(1);

      // Backend tells us exactly how many pages exist
      setHasMore(1 < response.data.pages);

    } catch (error: any) {
      console.log("========== CASE API ERROR ==========");
      console.log("Status:", error?.response?.status);
      console.log("Response:", error?.response?.data);
      console.log("URL:", error?.config?.url);
      console.log("Params:", error?.config?.params);
      console.log("====================================");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCases = async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      console.log(
        "Loading doctor cases page:",
        nextPage
      );

      const response = await api.get("/cases", {
        params: {
          page: nextPage,
          limit: 10,
          status: statusFilter || undefined,
          deadline: deadlineFilter || undefined,
          search: searchTerm.trim() || undefined,
        },
      });

      const newCases = response.data.items || [];

      console.log(
        "Received more doctor cases:",
        newCases.length
      );

      if (newCases.length === 0) {
        setHasMore(false);
        return;
      }

      // IMPORTANT:
      // Append instead of replacing
      setCases((previousCases) => [
        ...previousCases,
        ...newCases,
      ]);

      setPage(nextPage);

      // Use backend's pages value
      setHasMore(
        nextPage < response.data.pages
      );

    } catch (error: any) {
      console.log(
        "Error loading more doctor cases:",
        error?.response?.data ||
        error?.message ||
        error
      );
    } finally {
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCases();
    }, 500);
    return () => clearTimeout(timer);
  }, [statusFilter, deadlineFilter, searchTerm]);

  useEffect(() => {
    const loadDoctorName = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          setDoctorName(user.full_name || "");
        }
      } catch (error) {
        console.error(
          "Error loading doctor name:",
          error
        );
      }
    };

    loadDoctorName();
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = async () => {
      try {
        const storedUser =
          await AsyncStorage.getItem("user");

        if (!storedUser) {
          console.log("No logged-in user found");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?.id) {
          console.log("User ID not found");
          return;
        }

        const wsUrl =
          `wss://tcidentallab.com/ws/cases/${user.id}`;

        console.log(
          "Connecting Doctor WebSocket:",
          wsUrl
        );

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log(
            "Doctor WebSocket connected:",
            user.id
          );
        };

        ws.onmessage = (event) => {
          try {
            const message =
              JSON.parse(event.data);

            console.log(
              "Doctor WebSocket message:",
              message
            );

            if (
              message.type ===
              "case_status_updated"
            ) {
              console.log(
                "REAL-TIME STATUS UPDATE:",
                message.case_id,
                message.status
              );

              setCases((previousCases) =>
                previousCases.map(
                  (caseItem) =>
                    caseItem.id ===
                      message.case_id
                      ? {
                        ...caseItem,
                        status:
                          message.status,
                      }
                      : caseItem
                )
              );
            }
          } catch (error) {
            console.error(
              "WebSocket message parse error:",
              error
            );
          }
        };

        ws.onerror = (error) => {
          console.error(
            "Doctor WebSocket error:",
            error
          );
        };

        ws.onclose = () => {
          console.log(
            "Doctor WebSocket disconnected"
          );
        };

      } catch (error) {
        console.error(
          "WebSocket connection error:",
          error
        );
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <DashboardHeader />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            const {
              layoutMeasurement,
              contentOffset,
              contentSize,
            } = nativeEvent;

            const distanceFromBottom =
              contentSize.height -
              (layoutMeasurement.height +
                contentOffset.y);

            if (distanceFromBottom < 300) {
              loadMoreCases();
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, {doctorName}</Text>

            <Text style={styles.subHeading}>
              Here's your case overview
            </Text>
          </View>
          <StatCard
            cards={[
              {
                title: "Total Patient",
                value: String(totalCases),
                icon: require("@/assets/images/totalcasesimg.png"),
                iconBackgroundColor: "#FFFFFF",
                cardColor: "#E3F2EF",
              },
              {
                title: "Create a new request",
                value: "Submit a Case",
                icon: require("@/assets/images/submitsvg.png"),
                iconBackgroundColor: "#FFFFFF",
                cardColor: "#E3F1FA",
              },
            ]}
          />
          <View>
            <Text style={styles.latest}>
              Latest Patients
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
            <>
              {cases.map((item) => (
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
              ))}

              {loadingMore && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator
                    size="small"
                    color="#0152A8"
                  />

                  <Text style={styles.loadingMoreText}>
                    Loading more cases...
                  </Text>
                </View>
              )}

              {!hasMore && cases.length > 0 && (
                <Text style={styles.endText}>
                  No more cases
                </Text>
              )}
            </>
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
    loadingMoreContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
    },

    loadingMoreText: {
      marginTop: 8,
      fontSize: 14,
      color: "#6B7280",
    },

    endText: {
      textAlign: "center",
      paddingVertical: 20,
      fontSize: 14,
      color: "#9CA3AF",
    },
  }
);