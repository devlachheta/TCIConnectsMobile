import CaseCard from "@/components/doctordashboard/CaseCard";
import DashboardHeader from "@/components/doctordashboard/DashboardHeader";
import FilterSection from "@/components/doctordashboard/FilterSection";
import api from "@/services/api";
import { Image } from "expo-image";
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

    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] =
        useState("");

    const [deadlineFilter, setDeadlineFilter] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const fetchCases = async () => {
        try {

            setLoading(true);

            const response = await api.get(
                "/cases",
                {
                    params: {
                        page: 1,
                        limit: 10,
                        status:
                            statusFilter || undefined,
                        deadline:
                            deadlineFilter || undefined,
                        search:
                            searchTerm || undefined,
                    },
                }
            );

            console.log(
                "Cases:",
                response.data
            );

            setCases(
                response.data.items || []
            );

        } catch (error: any) {

            console.log(
                "Error fetching cases:",
                error?.response?.data || error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCases();
    }, [
        statusFilter,
        deadlineFilter,
    ]);

    return (
        <SafeAreaView
            style={styles.container}
        >

            {/* HEADER */}

            <DashboardHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >

                {/* PAGE TITLE */}

                <View
                    style={styles.headerContainer}
                >

                    <Text style={styles.title}>
                        All Cases
                    </Text>

                    <Text style={styles.subtitle}>
                        Manage and track your cases
                    </Text>

                </View>

                {/* SEARCH */}

                <View
                    style={styles.searchContainer}
                >

                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#8E8E93"
                        style={styles.searchInput}
                        value={searchTerm}
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
                        style={styles.searchIcon}
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

                {/* CASES */}

                {loading ? (

                    <View
                        style={styles.loaderContainer}
                    >

                        <ActivityIndicator
                            size="large"
                            color="#0152A8"
                        />

                        <Text
                            style={styles.loadingText}
                        >
                            Loading cases...
                        </Text>

                    </View>

                ) : cases.length === 0 ? (

                    <View
                        style={styles.emptyContainer}
                    >

                        <Text
                            style={styles.noCases}
                        >
                            No cases found
                        </Text>

                    </View>

                ) : (
                    cases.map((item) => (
                        <CaseCard
                            key={item.id}
                            caseData={item}
                        />
                    ))
                )}
            </ScrollView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
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

});