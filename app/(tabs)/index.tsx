import { Text, View, StyleSheet } from "react-native";
import Login from "../(auth)/login";
import Forgot from "../(auth)/forgotpassword";
import Register from "../(auth)/registration";

export default function Index() {
  return (
    <>
      {/* <View style={styles.container}>
        <Text style={styles.text}>
          Welcome to TCI Dental
        </Text>
      </View> */}
      {/* <Forgot /> */}
      <Register />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0152A8",
  },

})