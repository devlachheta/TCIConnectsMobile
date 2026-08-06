
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Text } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { register } from "../../services/authService";
export default function Register() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vatId, setVatId] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const businessData = [
    { label: "Dentist", value: "Dentist" },
    { label: "Dental Lab", value: "Dental Lab" },
    { label: "Other", value: "Other" },
  ];

  const countryData = [
    { label: "Belgium", value: "Belgium" },
    { label: "Lebanon", value: "Lebanon" },
    { label: "Other", value: "Other" },
  ];

  const handleSubmit = async () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !businessName.trim() ||
      !businessType.trim() ||
      !country.trim() ||
      !address.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(fullName)) {
      Alert.alert("Error", "Full name can contain only letters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert("Error", "Phone number must contain exactly 10 digits.");
      return;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!isChecked) {
      Alert.alert(
        "Error",
        "Please accept the GDPR policy."
      );
      return;
    }

    const registerData = {
      full_name: fullName,
      phone,
      email,
      business_name: businessName,
      business_type: businessType,
      license_number: licenseNumber,
      vat_id: vatId,
      country,
      address,
      password,
      confirm_password: confirmPassword,
    };

    try {
      setLoading(true);

      const response = await register(registerData);

      Alert.alert(
        "Success",
        "Registration successful! Your account is under admin review."
      );

      router.replace("/(auth)/login");

    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.Rheading}>
            TCI Connect Sign Up
          </Text>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <AuthInput
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.label}>Phone No</Text>
        <AuthInput

          placeholder="Enter your phone no"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}

        />
        <Text style={styles.label}>Email</Text>
        <AuthInput
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}

        />
        <Text style={styles.label}>Business Name</Text>
        <AuthInput
          placeholder="Enter business name"
          value={businessName}
          onChangeText={setBusinessName}

        />
        <Text style={styles.label}>Dentist</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor="#0152A8"
          data={businessData}
          labelField="label"
          valueField="value"
          placeholder="Select Type of Business"
          value={businessType}
          onChange={(item) => {
            setBusinessType(item.value);
          }}
          renderRightIcon={() => (
            <Text style={styles.arrow}>▼</Text>
          )}
        />
        <Text style={styles.label}>Registration or License Number</Text>
        <AuthInput
          placeholder="Enter registration or license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
        <Text style={styles.label}>VAT / Tax ID (if applicable)</Text>
        <AuthInput
          placeholder="Enter VAT / Tax ID"
          value={vatId}
          onChangeText={setVatId}
        />
        <Text style={styles.label}>Select Country</Text>

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          activeColor="rgb(2,30,72)"
          data={countryData}
          labelField="label"
          placeholder="Select Country"
          valueField="value"
          value={country}
          onChange={(item) => {
            setCountry(item.value);
          }}
          renderRightIcon={() => (
            <Text style={styles.arrow}>▼</Text>
          )}
        />
        <Text style={styles.label}>Address</Text>
        <AuthInput
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.label}>Password</Text>
        <AuthInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Confirm Password</Text>
        <AuthInput
          placeholder="Enter confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "rgb(2,30,72)" : undefined}
          />

          <Text style={styles.checkboxText}>
            I consent to the processing of my personal data under GDPR.
            <Text style={styles.policyLink}>
              {" "}View Policy
            </Text>
          </Text>
        </View>
        <PrimaryButton
          title="Submit"
          onPress={handleSubmit}
          buttonStyle={{
            backgroundColor: "#fff",
            borderWidth: 2,
            borderColor: "#FFFFFF",
            width: "100%",
          }}
          textStyle={{
            color: "black",
            fontSize: 16,
            fontWeight: "700",
          }}
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}>
          <Text
            style={styles.login_link}
          >
            Already have an account? Log In here
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0152A8"
  },


  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 100,
  },
  content: {
    marginVertical: "auto",
  },
  Rheading: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",

  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    marginHorizontal: 8,
  },
  background: {
    flex: 1,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginTop: 10,
  },

  checkboxText: {
    width: "100%",
    alignSelf: "center",

    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },

  policyLink: {
    color: "#4DA6FF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  login_link: {
    color: "#fff",
    fontSize: 15,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10
  },
  dropdown: {
    width: "100%",
    alignSelf: "center",
    height: 45,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: "transparent",
    marginTop: 15
  },

  placeholderStyle: {
    color: "#fff",
    fontSize: 12,
  },

  selectedTextStyle: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  itemTextStyle: {
    color: "#171717",
    fontSize: 16,
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});