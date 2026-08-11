import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NewCases() {
    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [age, setAge] = useState("");
    const [shadeInstructions, setShadeInstructions] = useState("");
    const [implantInstructions, setImplantInstructions] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);
    const [shadeOpen, setShadeOpen] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#021E48"
                    />

                    <Text style={styles.heading}>Submit a Case</Text>

                    <Text style={styles.stepText}>1 of 3</Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressCircle, styles.activeCircle]} />
                    <View style={[styles.progressLine, styles.activeLine]} />

                    <View style={[styles.progressCircle, styles.inactiveCircle]} />
                    <View style={styles.progressLine} />

                    <View style={styles.inactiveCircle} />
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                            <Ionicons
                                name="document-text-outline"
                                size={22}
                                color="#0152A8"
                            />

                            <Text style={styles.cardTitle}>
                                Purchase Order
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-up"
                            size={22}
                            color="#0152A8"
                        />
                    </View>

                    <Text style={styles.label}>Patient Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter patient name"
                        value={patientName}
                        onChangeText={setPatientName}
                    />
                    <Text style={styles.label}>Patient ID</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter patient ID"
                        value={patientId}
                        onChangeText={setPatientId}
                    />
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Next Appt Date</Text>
                            <Pressable
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.placeholder}>
                                    {date.toLocaleDateString()}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Time</Text>

                            <Pressable
                                style={styles.input}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.placeholder}>
                                    {time.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <Text style={styles.label}>Delivery Deadline</Text>

                    <Pressable
                        style={styles.input}
                        onPress={() => setShowDeliveryPicker(true)}
                    >
                        <Text style={styles.placeholder}>
                            {deliveryDate.toLocaleDateString()}
                        </Text>
                    </Pressable>

                    <View style={styles.row}>
                        {/* Age */}
                        <View style={styles.ageContainer}>
                            <Text style={styles.label}>Age</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Years"
                                keyboardType="numeric"
                                value={age}
                                onChangeText={setAge}
                            />
                        </View>

                        {/* Gender */}
                        <View style={styles.genderSection}>
                            <Text style={styles.label}>Gender</Text>

                            <View style={styles.genderRow}>
                                <View style={styles.genderOption}>
                                    <Ionicons
                                        name="ellipse-outline"
                                        size={22}
                                        color="#9CA3AF"
                                    />
                                    <Text style={styles.genderLabel}>Male</Text>
                                </View>

                                <View style={styles.genderOption}>
                                    <Ionicons
                                        name="ellipse-outline"
                                        size={22}
                                        color="#9CA3AF"
                                    />
                                    <Text style={styles.genderLabel}>Female</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.label}>Case Stage</Text>

                    <TouchableOpacity style={styles.caseOption}>
                        <Ionicons
                            name="square-outline"
                            size={24}
                            color="#C5CCD8"
                        />
                        <Text style={styles.caseText}>Try-In Framework</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.caseOption}>
                        <Ionicons
                            name="square-outline"
                            size={24}
                            color="#C5CCD8"
                        />
                        <Text style={styles.caseText}>Try-In Ceramics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.caseOption}>
                        <Ionicons
                            name="square-outline"
                            size={24}
                            color="#C5CCD8"
                        />
                        <Text style={styles.caseText}>Finish</Text>
                    </TouchableOpacity>









                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);

                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false);

                            if (selectedTime) {
                                setTime(selectedTime);
                            }
                        }}
                    />
                )}
                {showDeliveryPicker && (
                    <DateTimePicker
                        value={deliveryDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDeliveryPicker(false);

                            if (selectedDate) {
                                setDeliveryDate(selectedDate);
                            }
                        }}
                    />
                )}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.accordionCard}>
                        <View style={styles.accordionLeft}>
                            <Ionicons
                                name="medical-outline"
                                size={24}
                                color="#1F2937"
                            />

                            <Text style={styles.accordionTitle}>
                                Implant Instructions
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-down"
                            size={22}
                            color="#1F2937"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accordionCard}
                        onPress={() => setShadeOpen(!shadeOpen)}
                    >
                        <View style={styles.accordionLeft}>
                            <Ionicons
                                name="color-palette-outline"
                                size={24}
                                color="#1F2937"
                            />

                            <Text style={styles.accordionTitle}>
                                Shade Instructions
                            </Text>
                        </View>

                        <Ionicons
                            name={shadeOpen ? "chevron-up" : "chevron-down"}
                            size={22}
                            color="#1F2937"
                        />
                    </TouchableOpacity>
                    {shadeOpen && (
                        <View style={styles.shadeContainer}>

                            {/* Surface Texture + Glazed Polish */}

                            <View style={styles.shadeRow}>

                                {/* Surface Texture */}
                                <View style={styles.shadeColumn}>
                                    <Text style={styles.shadeLabel}>
                                        Surface Texture
                                    </Text>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            Smooth
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            Moderate
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            Heavy
                                        </Text>
                                    </TouchableOpacity>
                                </View>


                                {/* Glazed Polish */}
                                <View style={styles.shadeColumn}>
                                    <Text style={styles.shadeLabel}>
                                        Glazed Polish
                                    </Text>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            High
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            Moderate
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.shadeOption}>
                                        <Ionicons
                                            name="square-outline"
                                            size={20}
                                            color="#D1D5DB"
                                        />
                                        <Text style={styles.shadeOptionText}>
                                            Light
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            </View>

                        </View>
                    )}


                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.backButton}>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton}>
                            <Text style={styles.nextText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",

    },

    heading: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
        color: "#021E48",
        marginHorizontal: 20,
    },

    card: {
        marginHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#021E48",
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 12,
        marginBottom: 16,
    },

    placeholder: {
        color: "#999",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
    },
    stepText: {
        fontSize: 14,
        color: "#6B7280",
    },

    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },

    progressCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },

    activeCircle: {
        backgroundColor: "#0152A8",
    },

    inactiveCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#D1D5DB",
    },

    progressLine: {
        flex: 1,
        height: 3,
        backgroundColor: "#D1D5DB",
    },

    activeLine: {
        backgroundColor: "#0152A8",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    cardTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0152A8",
        marginLeft: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    halfInput: {
        width: "48%",
    },

    genderContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 20,
    },

    genderButton: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    selectedGender: {
        backgroundColor: "#0152A8",
        borderColor: "#0152A8",
    },

    genderText: {
        color: "#374151",
        fontWeight: "600",
    },

    selectedGenderText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    dropdown: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        borderRadius: 8,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    accordionCard: {
        height: 58,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,

        marginHorizontal: 20,
        marginTop: 18,

        borderWidth: 1,
        borderColor: "#E5E7EB",
        elevation: 2,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",


        marginBottom: 20,
    },
    backButton: {
        width: "35%",
        height: 52,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    backText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#0152A8",
    },



    nextButton: {
        width: "35%",
        height: 52,
        borderRadius: 8,
        backgroundColor: "#0152A8",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    nextText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    ageContainer: {
        width: "34%",
    },

    genderSection: {
        width: "60%",
    },

    genderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    genderOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },

    genderLabel: {
        marginLeft: 6,
        fontSize: 15,
        color: "#374151",
    },
    caseOption: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
    },

    caseText: {
        marginLeft: 12,
        fontSize: 16,
        color: "#374151",
    },
    accordionCard: {
        height: 58,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        elevation: 2,
    }
    ,
    accordionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    accordionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginLeft: 12,
    },
    bottomSection: {
        marginHorizontal: 20,
        marginTop: 18,
    }
    ,
    shadeContainer: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        padding: 16,
        marginTop: -8,
        marginBottom: 8,
    },

    shadeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    shadeColumn: {
        width: "48%",
    },

    shadeLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#021E48",
        marginBottom: 14,
    },

    shadeOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    shadeOptionText: {
        fontSize: 15,
        color: "#374151",
        marginLeft: 8,
    },
});