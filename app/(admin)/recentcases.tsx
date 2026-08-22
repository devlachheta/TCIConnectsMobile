import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FilterSection from "@/components/shared/FilterSection";
import AdminCaseCard from "@/components/admindashboard/CaseCard/AdminCaseCard";
import { getCases } from "@/services/caseService";

export default function RecentCases() {
  const router = useRouter();

  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  // =====================================================
  // LOAD INITIAL CASES
  // =====================================================

  const loadInitialCases = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCases({
        page: 1,
        limit: 10,
        search: "",
        status,
        deadline,
      });

      console.log(
        "ADMIN RECENT CASES:",
        JSON.stringify(response, null, 2)
      );

      const newCases = Array.isArray(response?.items)
        ? response.items
        : [];

      setCases(newCases);
      setPage(1);
      setHasMore(newCases.length === 10);

    } catch (error: any) {
      console.error(
        "Error fetching recent cases:",
        error?.response?.data ||
        error?.message ||
        error
      );
    } finally {
      setLoading(false);
    }
  }, [status, deadline]);
  // =====================================================
  // INITIAL LOAD / FILTER CHANGE
  // =====================================================

  useEffect(() => {
    loadInitialCases();
  }, [loadInitialCases]);

  // =====================================================
  // ADMIN CASE WEBSOCKET
  // =====================================================


  useEffect(() => {
    console.log("====================================");
    console.log("CONNECTING ADMIN CASE WEBSOCKET");

    const wsUrl =
      "wss://tcidentallab.com/ws/admin/cases";

    console.log("ADMIN WS URL:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(
        "ADMIN CASE WEBSOCKET CONNECTED"
      );
    };

    ws.onmessage = (event) => {
      try {
        console.log(
          "ADMIN CASE WEBSOCKET MESSAGE:",
          event.data
        );

        const data = JSON.parse(event.data);

        console.log(
          "PARSED ADMIN CASE EVENT:",
          data
        );

        // NEW CASE
        if (data.type === "new_case") {
          console.log(
            "NEW CASE RECEIVED:",
            data.case_id
          );

          loadInitialCases();
        }

        // CASE UPDATED
        else if (data.type === "case_updated") {
          console.log(
            "CASE UPDATE RECEIVED:",
            data.case_id
          );

          loadInitialCases();
        }

        // CASE DELETED
        else if (data.type === "case_deleted") {
          console.log(
            "CASE DELETE RECEIVED:",
            data.case_id
          );

          setCases((previousCases) =>
            previousCases.filter(
              (item) => item.id !== data.case_id
            )
          );
        }

      } catch (error) {
        console.error(
          "ADMIN WEBSOCKET MESSAGE PARSE ERROR:",
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

      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };

  }, []);

  // =====================================================
  // LOAD MORE CASES
  // =====================================================

  const loadMoreCases = async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      console.log(
        `Loading recent cases page ${nextPage}`
      );

      const response = await getCases({
        page: nextPage,
        limit: 10,
        search: "",
        status,
        deadline,
      });

      const newCases = Array.isArray(response?.items)
        ? response.items
        : [];

      console.log(
        `Received ${newCases.length} more recent cases`
      );

      if (newCases.length === 0) {
        setHasMore(false);
        return;
      }

      setCases((previousCases) => [
        ...previousCases,
        ...newCases,
      ]);

      setPage(nextPage);

      if (newCases.length < 10) {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error(
        "Error loading more recent cases:",
        error?.response?.data ||
        error?.message ||
        error
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const handleApplyFilter = (
    selectedStatus: string,
    selectedDeadline: string
  ) => {
    console.log(
      "Recent Cases Filter:",
      {
        status: selectedStatus,
        deadline: selectedDeadline,
      }
    );

    setStatus(selectedStatus);
    setDeadline(selectedDeadline);
  };

  const handleResetFilter = () => {
    setStatus("");
    setDeadline("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          All Cases
        </Text>
      </View>

      {/* ================= CONTENT ================= */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
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
        {/* ================= TITLE ================= */}

        <Text style={styles.pageTitle}>
          Recent Cases
        </Text>

        <Text style={styles.pageSubtitle}>
          View all recent cases
        </Text>

        {/* ================= FILTER ================= */}

        <FilterSection
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />

        {/* ================= CASES ================= */}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0152A8"
            style={styles.loader}
          />
        ) : cases.length === 0 ? (
          <Text style={styles.emptyText}>
            No cases found.
          </Text>
        ) : (
          <>
            {cases.map((caseData) => (
              <AdminCaseCard
                key={caseData.id}
                caseData={caseData}
                onCaseDeleted={(caseId) => {
                  setCases(
                    (previousCases) =>
                      previousCases.filter(
                        (item) =>
                          item.id !== caseId
                      )
                  );
                }}
                onCaseUpdated={
                  loadInitialCases
                }
              />
            ))}

            {/* ================= LOADING MORE ================= */}

            {loadingMore && (
              <View
                style={
                  styles.loadingMoreContainer
                }
              >
                <ActivityIndicator
                  size="small"
                  color="#0152A8"
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

            {/* ================= END ================= */}

            {!hasMore &&
              cases.length > 0 && (
                <Text style={styles.endText}>
                  No more cases
                </Text>
              )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  // =====================================================
  // CONTENT
  // =====================================================

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#063B6D",
    marginHorizontal: 18,
    marginTop: 20,
  },

  pageSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginHorizontal: 18,
    marginTop: 5,
  },

  // =====================================================
  // LOADING
  // =====================================================

  loader: {
    marginTop: 40,
  },

  // =====================================================
  // EMPTY
  // =====================================================

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
  },

  // =====================================================
  // LOAD MORE
  // =====================================================

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
});