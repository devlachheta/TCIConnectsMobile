import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AdminCaseCard from "@/components/admindashboard/CaseCard/AdminCaseCard";
import AdminDrawer from "@/components/admindashboard/AdminDrawer";
import AdminHeader from "@/components/admindashboard/AdminHeader";
import FilterSection from "@/components/shared/FilterSection";
import StatCard from "@/components/shared/StatCard";
import { getCases } from "@/services/caseService";

export default function AdminDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");

  // =====================================================
  // WEBSOCKET REF
  // =====================================================

  const websocketRef = useRef<WebSocket | null>(null);

  // =====================================================
  // FILTER
  // =====================================================

  const handleApplyFilter = (
    selectedStatus: string,
    selectedDeadline: string
  ) => {
    setStatus(selectedStatus);
    setDeadline(selectedDeadline);
  };

  const handleResetFilter = () => {
    setSearch("");
    setStatus("");
    setDeadline("");
  };

  // =====================================================
  // LOAD INITIAL CASES
  // =====================================================

  const loadInitialCases = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCases({
        page: 1,
        limit: 10,
        search,
        status,
        deadline,
      });

      console.log(
        "ADMIN INITIAL CASES:",
        JSON.stringify(response, null, 2)
      );

      const newCases = Array.isArray(response?.items)
        ? response.items
        : [];

      setCases(newCases);
      setPage(1);

      setHasMore(newCases.length === 10);
    } catch (error) {
      console.error(
        "Error loading cases:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, deadline]);

  // =====================================================
  // LOAD CASES WHEN SEARCH / FILTER CHANGES
  // =====================================================

  useEffect(() => {
    loadInitialCases();
  }, [loadInitialCases]);

  // =====================================================
  // WEBSOCKET
  // =====================================================
  useEffect(() => {

    console.log(
      "===================================="
    );

    console.log(
      "CONNECTING ADMIN CASE WEBSOCKET"
    );

    const wsUrl =
      "wss://tcidentallab.com/ws/admin/cases";

    console.log(
      "ADMIN WS URL:",
      wsUrl
    );

    const ws = new WebSocket(wsUrl);

    websocketRef.current = ws;

    ws.onopen = () => {

      console.log(
        "ADMIN CASE WEBSOCKET CONNECTED"
      );

    };

    ws.onmessage = async (event) => {

      try {

        console.log(
          "ADMIN CASE WEBSOCKET MESSAGE:",
          event.data
        );

        const data =
          JSON.parse(event.data);

        console.log(
          "PARSED ADMIN CASE EVENT:",
          data
        );

        // =========================================
        // NEW CASE
        // =========================================

        if (data.type === "new_case") {

          console.log(
            "NEW CASE RECEIVED:",
            data.case_id
          );

          // Fetch page 1 again
          const response = await getCases({
            page: 1,
            limit: 10,
            search,
            status,
            deadline,
          });

          console.log(
            "REFRESHED ADMIN CASES AFTER WEBSOCKET:",
            JSON.stringify(response, null, 2)
          );

          const refreshedCases =
            Array.isArray(response?.items)
              ? response.items
              : [];

          console.log(
            "FIRST CASE AFTER REFRESH:",
            refreshedCases[0]?.id
          );

          setCases(refreshedCases);
          setPage(1);
          setHasMore(refreshedCases.length === 10);

          console.log(
            "ADMIN CASE LIST REFRESHED"
          );
        }

        // =========================================
        // CASE UPDATED
        // =========================================

        if (data.type === "case_updated") {

          console.log(
            "CASE UPDATED:",
            data.case_id
          );

          await loadInitialCases();
        }

        // =========================================
        // CASE DELETED
        // =========================================

        if (data.type === "case_deleted") {

          console.log(
            "CASE DELETED:",
            data.case_id
          );

          setCases(
            previousCases =>
              previousCases.filter(
                item =>
                  item.id !==
                  data.case_id
              )
          );
        }

      } catch (error) {

        console.error(
          "ADMIN WEBSOCKET MESSAGE ERROR:",
          error
        );

      }

    };

    ws.onerror = (error) => {

      console.error(
        "ADMIN CASE WEBSOCKET ERROR:",
        error
      );

    };

    ws.onclose = (event) => {

      console.log(
        "ADMIN CASE WEBSOCKET CLOSED",
        event.code,
        event.reason
      );

    };

    return () => {

      console.log(
        "CLOSING ADMIN CASE WEBSOCKET"
      );

      ws.close();

      websocketRef.current = null;

    };

  }, [loadInitialCases]);
  // =====================================================
  // LOAD MORE CASES
  // =====================================================

  const loadMoreCases = async () => {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      console.log(
        `Loading cases page ${nextPage}`
      );

      const response = await getCases({
        page: nextPage,
        limit: 10,
        search,
        status,
        deadline,
      });

      const newCases = Array.isArray(
        response?.items
      )
        ? response.items
        : [];

      console.log(
        `Received ${newCases.length} more cases`
      );

      if (newCases.length === 0) {
        setHasMore(false);
        return;
      }

      setCases(
        (previousCases) => [
          ...previousCases,
          ...newCases,
        ]
      );

      setPage(nextPage);

      if (
        newCases.length < 10
      ) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Error loading more cases:",
        error
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <View style={styles.mainContent}>

        {/* HEADER */}

        <AdminHeader
          onMenuPress={() =>
            setDrawerOpen(true)
          }
        />

        <ScrollView
          contentContainerStyle={
            styles.scrollContainer
          }
          showsVerticalScrollIndicator={false}
          onScroll={({
            nativeEvent,
          }) => {
            const {
              layoutMeasurement,
              contentOffset,
              contentSize,
            } = nativeEvent;

            const distanceFromBottom =
              contentSize.height -
              (
                layoutMeasurement.height +
                contentOffset.y
              );

            if (
              distanceFromBottom < 300
            ) {
              loadMoreCases();
            }
          }}
          scrollEventThrottle={400}
        >

          {/* GREETING */}

          <View
            style={
              styles.greetingContainer
            }
          >
            <Text
              style={styles.greeting}
            >
              Hi,
            </Text>

            <Text
              style={styles.subHeading}
            >
              Here's your case overview
            </Text>
          </View>

          {/* STAT CARDS */}

          <StatCard
            cards={[
              {
                title: "Total Doctor",
                value: "2",
                icon: require(
                  "@/assets/images/totalcasesimg.png"
                ),
                iconBackgroundColor:
                  "#FFFFFF",
                cardColor:
                  "#E3F2EF",
              },
              {
                title: "Recent Orders",
                value: "20",
                icon: require(
                  "@/assets/images/submitsvg.png"
                ),
                iconBackgroundColor:
                  "#FFFFFF",
                cardColor:
                  "#E3F1FA",
              },
            ]}
          />

          {/* LATEST ORDERS */}

          <Text
            style={styles.latest}
          >
            Latest Orders
          </Text>

          {/* SEARCH */}

          <View
            style={
              styles.searchContainer
            }
          >
            <TextInput
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              style={
                styles.searchInput
              }
              value={search}
              onChangeText={setSearch}
            />

            <Image
              source={require(
                "@/assets/images/searchsvg.png"
              )}
              style={
                styles.searchIcon
              }
              resizeMode="contain"
            />
          </View>

          {/* FILTER */}

          <FilterSection
            onApply={
              handleApplyFilter
            }
            onReset={
              handleResetFilter
            }
          />

          {/* CASES */}

          {loading ? (
            <Text
              style={
                styles.loadingText
              }
            >
              Loading cases...
            </Text>
          ) : cases.length === 0 ? (
            <Text
              style={
                styles.emptyText
              }
            >
              No cases found.
            </Text>
          ) : (
            <>
              {cases.map(
                (caseData) => (
                  <AdminCaseCard
                    key={
                      caseData.id
                    }
                    caseData={
                      caseData
                    }
                    onCaseDeleted={(
                      caseId
                    ) => {
                      setCases(
                        (
                          previousCases
                        ) =>
                          previousCases.filter(
                            (item) =>
                              item.id !==
                              caseId
                          )
                      );
                    }}
                    onCaseUpdated={
                      loadInitialCases
                    }
                  />
                )
              )}

              {loadingMore && (
                <View
                  style={
                    styles.loadingMoreContainer
                  }
                >
                  <ActivityIndicator
                    size="small"
                  />

                  <Text
                    style={
                      styles.loadingMoreText
                    }
                  >
                    Loading more cases...
                  </Text>
                </View>
              )}

              {!hasMore &&
                cases.length > 0 && (
                  <Text
                    style={
                      styles.endText
                    }
                  >
                    No more cases
                  </Text>
                )}
            </>
          )}
        </ScrollView>

        {/* DRAWER */}

        {drawerOpen && (
          <AdminDrawer
            onClose={() =>
              setDrawerOpen(false)
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  mainContent: {
    flex: 1,
  },

  scrollContainer: {
    paddingBottom: 30,
  },

  greetingContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 23,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },

  subHeading: {
    marginTop: 6,
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },

  latest: {
    fontWeight: "600",
    fontSize: 20,
    color: "#000",
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

  loadingText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
    color: "#6B7280",
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

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
    color: "#6B7280",
  },
});