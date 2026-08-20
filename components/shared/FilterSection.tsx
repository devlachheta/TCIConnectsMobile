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
import DateTimePicker from "@react-native-community/datetimepicker";

interface FilterSectionProps {
    onApply: (status: string, deadline: string) => void;
    onReset: () => void;
}

export default function FilterSection({
    onApply,
    onReset,
}: FilterSectionProps) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [items, setItems] = useState([
        { label: "All", value: "" },
        { label: "Submitted", value: "Submitted" },
        { label: "InProduction", value: "InProduction" },
        { label: "QualityCheck", value: "QualityCheck" },
        { label: "Shipped", value: "Shipped" },
        { label: "Delivered", value: "Delivered" },
    ]);
    const handleDateChange = (
        event: any,
        date?: Date
    ) => {
        setShowDatePicker(false);

        if (date) {
            setSelectedDate(date);

            const formattedDate =
                `${String(date.getMonth() + 1).padStart(2, "0")}/` +
                `${String(date.getDate()).padStart(2, "0")}/` +
                `${date.getFullYear()}`;

            setDeadline(formattedDate);
        }
    };

    const handleReset = () => {
        setStatus("");
        setDeadline("");
        onReset();
    };

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
                        placeholder="All"

                        listMode="SCROLLVIEW"

                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.dropdownText}
                    />
                </View>

                {/* DELIVERY DEADLINE */}
                <View style={styles.field}>
                    <Text style={styles.label}>
                        Delivery Deadline
                    </Text>

                    <TouchableOpacity
                        style={styles.input}
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#000"
                        />

                        <Text
                            style={[
                                styles.dateText,
                                !deadline && styles.placeholderText,
                            ]}
                        >
                            {deadline || "mm/dd/yyyy"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() =>
                        onApply(status, deadline)
                    }
                >
                    <Text style={styles.buttonText}>
                        Apply
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
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

    dateText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
    },

    placeholderText: {
        color: "#666",
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