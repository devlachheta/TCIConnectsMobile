import AuthFooter from "@/components/authfooter";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <AuthFooter />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  }

})