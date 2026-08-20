// import AdminFooter from "@/components/admindashboard/AdminFooter";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

// =========================================================
// TYPES
// =========================================================

type Category = {
  id: number;
  category_name: string;
};

type Material = {
  id: number;
  material_name: string;
};

// =========================================================
// DEFAULT CATEGORY LIST
// =========================================================

const DEFAULT_CATEGORIES: Category[] = [
  { id: 3, category_name: "Crown" },
  { id: 4, category_name: "Venner" },
  { id: 7, category_name: "Inlay/Onlay" },
  { id: 8, category_name: "Implant Crown" },
  { id: 9, category_name: "Implant" },
  { id: 10, category_name: "ALL on 4/6" },
  { id: 11, category_name: "Hybrid Bridge" },
  { id: 12, category_name: "Abutment" },
  { id: 13, category_name: "Pressed" },
  { id: 14, category_name: "Print" },
  { id: 15, category_name: "MILL ONLY" },
  { id: 16, category_name: "Design" },
  { id: 17, category_name: "Attachment" },
];

// =========================================================
// DEFAULT MATERIAL LIST
// =========================================================

const DEFAULT_MATERIALS: Material[] = [
  { id: 3, material_name: "Zirconia" },
  { id: 5, material_name: "Metal" },
  { id: 6, material_name: "Titane" },
  { id: 7, material_name: "E-max" },
  { id: 8, material_name: "silicone" },
  { id: 9, material_name: "wax" },
  { id: 10, material_name: "ceramic" },
  { id: 11, material_name: "Titanium" },
  { id: 12, material_name: "PMMA" },
  { id: 13, material_name: "Various" },
  { id: 14, material_name: "Resin" },
  { id: 15, material_name: "STL" },
  {
    id: 16,
    material_name: "Metal / Zirconia / Ceramic",
  },
];

export default function AddPrice() {
  const router = useRouter();

  // =========================================================
  // PRICE FORM
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
    useState<Category[]>(DEFAULT_CATEGORIES);

  const [categoryLoading, setCategoryLoading] =
    useState(false);

  // =========================================================
  // MATERIAL
  // =========================================================

  const [materials, setMaterials] =
    useState<Material[]>(DEFAULT_MATERIALS);

  const [materialLoading, setMaterialLoading] =
    useState(false);

  // =========================================================
  // PRICE LOADING
  // =========================================================

  const [savingPrice, setSavingPrice] =
    useState(false);

  // =========================================================
  // CATEGORY / MATERIAL MODALS
  // =========================================================

  const [categoryModalVisible, setCategoryModalVisible] =
    useState(false);

  const [materialModalVisible, setMaterialModalVisible] =
    useState(false);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await api.get("/category");

      console.log(
        "CATEGORY RESPONSE:",
        response.data
      );

      /*
       * Merge API data with the required category list.
       * This keeps the IDs coming from your backend while
       * making sure all required categories are visible.
       */

      const apiCategories: Category[] =
        Array.isArray(response.data)
          ? response.data
          : [];

      const mergedCategories = [
        ...DEFAULT_CATEGORIES,
      ];

      apiCategories.forEach(
        (apiCategory) => {
          const existingIndex =
            mergedCategories.findIndex(
              (category) =>
                category.id === apiCategory.id
            );

          if (existingIndex !== -1) {
            mergedCategories[
              existingIndex
            ] = apiCategory;
          } else {
            mergedCategories.push(
              apiCategory
            );
          }
        }
      );

      setCategories(
        mergedCategories
      );
    } catch (error: any) {
      console.error(
        "CATEGORY ERROR:",
        error?.response?.data || error
      );

      // Keep default categories if API fails.
      setCategories(
        DEFAULT_CATEGORIES
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

      const response = await api.get("/material");

      console.log(
        "MATERIAL RESPONSE:",
        response.data
      );

      /*
       * Merge API data with the required material list.
       */

      const apiMaterials: Material[] =
        Array.isArray(response.data)
          ? response.data
          : [];

      const mergedMaterials = [
        ...DEFAULT_MATERIALS,
      ];

      apiMaterials.forEach(
        (apiMaterial) => {
          const existingIndex =
            mergedMaterials.findIndex(
              (material) =>
                material.id === apiMaterial.id
            );

          if (existingIndex !== -1) {
            mergedMaterials[
              existingIndex
            ] = apiMaterial;
          } else {
            mergedMaterials.push(
              apiMaterial
            );
          }
        }
      );

      setMaterials(
        mergedMaterials
      );
    } catch (error: any) {
      console.error(
        "MATERIAL ERROR:",
        error?.response?.data || error
      );

      // Keep default materials if API fails.
      setMaterials(
        DEFAULT_MATERIALS
      );
    } finally {
      setMaterialLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

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
  // SAVE PRICE
  // =========================================================

  const handleSavePrice = async () => {
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
      setSavingPrice(true);

      const payload = {
        product: product.trim(),

        category: selectedCategoryName,

        material: selectedMaterialName,

        belgium_dentist_price:
          Number(belgiumDentistPrice),

        belgium_lab_price:
          Number(belgiumLabPrice),

        lebanon_dentist_price:
          Number(lebanonDentistPrice),

        lebanon_lab_price:
          Number(lebanonLabPrice),
      };
      console.log(
        "PRICE PAYLOAD:",
        payload
      );

      const response = await api.post(
        "/pricing",
        payload
      );

      console.log(
        "PRICE CREATED:",
        response.data
      );

      Alert.alert(
        "Success",
        "Price created successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace(
                "/(admin)/pricing"
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "PRICE ERROR:",
        error?.response?.data || error
      );

      const detail =
        error?.response?.data?.detail;

      let errorMessage =
        "Failed to create price.";

      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item: any) => {
            if (typeof item === "string") {
              return item;
            }

            if (item?.msg) {
              return item.msg;
            }

            return JSON.stringify(item);
          })
          .join("\n");
      } else if (detail) {
        errorMessage =
          JSON.stringify(detail);
      } else if (
        error?.response?.data?.message
      ) {
        errorMessage = String(
          error.response.data.message
        );
      }

      Alert.alert(
        "Error",
        errorMessage
      );
    } finally {
      setSavingPrice(false);
    }
  };

  // =========================================================
  // CATEGORY MODAL
  // =========================================================

  const renderCategoryModal = () => {
    return (
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCategoryModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
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
              <View style={styles.modalLoading}>
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                />
              </View>
            ) : (
              <ScrollView
                style={styles.modalList}
                showsVerticalScrollIndicator={
                  false
                }
              >
                {categories.map(
                  (category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.modalItem,
                        selectedCategory ===
                        category.id &&
                        styles.selectedModalItem,
                      ]}
                      activeOpacity={0.7}
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
    );
  };

  // =========================================================
  // MATERIAL MODAL
  // =========================================================

  const renderMaterialModal = () => {
    return (
      <Modal
        visible={materialModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMaterialModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
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
              <View style={styles.modalLoading}>
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                />
              </View>
            ) : (
              <ScrollView
                style={styles.modalList}
                showsVerticalScrollIndicator={
                  false
                }
              >
                {materials.map(
                  (material) => (
                    <TouchableOpacity
                      key={material.id}
                      style={[
                        styles.modalItem,
                        selectedMaterial ===
                        material.id &&
                        styles.selectedModalItem,
                      ]}
                      activeOpacity={0.7}
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
    );
  };

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
          Add New Price
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            PRICE CARD
        ====================================================== */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Add New Price
          </Text>

          <View style={styles.line} />

          {/* PRODUCT */}

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

          {/* CATEGORY */}

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

          {/* MATERIAL */}

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
              style={styles.priceMatrixHeader}
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
              style={styles.priceMatrixBody}
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

          {/* BUTTONS */}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                router.back()
              }
              disabled={savingPrice}
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
              style={styles.saveButton}
              onPress={
                handleSavePrice
              }
              disabled={savingPrice}
            >
              {savingPrice ? (
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
                      styles.saveButtonText
                    }
                  >
                    Save Price
                  </Text>
                </>
              )}
            </TouchableOpacity>

          </View>

          {/* =====================================================
    ADD CATEGORY CARD
====================================================== */}

          <View style={styles.manageCard}>
            <View style={styles.manageCardIcon}>
              <Ionicons
                name="list-outline"
                size={24}
                color="#2563EB"
              />
            </View>

            <View style={styles.manageCardContent}>
              <Text style={styles.manageCardTitle}>
                Add Category
              </Text>

              <Text style={styles.manageCardDescription}>
                Add and manage pricing categories.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.manageCardButton}
              onPress={() =>
                router.push("/(admin)/pricing/add-category")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.manageCardButtonText}>
                Add
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* =====================================================
    ADD MATERIAL CARD
====================================================== */}

          <View style={styles.manageCard}>
            <View style={styles.manageCardIcon}>
              <Ionicons
                name="cube-outline"
                size={24}
                color="#2563EB"
              />
            </View>

            <View style={styles.manageCardContent}>
              <Text style={styles.manageCardTitle}>
                Add Material
              </Text>

              <Text style={styles.manageCardDescription}>
                Add and manage pricing materials.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.manageCardButton}
              onPress={() =>
                router.push("/(admin)/pricing/add-material")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.manageCardButtonText}>
                Add
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>

      {/* CATEGORY MODAL */}

      {renderCategoryModal()}

      {/* MATERIAL MODAL */}

      {renderMaterialModal()}

    </SafeAreaView>
  );
}

// =========================================================
// STYLES
// =========================================================

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

    marginBottom: 16,
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

  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
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
  manageButton: {
    height: 42,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -6,
    marginBottom: 16,
    backgroundColor: "#EFF6FF",
  },

  manageButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
  manageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  manageCardIcon: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  manageCardContent: {
    flex: 1,
    paddingRight: 8,
  },

  manageCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  manageCardDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
  },

  manageCardButton: {
    minWidth: 72,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  manageCardButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
});