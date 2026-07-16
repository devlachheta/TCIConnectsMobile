import AuthFooter from "@/components/authfooter";
import PrimaryButton from "@/components/PrimaryBotton";
import { View, Text, StyleSheet } from "react-native";
import AuthHeader from "@/components/authheader";
import AuthInput from "@/components/authInput";
import { useState } from "react";

export default function HomeScreen() {
  const [password, setPassword] = useState("")
  return (
    <>

      <View style={styles.container}>
        <AuthHeader />
        <AuthInput
          label="Username or Email"
          placeholder="Email"

          keyboardType="email-address"
        />
        <AuthInput
          label="Password"
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PrimaryButton
          title="Login"
          onPress={() => {
            alert("Login Clicked")
          }} />
      </View>
      <View style={styles.container}>

        <AuthFooter />

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    // alignItems: "center",
    // justifyContent: "center",

=======
    backgroundColor: "#00254C",
    alignItems: "center",
    justifyContent: "center",
    marginBlock: "auto"
>>>>>>> a056613e18fbee1d48482c01ae0bc9f3d865a36d
  }
})