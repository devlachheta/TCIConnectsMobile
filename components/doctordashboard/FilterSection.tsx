import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function FilterSection() {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("all");

    const [items, setItems] = useState([
        { label: "All", value: "all" },
        { label: "Submitted", value: "submitted" },
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
    ]);

    return (
        <>
            <View style={styles.row}>

                {/* STATUS */}
                <View style={[styles.field, { zIndex: 1000 }]}>
                    <Text style={styles.label}>
                        Status
                    </Text>

                    <DropDownPicker
                        open={open}
                        value={status}
                        items={items}
                        setOpen={setOpen}
                        setValue={setStatus}
                        setItems={setItems}
                        placeholder="Select Status"
                        style={styles.dropdown}
                        dropDownContainerStyle={
                            styles.dropdownContainer
                        }
                        textStyle={styles.dropdownText}
                    />
                </View>

                {/* DELIVERY DEADLINE */}
                <View style={styles.field}>
                    <Text style={styles.label}>
                        Delivery Deadline
                    </Text>

                    <View style={styles.input}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#000"
                        />

                        <TextInput
                            placeholder="mm/dd/yyyy"
                            placeholderTextColor="#666"
                            style={styles.dateInput}
                        />
                    </View>
                </View>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>

                <TouchableOpacity
                    style={styles.applyButton}
                >
                    <Text style={styles.buttonText}>
                        Apply
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
                >
                    <Text style={styles.buttonText}>
                        Reset
                    </Text>
                </TouchableOpacity>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 18,
        marginTop: 18,
    },

    field: {
        width: "48%",
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#222",
    },

    dropdown: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 12,
        backgroundColor: "#fff",
    },

    dropdownContainer: {
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 12,
        backgroundColor: "#fff",
    },

    dropdownText: {
        fontSize: 16,
        color: "#333",
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },

    dateInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        gap: 16,
    },

    applyButton: {
        backgroundColor: "#0152A8",
        width: 130,
        height: 48,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    resetButton: {
        backgroundColor: "#0152A8",
        width: 130,
        height: 48,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});