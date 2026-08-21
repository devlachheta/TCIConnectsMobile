import CaseCard from "@/components/doctordashboard/CaseCard/DoctorCaseCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";
import FilterSection from "@/components/shared/FilterSection";
import api from "@/services/api";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cases() {

    const router = useRouter();

    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCases, setTotalCases] = useState(0);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [statusFilter, setStatusFilter] =
        useState("");

    const [deadlineFilter, setDeadlineFilter] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");


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

    // =========================================================
    // EDIT CASE
    // =========================================================

    const handleEditCase = (
        caseData: any
    ) => {

        console.log(
            "Opening Edit Case:",
            caseData.id
        );

        router.push({
            pathname: "/edit-case",
            params: {
                caseId: String(
                    caseData.id
                ),
            },
        });
    };

    return (
        <SafeAreaView
            style={styles.container}
        >

            {/* HEADER */}

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

                {/* PAGE TITLE */}

                <View
                    style={
                        styles.headerContainer
                    }
                >

                    <Text
                        style={styles.title}
                    >
                        All Cases
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Manage and track your cases
                    </Text>

                </View>

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
                        value={
                            searchTerm
                        }
                        onChangeText={
                            setSearchTerm
                        }
                        onSubmitEditing={
                            fetchCases
                        }
                    />

                    <Image
                        source={require(
                            "@/assets/images/searchsvg.png"
                        )}
                        style={
                            styles.searchIcon
                        }
                        contentFit="contain"
                    />

                </View>

                {/* FILTER */}

                <FilterSection

                    onApply={(
                        status,
                        deadline
                    ) => {

                        setStatusFilter(
                            status
                        );

                        setDeadlineFilter(
                            deadline
                        );

                    }}

                    onReset={() => {

                        setStatusFilter("");

                        setDeadlineFilter("");

                    }}

                />
                {/* ================= CASES ================= */}

                {loading ? (

                    <View style={styles.loaderContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#0152A8"
                        />

                        <Text style={styles.loadingText}>
                            Loading cases...
                        </Text>
                    </View>

                ) : cases.length === 0 ? (

                    <View style={styles.emptyContainer}>
                        <Text style={styles.noCases}>
                            No cases found
                        </Text>
                    </View>

                ) : (

                    <>
                        {/* CASE LIST */}

                        {cases.map((item) => (
                            <CaseCard
                                key={item.id}
                                caseData={item}

                                onEdit={handleEditCase}

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

                        {/* LOADING MORE */}

                        {loadingMore && (
                            <View
                                style={styles.loadingMoreContainer}
                            >
                                <ActivityIndicator
                                    size="small"
                                    color="#0152A8"
                                />

                                <Text
                                    style={styles.loadingMoreText}
                                >
                                    Loading more cases...
                                </Text>
                            </View>
                        )}

                        {/* END OF LIST */}

                        {!hasMore && cases.length > 0 && (
                            <Text style={styles.endText}>
                                No more cases
                            </Text>
                        )}
                    </>

                )}
            </ScrollView>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    scrollContainer: {
        paddingBottom: 30,
    },

    headerContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#021E48",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 15,
        color: "#6B7280",
    },

    searchContainer: {
        marginHorizontal: 18,
        marginTop: 10,
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

    listContent: {
        paddingBottom: 30,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 15,
        color: "#6B7280",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    noCases: {
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
});
