import AdminFooter from "@/components/admindashboard/AdminFooter";
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

type Material = {
  id: number;
  material_name: string;
};

export default function AddMaterial() {
  const router = useRouter();

  const [materials, setMaterials] = useState<
    Material[]
  >([]);

  const [materialName, setMaterialName] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [editingId, setEditingId] = useState<
    number | null
  >(null);

  const [editingName, setEditingName] =
    useState("");

  // =========================================================
  // GET MATERIALS
  // =========================================================

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/material"
      );

      console.log(
        "MATERIAL RESPONSE:",
        response.data
      );

      setMaterials(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error: any) {
      console.error(
        "MATERIAL FETCH ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Failed to load materials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // =========================================================
  // ADD MATERIAL
  // =========================================================

  const handleAddMaterial = async () => {
    const name = materialName.trim();

    if (!name) {
      Alert.alert(
        "Required",
        "Please enter a material name."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(
        "/material",
        {
          material_name: name,
        }
      );

      console.log(
        "MATERIAL CREATED:",
        response.data
      );

      setMaterialName("");

      Alert.alert(
        "Success",
        "Material added successfully."
      );

      fetchMaterials();
    } catch (error: any) {
      console.error(
        "MATERIAL CREATE ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.detail ||
        "Failed to add material."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditModal = (
    material: Material
  ) => {
    setEditingId(material.id);
    setEditingName(
      material.material_name
    );
    setEditModalVisible(true);
  };

  // =========================================================
  // UPDATE MATERIAL
  // =========================================================

  const handleUpdateMaterial = async () => {
    const name = editingName.trim();

    if (!editingId) {
      return;
    }

    if (!name) {
      Alert.alert(
        "Required",
        "Please enter a material name."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/material/${editingId}`,
        {
          material_name: name,
        }
      );

      console.log(
        "MATERIAL UPDATED:",
        response.data
      );

      setEditModalVisible(false);
      setEditingId(null);
      setEditingName("");

      Alert.alert(
        "Success",
        "Material updated successfully."
      );

      fetchMaterials();
    } catch (error: any) {
      console.error(
        "MATERIAL UPDATE ERROR:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.detail ||
        "Failed to update material."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE MATERIAL
  // =========================================================

  const handleDeleteMaterial = (
    id: number
  ) => {
    Alert.alert(
      "Delete Material",
      "Are you sure you want to delete this material?",
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
              const response =
                await api.delete(
                  `/material/${id}`
                );

              console.log(
                "MATERIAL DELETED:",
                response.data
              );

              Alert.alert(
                "Success",
                "Material deleted successfully."
              );

              fetchMaterials();
            } catch (error: any) {
              console.error(
                "MATERIAL DELETE ERROR:",
                error?.response?.data || error
              );

              Alert.alert(
                "Error",
                error?.response?.data?.detail ||
                "Failed to delete material."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      {/* HEADER */}

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
          Materials
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ADD MATERIAL CARD */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Add Material
          </Text>

          <View style={styles.line} />

          <Text style={styles.label}>
            Material Name
          </Text>

          <TextInput
            style={styles.input}
            value={materialName}
            onChangeText={setMaterialName}
            placeholder="Material Name"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAddMaterial}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <>
                <Ionicons
                  name="add"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={styles.primaryButtonText}
                >
                  Add Material
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* MATERIAL LIST */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Materials
          </Text>

          <View style={styles.line} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#2563EB"
              />

              <Text style={styles.loadingText}>
                Loading materials...
              </Text>
            </View>
          ) : materials.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cube-outline"
                size={42}
                color="#94A3B8"
              />

              <Text style={styles.emptyText}>
                No materials found
              </Text>
            </View>
          ) : (
            materials.map(
              (material, index) => (
                <View
                  key={material.id}
                  style={styles.listItem}
                >
                  <View
                    style={styles.numberContainer}
                  >
                    <Text
                      style={styles.numberText}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={styles.itemName}
                  >
                    {material.material_name}
                  </Text>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                      openEditModal(material)
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color="#2563EB"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                      handleDeleteMaterial(
                        material.id
                      )
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              )
            )
          )}
        </View>
      </ScrollView>

      {/* EDIT MODAL */}

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit Material
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setEditModalVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#111827"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Material Name
            </Text>

            <TextInput
              style={styles.input}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Material Name"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setEditModalVisible(false)
                }
              >
                <Text
                  style={styles.cancelButtonText}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryModalButton}
                onPress={
                  handleUpdateMaterial
                }
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },

  line: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
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
    marginBottom: 12,
  },

  primaryButton: {
    height: 48,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },

  listItem: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  numberContainer: {
    width: 32,
  },

  numberText: {
    fontSize: 14,
    color: "#64748B",
  },

  itemName: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    paddingVertical: 35,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#64748B",
  },

  emptyContainer: {
    paddingVertical: 35,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 10,
    color: "#64748B",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 9,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  primaryModalButton: {
    flex: 1,
    height: 46,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
});