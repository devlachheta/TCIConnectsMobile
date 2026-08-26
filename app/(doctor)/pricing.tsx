import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../services/api";

export default function Pricing() {
  const [pricing, setPricing] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const websocketRef = useRef<WebSocket | null>(null);

  const categoryMap: Record<string, string> = {
    "3": "Crown",
    "4": "Venner",
    "7": "Inlay/Onlay",
    "8": "Implant Crown",
    "9": "Implant",
    "10": "ALL on 4/6",
    "11": "Hybrid Bridge",
    "12": "Abutment",
    "13": "Pressed",
    "14": "Print",
    "15": "MILL ONLY",
    "16": "Design",
    "17": "Attachment",
  };

  const materialMap: Record<string, string> = {
    "3": "Zirconia",
    "5": "Metal",
    "6": "Titane",
    "7": "E-max",
    "8": "silicone",
    "9": "wax",
    "10": "ceramic",
    "11": "Titanium",
    "12": "PMMA",
    "13": "Various",
    "14": "Resin",
    "15": "STL",
    "16": "Metal / Zirconia / Ceramic",
  };

  useEffect(() => {
    getPricing();
    connectPricingWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, []);

  const getPricing = async () => {
    try {
      const response = await api.get("/pricing");
      setPricing(response.data);
    } catch (error) {
      console.log("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectPricingWebSocket = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        console.log("No user data found");
        return;
      }

      const user = JSON.parse(userData);

      const userId =
        user?.id ??
        user?.user_id ??
        user?.user?.id;

      if (!userId) {
        console.log("Doctor user ID not found");
        return;
      }

      const websocket = new WebSocket(
        `wss://tcidentallab.com/ws/pricing/${userId}`
      );

      websocketRef.current = websocket;

      websocket.onopen = () => {
        console.log("Pricing WebSocket connected");
      };

      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data?.type === "pricing_updated") {
            await getPricing();
          }
        } catch (error) {
          console.log(
            "Pricing WebSocket message error:",
            error
          );
        }
      };

      websocket.onerror = (error) => {
        console.log(
          "Pricing WebSocket error:",
          error
        );
      };

      websocket.onclose = () => {
        console.log(
          "Pricing WebSocket disconnected"
        );
      };
    } catch (error) {
      console.log(
        "Pricing WebSocket connection error:",
        error
      );
    }
  };

  const getCategoryName = (category: any) => {
    return (
      categoryMap[String(category)] ||
      String(category)
    );
  };

  const getMaterialName = (material: any) => {
    return (
      materialMap[String(material)] ||
      String(material)
    );
  };

  const filteredPricing = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return pricing;
    }

    return pricing.filter((item) =>
      String(item.product || "")
        .toLowerCase()
        .includes(searchText)
    );
  }, [pricing, search]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#005EB8"
          />
          <Text style={styles.loadingText}>
            Loading pricing...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.replace("/(doctor)")
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#172B4D"
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Pricing
            </Text>

            <Text style={styles.subtitle}>
              View current product pricing and
              material options.
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            ⌕
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search product..."
            placeholderTextColor="#98A2B3"
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Text
              style={styles.clearButton}
              onPress={() => setSearch("")}
            >
              ×
            </Text>
          )}
        </View>

        <View style={styles.tableCard}>
          <FlatList
            data={filteredPricing}
            keyExtractor={(item) =>
              String(item.id)
            }
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <Text
                  style={[
                    styles.tableHeaderText,
                    styles.productColumn,
                  ]}
                >
                  Product
                </Text>

                <Text
                  style={[
                    styles.tableHeaderText,
                    styles.categoryColumn,
                  ]}
                >
                  Category
                </Text>

                <Text
                  style={[
                    styles.tableHeaderText,
                    styles.materialColumn,
                  ]}
                >
                  Material
                </Text>

                <Text
                  style={[
                    styles.tableHeaderText,
                    styles.priceColumn,
                  ]}
                >
                  Price
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.productColumn,
                  ]}
                  numberOfLines={2}
                >
                  {item.product}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    styles.categoryColumn,
                  ]}
                  numberOfLines={2}
                >
                  {getCategoryName(
                    item.category
                  )}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    styles.materialColumn,
                  ]}
                  numberOfLines={2}
                >
                  {getMaterialName(
                    item.material
                  )}
                </Text>

                <Text
                  style={[
                    styles.tableCell,
                    styles.priceColumn,
                    styles.priceText,
                  ]}
                  numberOfLines={1}
                >
                  €{" "}
                  {Number(
                    item.belgium_dentist_price
                  ).toFixed(2)}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View
                style={styles.emptyContainer}
              >
                <Text
                  style={styles.emptyText}
                >
                  {search
                    ? "No pricing found for this product."
                    : "No Pricing Found"}
                </Text>
              </View>
            }
            ListFooterComponent={
              <View style={styles.infoCard}>
                <View
                  style={styles.infoTitleRow}
                >
                  <Text
                    style={styles.infoIcon}
                  >
                    ⓘ
                  </Text>

                  <Text
                    style={styles.infoTitle}
                  >
                    Prices & Order Information
                  </Text>
                </View>

                <View style={styles.infoList}>
                  <View style={styles.infoRow}>
                    <Text
                      style={styles.infoRowIcon}
                    >
                      %
                    </Text>

                    <Text
                      style={styles.infoText}
                    >
                      Prices are exclusive of
                      VAT.
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text
                      style={styles.infoRowIcon}
                    >
                      ▣
                    </Text>

                    <Text
                      style={styles.infoText}
                    >
                      Shipping is free for orders
                      of{" "}
                      <Text
                        style={styles.boldText}
                      >
                        €150 or more.
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text
                      style={styles.infoRowIcon}
                    >
                      ▣
                    </Text>

                    <Text
                      style={styles.infoText}
                    >
                      Orders below €150 are
                      subject to a fixed shipping
                      fee of{" "}
                      <Text
                        style={styles.boldText}
                      >
                        €9.
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text
                      style={styles.infoRowIcon}
                    >
                      ▤
                    </Text>

                    <Text
                      style={styles.infoText}
                    >
                      Prices are for reference
                      only. Orders must be
                      submitted via the{" "}
                      <Text
                        style={styles.boldText}
                      >
                        RX form.
                      </Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.serviceList}>
                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ◷
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      Temporaries (PMMA)
                    </Text>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ▣
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      3D Printing & Models
                    </Text>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ⚙
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      <Text
                        style={styles.boldText}
                      >
                        Mill Only
                      </Text>{" "}
                      (No CAD design included)
                    </Text>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ▱
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      CAD Services
                    </Text>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ♢
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      Abutments & Attachments
                    </Text>
                  </View>

                  <View style={styles.serviceRow}>
                    <Text
                      style={styles.serviceIcon}
                    >
                      ✂
                    </Text>
                    <Text
                      style={styles.serviceText}
                    >
                      Implant Restorations
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text
                  style={styles.fixedTitle}
                >
                  Fixed Prosthetics – Crowns /
                  Veneers / Inlay-Onlay
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#667085",
  },

  pageHeader: {
    minHeight: 70,
    position: "relative",
    justifyContent: "center",
    marginBottom: 18,
  },

  backButton: {
    position: "absolute",
    left: 0,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  headerTextContainer: {
    alignItems: "center",
    paddingHorizontal: 45,
  },

  title: {
    fontSize: 30,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
  },

  searchContainer: {
    height: 46,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DEE7",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 16,
  },

  searchIcon: {
    fontSize: 24,
    color: "#667085",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#1D2939",
  },

  clearButton: {
    fontSize: 25,
    color: "#667085",
    paddingHorizontal: 5,
  },

  tableCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DFE3E8",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#DFE3E8",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  tableCell: {
    fontSize: 12,
    color: "#344054",
    paddingRight: 5,
  },

  productColumn: {
    width: "25%",
  },

  categoryColumn: {
    width: "27%",
  },

  materialColumn: {
    width: "23%",
  },

  priceColumn: {
    width: "25%",
    textAlign: "right",
  },

  priceText: {
    fontWeight: "700",
    color: "#111827",
  },

  emptyContainer: {
    paddingVertical: 35,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#667085",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFE3E8",
    padding: 18,
    marginTop: 18,
    marginBottom: 20,
  },

  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  infoIcon: {
    fontSize: 18,
    color: "#344054",
    marginRight: 9,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#172B4D",
  },

  infoList: {
    gap: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoRowIcon: {
    width: 24,
    fontSize: 15,
    color: "#475467",
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#344054",
  },

  boldText: {
    fontWeight: "700",
    color: "#172B4D",
  },

  divider: {
    height: 1,
    backgroundColor: "#D9DEE7",
    marginVertical: 18,
  },

  serviceList: {
    gap: 13,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 25,
    fontSize: 16,
    color: "#475467",
  },

  serviceText: {
    flex: 1,
    fontSize: 13,
    color: "#172B4D",
    lineHeight: 19,
  },

  fixedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#172B4D",
    lineHeight: 20,
  },
});

