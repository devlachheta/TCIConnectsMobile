import AdminFooter from "@/components/admindashboard/AdminFooter";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Price = {
  id: number;
  product: string;
  category: number | string;
  material: number | string;
  belgium_dentist_price: number | string;
  belgium_lab_price: number | string;
  lebanon_dentist_price: number | string;
  lebanon_lab_price: number | string;
};

export default function AdminPricing() {
  const router = useRouter();

  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /*
   * These maps are kept from your existing web Pricing page.
   * Later we can replace them with GET /category and GET /material
   * so everything comes directly from the database.
   */
  const categoryMap: Record<number, string> = {
    3: "Crown",
    4: "Venner",
    7: "Inlay/Onlay",
    8: "Implant Crown",
    9: "Implant",
    10: "ALL on 4/6",
    11: "Hybrid Bridge",
    12: "Abutment",
    13: "Pressed",
    14: "Print",
    15: "MILL ONLY",
    16: "Design",
    17: "Attachment",
  };

  const materialMap: Record<number, string> = {
    3: "Zirconia",
    5: "Metal",
    6: "Titane",
    7: "E-max",
    8: "silicone",
    9: "wax",
    10: "ceramic",
    11: "Titanium",
    12: "PMMA",
    13: "Various",
    14: "Resin",
    15: "STL",
    16: "Metal / Zirconia / Ceramic",
  };

  /*
   * GET /pricing
   */
  const fetchPrices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/pricing");

      console.log("Pricing API response:", response.data);

      setPrices(response.data);
    } catch (error: any) {
      console.error(
        "Error fetching prices:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load pricing data."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Refresh prices whenever this screen becomes active.
   *
   * This is useful after returning from Add Price or Edit Price.
   */
  useFocusEffect(
    useCallback(() => {
      fetchPrices();
    }, [])
  );

  /*
   * DELETE /pricing/{id}
   */
  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Price",
      "Are you sure you want to delete this price?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(id);

              await api.delete(`/pricing/${id}`);

              /*
               * Remove the deleted card immediately
               * from the screen.
               */
              setPrices((currentPrices) =>
                currentPrices.filter(
                  (price) => price.id !== id
                )
              );

              Alert.alert(
                "Success",
                "Price deleted successfully."
              );
            } catch (error: any) {
              console.error(
                "Error deleting price:",
                error?.response?.data || error
              );

              Alert.alert(
                "Error",
                "Failed to delete price."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  /*
   * Convert category ID to category name.
   */
  const getCategoryName = (
    category: number | string
  ) => {
    if (typeof category === "number") {
      return (
        categoryMap[category] ||
        String(category)
      );
    }

    const numericCategory = Number(category);

    if (!Number.isNaN(numericCategory)) {
      return (
        categoryMap[numericCategory] ||
        String(category)
      );
    }

    return category;
  };

  /*
   * Convert material ID to material name.
   */
  const getMaterialName = (
    material: number | string
  ) => {
    if (typeof material === "number") {
      return (
        materialMap[material] ||
        String(material)
      );
    }

    const numericMaterial = Number(material);

    if (!Number.isNaN(numericMaterial)) {
      return (
        materialMap[numericMaterial] ||
        String(material)
      );
    }

    return material;
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Pricing
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>
              Pricing
            </Text>

            <Text style={styles.pageSubtitle}>
              Manage product pricing
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addPriceButton}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                "/(admin)/pricing/add-price"
              )
            }
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addPriceText}>
              Add Price
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text style={styles.loadingText}>
              Loading prices...
            </Text>
          </View>
        ) : prices.length > 0 ? (
          /*
           * Price Cards
           */
          <View style={styles.priceList}>
            {prices.map((price) => (
              <View
                key={price.id}
                style={styles.priceCard}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View
                    style={styles.productContainer}
                  >
                    <Text style={styles.productLabel}>
                      Product
                    </Text>

                    <Text
                      style={styles.productName}
                    >
                      {price.product}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actions}>
                    {/* Edit */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.editButton,
                      ]}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push(
                          `/(admin)/pricing/edit-price?id=${price.id}`
                        )
                      }
                    >
                      <Ionicons
                        name="create-outline"
                        size={19}
                        color="#2563EB"
                      />
                    </TouchableOpacity>

                    {/* Delete */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.deleteButton,
                      ]}
                      activeOpacity={0.7}
                      disabled={
                        deletingId === price.id
                      }
                      onPress={() =>
                        handleDelete(price.id)
                      }
                    >
                      {deletingId === price.id ? (
                        <ActivityIndicator
                          size="small"
                          color="#DC2626"
                        />
                      ) : (
                        <Ionicons
                          name="trash-outline"
                          size={19}
                          color="#DC2626"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Category / Material */}
                <View style={styles.basicInfo}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>
                      Category
                    </Text>

                    <Text style={styles.infoValue}>
                      {getCategoryName(
                        price.category
                      )}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>
                      Material
                    </Text>

                    <Text style={styles.infoValue}>
                      {getMaterialName(
                        price.material
                      )}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Price Details */}
                <Text
                  style={styles.priceSectionTitle}
                >
                  Price Details
                </Text>

                <View style={styles.priceGrid}>
                  {/* Belgium Dentist */}
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>
                      Belgium Dentist
                    </Text>

                    <Text style={styles.priceValue}>
                      € {price.belgium_dentist_price}
                    </Text>
                  </View>

                  {/* Belgium Lab */}
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>
                      Belgium Lab
                    </Text>

                    <Text style={styles.priceValue}>
                      € {price.belgium_lab_price}
                    </Text>
                  </View>

                  {/* Lebanon Dentist */}
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>
                      Lebanon Dentist
                    </Text>

                    <Text style={styles.priceValue}>
                      $ {price.lebanon_dentist_price}
                    </Text>
                  </View>

                  {/* Lebanon Lab */}
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>
                      Lebanon Lab
                    </Text>

                    <Text style={styles.priceValue}>
                      $ {price.lebanon_lab_price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /*
           * Empty State
           */
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="pricetag-outline"
                size={30}
                color="#64748B"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Prices Added
            </Text>

            <Text style={styles.emptyText}>
              Add your first product price to
              see it here.
            </Text>

            <TouchableOpacity
              style={styles.emptyAddButton}
              onPress={() =>
                router.push(
                  "/(admin)/pricing/add-price"
                )
              }
            >
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text
                style={styles.emptyAddButtonText}
              >
                Add Price
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Prices & Order Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>
            Prices & Order Information
          </Text>

          <View style={styles.informationList}>
            <Text style={styles.informationText}>
              • Prices are exclusive of VAT.
            </Text>

            <Text style={styles.informationText}>
              • Shipping is free for orders of{" "}
              <Text style={styles.boldText}>
                €150 or more
              </Text>
              .
            </Text>

            <Text style={styles.informationText}>
              • Orders below €150 are subject to a
              fixed shipping fee of{" "}
              <Text style={styles.boldText}>
                €9
              </Text>
              .
            </Text>

            <Text style={styles.informationText}>
              • Prices are for reference only.
              Orders must be submitted via the{" "}
              <Text style={styles.boldText}>
                RX form
              </Text>
              .
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.servicesList}>
            <Text style={styles.serviceText}>
              Temporaries (PMMA)
            </Text>

            <Text style={styles.serviceText}>
              3D Printing & Models
            </Text>

            <Text style={styles.serviceText}>
              Mill Only{" "}
              <Text style={styles.normalText}>
                (No CAD design included)
              </Text>
            </Text>

            <Text style={styles.serviceText}>
              CAD Services
            </Text>

            <Text style={styles.serviceText}>
              Abutments & Attachments
            </Text>

            <Text style={styles.serviceText}>
              Implant Restorations
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <Text style={styles.fixedProsthetics}>
            Fixed Prosthetics – Crowns / Veneers /
            Inlay-Onlay
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <AdminFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 18,
    paddingBottom: 30,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  titleContainer: {
    flex: 1,
    marginRight: 12,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  pageSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  addPriceButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  addPriceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },

  loadingContainer: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  priceList: {
    width: "100%",
  },

  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  productContainer: {
    flex: 1,
    marginRight: 10,
  },

  productLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 3,
  },

  productName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {
    backgroundColor: "#EFF6FF",
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
  },

  basicInfo: {
    flexDirection: "row",
    marginTop: 18,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  priceSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },

  priceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  priceItem: {
    width: "50%",
    marginBottom: 14,
  },

  priceLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },

  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
  },

  emptyAddButton: {
    marginTop: 16,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyAddButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  informationList: {
    gap: 9,
  },

  informationText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },

  boldText: {
    fontWeight: "700",
    color: "#1E293B",
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  servicesList: {
    gap: 9,
  },

  serviceText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },

  normalText: {
    fontWeight: "400",
    color: "#64748B",
  },

  fixedProsthetics: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    color: "#334155",
  },
});