import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    getProfile,
    updateProfile,
    uploadProfileImage,
} from "../../services/profileService";

export default function Profile() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [vatId, setVatId] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");

    // Profile image
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [showCountries, setShowCountries] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showEmailEdit, setShowEmailEdit] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await getProfile();

            console.log("Get Profile Response:", response);

            if (response?.success && response?.user) {
                const user = response.user;

                setFullName(user.full_name || "");
                setEmail(user.email || "");
                setPhone(user.phone || "");
                setBusinessName(user.business_name || "");
                setBusinessType(user.business_type || "");
                setLicenseNumber(user.license_number || "");
                setVatId(user.vat_id || "");
                setCountry(user.country || "");
                setAddress(user.address || "");

                // Load existing profile image
                if (user.profile_image) {
                    const imageUrl = user.profile_image.startsWith("http")
                        ? `${user.profile_image}?t=${Date.now()}`
                        : `https://tcidentallab.com/tci-uploads/profile/${encodeURIComponent(
                            user.profile_image
                        )}?t=${Date.now()}`;
                    console.log("Profile Image From Backend:", user.profile_image);
                    console.log("Profile Image URL:", imageUrl);

                    setProfileImage(imageUrl);
                } else {
                    setProfileImage(null);
                }

                // Keep local user data updated
                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            } else {
                Alert.alert(
                    "Error",
                    response?.message ||
                    "Unable to load profile."
                );
            }
        } catch (error: any) {
            console.log(
                "Fetch Profile Error:",
                error
            );

            if (error?.response?.status === 401) {
                await AsyncStorage.removeItem(
                    "access_token"
                );

                await AsyncStorage.removeItem("user");

                Alert.alert(
                    "Session Expired",
                    "Please login again.",
                    [
                        {
                            text: "OK",
                            onPress: () =>
                                router.replace(
                                    "/(auth)/login"
                                ),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "Error",
                    "Unable to load your profile."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const pickProfileImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permission Required",
                "Please allow photo library access to change your profile picture."
            );
            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

        if (!result.canceled) {
            const selectedImage =
                result.assets[0].uri;

            console.log(
                "Selected Profile Image:",
                selectedImage
            );

            // Show selected image immediately
            setProfileImage(selectedImage);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("user");

            router.replace("/(auth)/login");
        } catch (error) {
            console.log("Logout Error:", error);

        }
    };
    const handleSaveProfile = async () => {
        if (!fullName.trim()) {
            Alert.alert(
                "Validation",
                "Full Name is required."
            );
            return;
        }

        if (!phone.trim()) {
            Alert.alert(
                "Validation",
                "Phone number is required."
            );
            return;
        }

        try {
            setSaving(true);
            const profileData = {
                full_name: fullName.trim(),
                phone: phone.trim(),
                business_name: businessName.trim(),
                business_type: businessType.trim(),
                license_number:
                    licenseNumber.trim(),
                vat_id: vatId.trim(),
                country: country.trim(),
                address: address.trim(),
            };


            const response = await updateProfile(profileData);

            console.log(
                "Update Profile Response:",
                response
            );

            if (!response?.success) {
                Alert.alert(
                    "Error",
                    response?.message ||
                    "Unable to update profile."
                );
                return;
            }

            if (
                profileImage &&
                profileImage.startsWith("file://")
            ) {
                console.log(
                    "Uploading Profile Image:",
                    profileImage
                );

                const imageResponse =
                    await uploadProfileImage(profileImage);

                console.log(
                    "Upload Profile Image Response:",
                    imageResponse
                );

                if (!imageResponse?.success) {
                    Alert.alert(
                        "Profile Updated",
                        "Your profile information was updated, but the profile image could not be uploaded."
                    );

                    await fetchProfile();

                    return;
                }
            }


            if (response.user) {
                setFullName(
                    response.user.full_name || ""
                );

                setEmail(
                    response.user.email || ""
                );

                setPhone(
                    response.user.phone || ""
                );

                setBusinessName(
                    response.user.business_name || ""
                );

                setLicenseNumber(
                    response.user.license_number || ""
                );

                setVatId(
                    response.user.vat_id || ""
                );

                setCountry(
                    response.user.country || ""
                );

                setAddress(
                    response.user.address || ""
                );
            }

            // Refresh profile text data from backend
            const latestProfile = await getProfile();

            if (latestProfile?.success && latestProfile?.user) {
                const user = latestProfile.user;

                setFullName(user.full_name || "");
                setEmail(user.email || "");
                setPhone(user.phone || "");
                setBusinessName(user.business_name || "");
                setBusinessType(user.business_type || "");
                setLicenseNumber(user.license_number || "");
                setVatId(user.vat_id || "");
                setCountry(user.country || "");
                setAddress(user.address || "");

                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }


            Alert.alert(
                "Success",
                "Profile updated successfully."
            );

        } catch (error: any) {
            console.log(
                "Update Profile Error:",
                error
            );

            if (
                error?.response?.status === 401
            ) {
                await AsyncStorage.removeItem(
                    "access_token"
                );

                await AsyncStorage.removeItem(
                    "user"
                );

                Alert.alert(
                    "Session Expired",
                    "Please login again.",
                    [
                        {
                            text: "OK",
                            onPress: () =>
                                router.replace(
                                    "/(auth)/login"
                                ),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "Error",
                    error?.response?.data?.detail ||
                    "Unable to update profile."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView
                style={styles.safeArea}
                edges={["top", "bottom"]}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#1677FF"
                    />

                    <Text style={styles.loadingText}>
                        Loading profile...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top", "bottom"]}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={28}
                        color="#062653"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Profile
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.pageTitle}>
                    Profile
                </Text>
                <View style={styles.profileSection}>
                    <View style={styles.profileCircle}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons
                                name="person"
                                size={62}
                                color="#8FA4BD"
                            />
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.imageEditButton}
                        activeOpacity={0.8}
                        onPress={pickProfileImage}
                    >
                        <Ionicons
                            name="pencil"
                            size={17}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>


                <View style={styles.formCard}>
                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Full Name
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter full name"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <View style={styles.emailSection}>
                        <View style={styles.emailRow}>
                            <Text style={styles.emailLabel}>Email</Text>

                            <Text style={styles.currentEmail}>
                                {email}
                            </Text>

                            <TouchableOpacity
                                style={styles.emailEditButton}
                                activeOpacity={0.7}
                                onPress={() => setShowEmailEdit((prev) => !prev)}
                            >
                                <Ionicons
                                    name="pencil"
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                        </View>

                        {showEmailEdit && (
                            <View style={styles.emailEditFields}>
                                <Text style={styles.label}>
                                    New Email
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new email"
                                    placeholderTextColor="#8A8A8A"
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <Text style={[styles.label, { marginTop: 16 }]}>
                                    Confirm Password
                                </Text>

                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Enter password"
                                        placeholderTextColor="#8A8A8A"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showPassword}
                                    />

                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        <Ionicons
                                            name={
                                                showPassword
                                                    ? "eye-off"
                                                    : "eye"
                                            }
                                            size={20}
                                            color="#222"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>




                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Phone
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="Enter phone number"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Business Name
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder="Enter business name"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Registration or License Number
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={licenseNumber}
                            onChangeText={setLicenseNumber}
                            placeholder="Enter license number"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            VAT / TAX ID
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={vatId}
                            onChangeText={setVatId}
                            placeholder="Enter VAT / TAX ID"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Country
                        </Text>

                        <TouchableOpacity
                            style={styles.countryBox}
                            onPress={() =>
                                setShowCountries(
                                    !showCountries
                                )
                            }
                            activeOpacity={0.7}
                        >
                            <Text style={styles.countryText}>
                                {country || "Select country"}
                            </Text>

                            <Ionicons
                                name={
                                    showCountries
                                        ? "chevron-up"
                                        : "chevron-down"
                                }
                                size={20}
                                color="#222222"
                            />
                        </TouchableOpacity>

                        {showCountries && (
                            <View
                                style={styles.countryDropdown}
                            >
                                <TouchableOpacity
                                    style={styles.countryOption}
                                    onPress={() => {
                                        setCountry("Belgium");
                                        setShowCountries(false);
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.countryOptionText
                                        }
                                    >
                                        Belgium
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.countryOption}
                                    onPress={() => {
                                        setCountry("Lebanon");
                                        setShowCountries(false);
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.countryOptionText
                                        }
                                    >
                                        Lebanon
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.countryOption}
                                    onPress={() => {
                                        setCountry("Other");
                                        setShowCountries(false);
                                    }}
                                >
                                    <Text
                                        style={
                                            styles.countryOptionText
                                        }
                                    >
                                        Other
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Address
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Enter address"
                            placeholderTextColor="#888888"
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            saving &&
                            styles.saveButtonDisabled,
                        ]}
                        onPress={handleSaveProfile}
                        activeOpacity={0.8}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                Save Profile
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text style={styles.logoutButtonText}>
                        Logout
                    </Text>

                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: "#062653",
    },

    header: {
        height: 64,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 23,
        fontWeight: "700",
        color: "#062653",
        marginLeft: 6,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 100,
    },

    pageTitle: {
        fontSize: 30,
        fontWeight: "700",
        color: "#062653",
        marginBottom: 22,
    },

    profileSection: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
        position: "relative",
    },

    profileCircle: {
        width: 125,
        height: 125,
        borderRadius: 63,
        backgroundColor: "#E8EEF6",
        borderWidth: 1,
        borderColor: "#D4DDE8",
        alignItems: "center",
        justifyContent: "center",
    },

    imageEditButton: {
        position: "absolute",
        right: "27%",
        bottom: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1677FF",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        borderWidth: 1,
        borderColor: "#D9DDE3",
    },

    field: {
        marginBottom: 18,
    },

    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7,
    },

    label: {
        fontSize: 15,
        fontWeight: "500",
        color: "#062653",
        marginBottom: 7,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D3D9E0",
        borderRadius: 7,
        paddingHorizontal: 13,
        fontSize: 15,
        color: "#26364A",
        backgroundColor: "#FFFFFF",
    },

    disabledInput: {
        backgroundColor: "#F3F5F7",
        color: "#6B7280",
    },
    countryBox: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D3D9E0",
        borderRadius: 7,
        paddingHorizontal: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
    },

    countryText: {
        fontSize: 15,
        color: "#26364A",
    },

    countryDropdown: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#D3D9E0",
        borderRadius: 7,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    countryOption: {
        paddingHorizontal: 13,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    countryOptionText: {
        fontSize: 15,
        color: "#26364A",
    },

    saveButton: {
        alignSelf: "flex-start",
        height: 46,
        paddingHorizontal: 26,
        borderRadius: 23,
        backgroundColor: "#1677FF",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
        minWidth: 130,
    },

    saveButtonDisabled: {
        opacity: 0.7,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
    emailChangeLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: "#062653",
        marginTop: 16,
        marginBottom: 7,
    },

    passwordInputContainer: {
        height: 48,
        borderWidth: 1,
        borderColor: "#D3D9E0",
        borderRadius: 7,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
    },

    passwordInput: {
        flex: 1,
        height: 46,
        paddingHorizontal: 13,
        fontSize: 15,
        color: "#26364A",
    },

    eyeButton: {
        width: 45,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },
    emailSection: {
        marginBottom: 17,
    },

    emailRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },

    emailLabel: {
        fontSize: 16,
        color: "#062653",
        fontWeight: "500",
        marginRight: 10,
    },

    currentEmail: {
        flex: 1,
        fontSize: 16,
        color: "#1677FF",
    },

    emailEditButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#1677FF",
        alignItems: "center",
        justifyContent: "center",
    },

    emailEditFields: {
        marginTop: 10,
    },

    passwordContainer: {
        height: 48,
        borderWidth: 1,
        borderColor: "#d3d9e0",
        borderRadius: 7,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 63,
    },
    logoutButton: {
        height: 48,
        marginTop: 16,
        borderRadius: 25,

        backgroundColor: "#DC3545",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});