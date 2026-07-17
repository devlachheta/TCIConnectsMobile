import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";
import AuthHeader from "@/components/authheader";
import { ImageBackground } from "expo-image";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { Text } from "react-native-gesture-handler";
import AuthFooter from "@/components/authfooter";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";



export default function Register() {
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
  const businessData = [
    { label: "Select Type Of Business", value: "" },
    { label: "Dentist", value: "Dentist" },
    { label: "Dental Lab", value: "Dental Lab" },
    { label: "Other", value: "Other" },
  ];

  const countryData = [
    { label: "Select Country", value: "" },
    { label: "Belgium", value: "Belgium" },
    { label: "Lebanon", value: "Lebanon" },
    { label: "Other", value: "Other" },
  ];
  const [isChecked, setChecked] = useState(false);
  const handleRegister = () => {
    const registerData = {
      full_name: fullName,
      phone: phone,
      email: email,
      business_name: businessName,
      business_type: businessType,
      license_number: licenseNumber,
      vat_id: vatId,
      country: country,
      address: address,
      password: password,
      confirm_password: confirmPassword,
    };
    console.log(registerData);
  }
  return (
    <SafeAreaView style={styles.safeArea}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />
        <ImageBackground
          source={require("../../assets/images/sign-up-bgimg-CSoYyOzh.png")}

          style={styles.background}
          resizeMode="cover"
        >
          <AuthInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <AuthInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}

          />
          <AuthInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}

          />
          <AuthInput
            placeholder="Business Name "
            value={businessName}
            onChangeText={setBusinessName}

          />

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

          <AuthInput
            placeholder="Registration or License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <AuthInput
            placeholder="VAT/TAX ID (if applicable)"
            value={vatId}
            onChangeText={setVatId}
          />

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            activeColor="#0152A8"
            data={countryData}
            labelField="label"
            valueField="value"
            placeholder="Select Country"
            value={country}
            onChange={(item) => {
              setCountry(item.value);
            }}
            renderRightIcon={() => (
              <Text style={styles.arrow}>▼</Text>
            )}
          />
          <AuthInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AuthInput
            placeholder=" Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#0152A8" : undefined}
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
            onPress={handleRegister}
          />


          <Text
            style={styles.login_link}
          >
            Already have an account? Log In here
          </Text>



        </ImageBackground>
        <AuthFooter />
      </ScrollView>
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },

  container: {
    flexGrow: 1,
    paddingTop: 5,
  },
  background: {
    flex: 1,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },

  checkboxText: {
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
    height: 55,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    marginTop: 27
  },

  placeholderStyle: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  selectedTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
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