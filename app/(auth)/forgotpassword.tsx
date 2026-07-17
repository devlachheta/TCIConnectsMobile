import AuthHeader from "@/components/authheader";
import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "expo-image";
import AuthInput from "@/components/authInput";
import PrimaryButton from "@/components/PrimaryBotton";
import AuthFooter from "@/components/authfooter";
export default function Forgot() {
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
          source={require("../../assets/images/login-bgimg-DX-S1Q5C.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <AuthInput
            placeholder="enter your email"
            keyboardType="email-address"
          />
          <PrimaryButton
            title="Send Reset Link"
            onPress={() => alert("Forgot Button Clicked")}
          />
        </ImageBackground>
        <AuthFooter />
      </ScrollView>
    </SafeAreaView>
  )
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
    paddingTop: 70,
  },
})