import { View, Text, StyleSheet } from "react-native";
import AuthHeader from "@/components/authheader";
export default function HomeScreen() {
  return (
    <>
      <View style={styles.container}>
        <AuthHeader />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",

  }

})