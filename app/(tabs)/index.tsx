import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AuthFooter from "@/components/authfooter";
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import { ImageBackground } from "expo-image";


export default function HomeScreen() {
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />
        <ImageBackground
          source={require("../../assets/images/login-bgimg-DX-S1Q5C.png")}
          style={styles.background}
          resizeMode="cover"
        >

          <AuthInput
            label="Username or Email"
            placeholder="Email"
            keyboardType="email-address"
          />

          <AuthInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton
            title="Login"
            onPress={() => alert("Login Clicked")}
          />
        </ImageBackground>
        <AuthFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flexGrow: 1,
    paddingTop: 5,
  },
  background: {
    flex: 1,
  },

});