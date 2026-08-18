import { useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AdminDrawer from "@/components/admindashboard/AdminDrawer";
import AdminFooter from "@/components/admindashboard/AdminFooter";
import AdminHeader from "@/components/admindashboard/AdminHeader";

export default function AdminDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <View style={styles.mainContent}>

        {/* Header */}
        <AdminHeader
          onMenuPress={() => setDrawerOpen(true)}
        />

        {/* Dashboard Content */}
        <View style={styles.content}>
          {/* Admin dashboard content will be added here */}
        </View>


        <AdminFooter />


        {drawerOpen && (
          <AdminDrawer
            onClose={() => setDrawerOpen(false)}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  mainContent: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 24,
  },
});