import AdminFooter from "@/components/admindashboard/AdminFooter";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Category = {
  id: number;
  category_name: string;
};

type Material = {
  id: number;
  material_name: string;
};

type PriceData = {
  id: number;
  product: string;
  category: number | string;
  material: number | string;
  belgium_dentist_price: number | string;
  belgium_lab_price: number | string;
  lebanon_dentist_price: number | string;
  lebanon_lab_price: number | string;
};

export default function EditPrice() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // PRICE DATA
  // =========================================================

  const [product, setProduct] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const [selectedMaterial, setSelectedMaterial] =
    useState<number | null>(null);

  const [belgiumDentistPrice, setBelgiumDentistPrice] =
    useState("");

  const [belgiumLabPrice, setBelgiumLabPrice] =
    useState("");

  const [lebanonDentistPrice, setLebanonDentistPrice] =
    useState("");

  const [lebanonLabPrice, setLebanonLabPrice] =
    useState("");

  // =========================================================
  // CATEGORY
  // =========================================================

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [categoryLoading, setCategoryLoading] =
    useState(false);

  // =========================================================
  // MATERIAL
  // =========================================================

  const [materials, setMaterials] =
    useState<Material[]>([]);

  const [materialLoading, setMaterialLoading] =
    useState(false);

  // =========================================================
  // MODALS
  // =========================================================

  const [categoryModalVisible, setCategoryModalVisible] =
    useState(false);

  const [materialModalVisible, setMaterialModalVisible] =
    useState(false);

  // =========================================================
  // FETCH PRICE
  // =========================================================

  const fetchPrice = async () => {
    if (!id) {
      Alert.alert(
        "Error",
        "Price ID is missing.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/pricing/${id}`
      );

      console.log(
        "PRICE DETAILS:",
        response.data
      );

      const price: PriceData =
        response.data;

      setProduct(
        price.product ?? ""
      );

      setSelectedCategory(
        Number(price.category)
      );

      setSelectedMaterial(
        Number(price.material)
      );

      setBelgiumDentistPrice(
        String(
          price.belgium_dentist_price ?? ""
        )
      );

      setBelgiumLabPrice(
        String(
          price.belgium_lab_price ?? ""
        )
      );

      setLebanonDentistPrice(
        String(
          price.lebanon_dentist_price ?? ""
        )
      );

      setLebanonLabPrice(
        String(
          price.lebanon_lab_price ?? ""
        )
      );
    } catch (error: any) {
      console.error(
        "PRICE DETAILS ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load price details.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response =
        await api.get("/category");

      console.log(
        "CATEGORIES:",
        response.data
      );

      setCategories(response.data);
    } catch (error: any) {
      console.error(
        "CATEGORY ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load categories."
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================================================
  // FETCH MATERIALS
  // =========================================================

  const fetchMaterials = async () => {
    try {
      setMaterialLoading(true);

      const response =
        await api.get("/material");

      console.log(
        "MATERIALS:",
        response.data
      );

      setMaterials(response.data);
    } catch (error: any) {
      console.error(
        "MATERIAL ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load materials."
      );
    } finally {
      setMaterialLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchPrice();
    fetchCategories();
    fetchMaterials();
  }, [id]);

  // =========================================================
  // SELECTED CATEGORY NAME
  // =========================================================

  const selectedCategoryName =
    categories.find(
      (category) =>
        category.id === selectedCategory
    )?.category_name || "";

  // =========================================================
  // SELECTED MATERIAL NAME
  // =========================================================

  const selectedMaterialName =
    materials.find(
      (material) =>
        material.id === selectedMaterial
    )?.material_name || "";

  // =========================================================
  // UPDATE PRICE
  // =========================================================

  const handleUpdatePrice = async () => {
    if (!id) {
      Alert.alert(
        "Error",
        "Price ID is missing."
      );

      return;
    }

    if (!product.trim()) {
      Alert.alert(
        "Required",
        "Please enter a product name."
      );

      return;
    }

    if (selectedCategory === null) {
      Alert.alert(
        "Required",
        "Please select a category."
      );

      return;
    }

    if (selectedMaterial === null) {
      Alert.alert(
        "Required",
        "Please select a material."
      );

      return;
    }

    if (!belgiumDentistPrice.trim()) {
      Alert.alert(
        "Required",
        "Please enter Belgium Dentist price."
      );

      return;
    }

    if (!belgiumLabPrice.trim()) {
      Alert.alert(
        "Required",
        "Please enter Belgium Lab price."
      );

      return;
    }

    if (!lebanonDentistPrice.trim()) {
      Alert.alert(
        "Required",
        "Please enter Lebanon Dentist price."
      );

      return;
    }

    if (!lebanonLabPrice.trim()) {
      Alert.alert(
        "Required",
        "Please enter Lebanon Lab price."
      );

      return;
    }

    try {
      setUpdating(true);

      const payload = {
        product: product.trim(),

        category: selectedCategory,

        material: selectedMaterial,

        belgium_dentist_price:
          Number(
            belgiumDentistPrice
          ),

        belgium_lab_price:
          Number(
            belgiumLabPrice
          ),

        lebanon_dentist_price:
          Number(
            lebanonDentistPrice
          ),

        lebanon_lab_price:
          Number(
            lebanonLabPrice
          ),
      };

      console.log(
        "UPDATE PRICE PAYLOAD:",
        payload
      );

      const response =
        await api.put(
          `/pricing/${id}`,
          payload
        );

      console.log(
        "PRICE UPDATED:",
        response.data
      );

      Alert.alert(
        "Success",
        "Price updated successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace(
                "/admin/pricing"
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "UPDATE PRICE ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.detail ||
        "Failed to update price."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom"]}
      >
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
            Update Price
          </Text>
        </View>

        <View style={styles.loadingScreen}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Loading price...
          </Text>
        </View>

        <AdminFooter />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

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
          Update Price
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            UPDATE PRICE CARD
        ====================================================== */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Update Price
          </Text>

          <View style={styles.line} />

          {/* Product */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Product Name
            </Text>

            <TextInput
              style={styles.input}
              value={product}
              onChangeText={setProduct}
              placeholder="Enter product name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Category
            </Text>

            <TouchableOpacity
              style={styles.selectInput}
              activeOpacity={0.7}
              onPress={() =>
                setCategoryModalVisible(true)
              }
            >
              <Text
                style={
                  selectedCategory !== null
                    ? styles.selectedText
                    : styles.placeholderText
                }
              >
                {selectedCategoryName ||
                  "Select Category"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Material */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Material
            </Text>

            <TouchableOpacity
              style={styles.selectInput}
              activeOpacity={0.7}
              onPress={() =>
                setMaterialModalVisible(true)
              }
            >
              <Text
                style={
                  selectedMaterial !== null
                    ? styles.selectedText
                    : styles.placeholderText
                }
              >
                {selectedMaterialName ||
                  "Select Material"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={20}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* =================================================
              PRICE MATRIX
          ================================================== */}

          <View style={styles.priceMatrix}>
            <View
              style={
                styles.priceMatrixHeader
              }
            >
              <Text
                style={
                  styles.priceMatrixTitle
                }
              >
                Price Matrix
              </Text>
            </View>

            <View
              style={
                styles.priceMatrixBody
              }
            >
              {/* Belgium Dentist */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Belgium Dentist (€)
                </Text>

                <View
                  style={
                    styles.priceInputContainer
                  }
                >
                  <Text
                    style={styles.currency}
                  >
                    €
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    value={
                      belgiumDentistPrice
                    }
                    onChangeText={
                      setBelgiumDentistPrice
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Belgium Lab */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Belgium Lab (€)
                </Text>

                <View
                  style={
                    styles.priceInputContainer
                  }
                >
                  <Text
                    style={styles.currency}
                  >
                    €
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    value={
                      belgiumLabPrice
                    }
                    onChangeText={
                      setBelgiumLabPrice
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Lebanon Dentist */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Lebanon Dentist ($)
                </Text>

                <View
                  style={
                    styles.priceInputContainer
                  }
                >
                  <Text
                    style={styles.currency}
                  >
                    $
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    value={
                      lebanonDentistPrice
                    }
                    onChangeText={
                      setLebanonDentistPrice
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Lebanon Lab */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  Lebanon Lab ($)
                </Text>

                <View
                  style={
                    styles.priceInputContainer
                  }
                >
                  <Text
                    style={styles.currency}
                  >
                    $
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    value={
                      lebanonLabPrice
                    }
                    onChangeText={
                      setLebanonLabPrice
                    }
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                router.back()
              }
              disabled={updating}
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={
                handleUpdatePrice
              }
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.updateButtonText
                    }
                  >
                    Update Price
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* =====================================================
          CATEGORY MODAL
      ====================================================== */}

      <Modal
        visible={
          categoryModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCategoryModalVisible(
            false
          )
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modalContainer}
          >
            <View
              style={styles.modalHeader}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Category
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setCategoryModalVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#111827"
                />
              </TouchableOpacity>
            </View>

            {categoryLoading ? (
              <View
                style={
                  styles.modalLoading
                }
              >
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                />
              </View>
            ) : (
              <ScrollView
                style={
                  styles.modalList
                }
                showsVerticalScrollIndicator={
                  false
                }
              >
                {categories.map(
                  (category) => (
                    <TouchableOpacity
                      key={
                        category.id
                      }
                      style={[
                        styles.modalItem,
                        selectedCategory ===
                        category.id &&
                        styles.selectedModalItem,
                      ]}
                      onPress={() => {
                        setSelectedCategory(
                          category.id
                        );

                        setCategoryModalVisible(
                          false
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          selectedCategory ===
                          category.id &&
                          styles.selectedModalItemText,
                        ]}
                      >
                        {
                          category.category_name
                        }
                      </Text>

                      {selectedCategory ===
                        category.id && (
                          <Ionicons
                            name="checkmark"
                            size={21}
                            color="#2563EB"
                          />
                        )}
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* =====================================================
          MATERIAL MODAL
      ====================================================== */}

      <Modal
        visible={
          materialModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMaterialModalVisible(
            false
          )
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modalContainer}
          >
            <View
              style={styles.modalHeader}
            >
              <Text
                style={styles.modalTitle}
              >
                Select Material
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setMaterialModalVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#111827"
                />
              </TouchableOpacity>
            </View>

            {materialLoading ? (
              <View
                style={
                  styles.modalLoading
                }
              >
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                />
              </View>
            ) : (
              <ScrollView
                style={
                  styles.modalList
                }
                showsVerticalScrollIndicator={
                  false
                }
              >
                {materials.map(
                  (material) => (
                    <TouchableOpacity
                      key={
                        material.id
                      }
                      style={[
                        styles.modalItem,
                        selectedMaterial ===
                        material.id &&
                        styles.selectedModalItem,
                      ]}
                      onPress={() => {
                        setSelectedMaterial(
                          material.id
                        );

                        setMaterialModalVisible(
                          false
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          selectedMaterial ===
                          material.id &&
                          styles.selectedModalItemText,
                        ]}
                      >
                        {
                          material.material_name
                        }
                      </Text>

                      {selectedMaterial ===
                        material.id && (
                          <Ionicons
                            name="checkmark"
                            size={21}
                            color="#2563EB"
                          />
                        )}
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
    paddingBottom: 40,
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },

  line: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 10,
    marginBottom: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 9,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 9,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  placeholderText: {
    fontSize: 15,
    color: "#64748B",
  },

  selectedText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },

  priceMatrix: {
    marginTop: 4,
    borderRadius: 11,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  priceMatrixHeader: {
    backgroundColor: "#0759A8",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  priceMatrixTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  priceMatrixBody: {
    padding: 14,
    backgroundColor: "#FFFFFF",
  },

  priceInputContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    paddingLeft: 13,
  },

  currency: {
    width: 25,
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  priceInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#111827",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 9,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  updateButton: {
    flex: 1.3,
    height: 48,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },

  // =========================================================
  // MODAL
  // =========================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxHeight: "70%",
    overflow: "hidden",
  },

  modalHeader: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  modalList: {
    paddingHorizontal: 8,
  },

  modalItem: {
    minHeight: 50,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedModalItem: {
    backgroundColor: "#EFF6FF",
  },

  modalItemText: {
    fontSize: 15,
    color: "#1E293B",
  },

  selectedModalItemText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  modalLoading: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
});