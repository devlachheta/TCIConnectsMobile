import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Linking,

  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
const HelpAndFAQ = () => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="#021E48"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & FAQ</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >


        <Text style={styles.introText}>
          This section helps you understand how to use the Dentist
          Dashboard efficiently. Browse the questions below or
          contact our support team if you need assistance.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          Dashboard Usage
        </Text>

        <Text style={styles.question}>
          Q: How do I navigate the dashboard?
        </Text>

        <Text style={styles.answer}>
          A: Use the left sidebar to access the main sections:
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Home:</Text> Case overview
            and statistics
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>New Case:</Text> Create a
            prescription (RX) and upload files
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Cases:</Text> View active,
            pending, and completed cases
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Pricing:</Text> Your
            Belgium / Lebanon pricing rates
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Messages:</Text> Per-case
            communication with the lab
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Billing:</Text> Monthly
            invoices and payment details
          </Text>
        </View>

        <Text style={styles.question}>
          Q: Is the dashboard mobile-friendly?
        </Text>

        <Text style={styles.answer}>
          A: Yes. The dashboard is fully responsive on tablets and
          mobile devices. Portrait mode is recommended; landscape
          mode may have layout limitations.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          Sending Cases (Step by Step)
        </Text>

        <Text style={styles.question}>
          Q: How do I create and send a case?
        </Text>

        <Text style={styles.answer}>A:</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            1. Click <Text style={styles.bold}>New Case</Text>
          </Text>

          <Text style={styles.listItem}>
            2. Fill in the RX details (patient, tooth,
            instructions)
          </Text>

          <Text style={styles.listItem}>
            3. Drag & drop STL files or photos (max 100MB)
          </Text>

          <Text style={styles.listItem}>
            4. Review pricing and total cost
          </Text>

          <Text style={styles.listItem}>
            5. Click <Text style={styles.bold}>Submit</Text> to
            receive a tracking ID
          </Text>
        </View>

        <Text style={styles.question}>
          Q: What files are required?
        </Text>

        <Text style={styles.answer}>
          A: STL or PLY files with a completed RX form. Recommended
          additional files: bite scan, shade, opposing scan, and
          photos.
        </Text>

        <Text style={styles.question}>
          Q: How do I track my case?
        </Text>

        <Text style={styles.answer}>
          A: Case statuses are displayed with icons:
        </Text>

        <View style={styles.statusList}>
          <Text style={styles.statusItem}>🟡 Submitted</Text>
          <Text style={styles.statusItem}>🔄 Design</Text>
          <Text style={styles.statusItem}>🟢 Review</Text>
          <Text style={styles.statusItem}>📦 Shipped</Text>
          <Text style={styles.statusItem}>✅ Delivered</Text>
        </View>

        <Text style={styles.question}>
          Q: How do I approve a design?
        </Text>

        <Text style={styles.answer}>
          A: Open the case → View 3D design → Click{" "}
          <Text style={styles.bold}>Approve</Text> or{" "}
          <Text style={styles.bold}>Request Changes</Text> and add
          comments if needed.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Billing</Text>

        <Text style={styles.question}>
          Q: How do I receive invoices?
        </Text>

        <Text style={styles.answer}>A:</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Invoices are emailed at the end of each month
          </Text>

          <Text style={styles.listItem}>
            • You can view and download invoices from the{" "}
            <Text style={styles.bold}>Billing</Text> section
          </Text>

          <Text style={styles.listItem}>
            • Payments are made via bank transfer
          </Text>

          <Text style={styles.listItem}>
            • Invoices reflect your active Belgium / Lebanon
            pricing rates
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          Communication
        </Text>

        <Text style={styles.question}>
          Q: How do I chat with the lab?
        </Text>

        <Text style={styles.answer}>
          A: Go to <Text style={styles.bold}>Messages</Text>, mention{" "}
          <Text style={styles.bold}>@lab</Text>, attach files if
          needed, and track read receipts.
        </Text>

        <Text style={styles.question}>
          Q: How do I request a remake?
        </Text>

        <Text style={styles.answer}>
          A: Go to{" "}
          <Text style={styles.bold}>
            Cases → Request Remake
          </Text>
          , add the reason and upload photos. The lab responds
          within 24 hours.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          Files & Scans
        </Text>

        <Text style={styles.question}>
          Q: My upload failed. What should I do?
        </Text>

        <Text style={styles.answer}>A:</Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Ensure the file format is STL or PLY
          </Text>

          <Text style={styles.listItem}>
            • File size must be under 100MB
          </Text>

          <Text style={styles.listItem}>
            • Use Chrome or Edge for best results
          </Text>

          <Text style={styles.listItem}>
            • If the issue persists, contact support
          </Text>
        </View>

        <Text style={styles.question}>
          Q: What scan quality is required?
        </Text>

        <Text style={styles.answer}>
          A: Full arch coverage, clear margins, at least 10 scan
          passes. Avoid patient movement for best accuracy.
        </Text>

        <Text style={styles.question}>
          Q: How do I duplicate an old case?
        </Text>

        <Text style={styles.answer}>
          A: Go to{" "}
          <Text style={styles.bold}>Cases → Duplicate</Text>,
          update patient details and files, then submit the new
          case.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Account</Text>

        <Text style={styles.question}>
          Q: I forgot my password. What should I do?
        </Text>

        <Text style={styles.answer}>
          A: Click{" "}
          <Text style={styles.bold}>
            Login → Forgot Password
          </Text>{" "}
          and follow the instructions sent to your email.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          Additional Tips
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Notifications:</Text>{" "}
            Alerts appear in Messages for updates
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Supported formats:</Text>{" "}
            Only STL and PLY files are accepted
          </Text>

          <Text style={styles.listItem}>
            • <Text style={styles.bold}>Data privacy / GDPR:</Text>{" "}
            All personal and patient data is securely processed.
            See our Privacy Policy for details.
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Support</Text>

        <View style={styles.countryBlock}>
          <Text style={styles.countryHeading}>
            Belgium
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openEmail("info@tcidental.com")
            }
          >
            <Text style={styles.supportText}>
              <Text style={styles.bold}>Email:</Text>{" "}
              <Text style={styles.link}>
                info@tcidental.com
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openPhone("0032475263026")
            }
          >
            <Text style={styles.supportText}>
              <Text style={styles.bold}>Phone:</Text>{" "}
              <Text style={styles.link}>
                0032475263026
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.countryBlock}>
          <Text style={styles.countryHeading}>
            Lebanon
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openEmail("isales@tcidental.com")
            }
          >
            <Text style={styles.supportText}>
              <Text style={styles.bold}>Email:</Text>{" "}
              <Text style={styles.link}>
                isales@tcidental.com
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openPhone("0096170144044")
            }
          >
            <Text style={styles.supportText}>
              <Text style={styles.bold}>Phone:</Text>{" "}
              <Text style={styles.link}>
                0096170144044
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.responseText}>
          Response time: Emails within 24 hours. For urgent issues,
          please contact us by phone.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpAndFAQ;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: "#021E48",
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 100,
  },

  mainHeading: {
    fontSize: 29,
    fontWeight: "700",
    color: "#021E48",
    marginBottom: 12,
  },

  introText: {
    fontSize: 16,
    lineHeight: 25,
    color: "#374151",
    marginBottom: 24,
  },

  divider: {
    height: 1,
    backgroundColor: "#C9CED6",
    marginVertical: 24,
  },

  sectionHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "#021E48",
    marginBottom: 20,
  },

  question: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 6,
  },

  answer: {
    fontSize: 16,
    lineHeight: 25,
    color: "#374151",
    marginBottom: 12,
  },

  list: {
    paddingLeft: 4,
    marginBottom: 14,
  },

  listItem: {
    fontSize: 16,
    lineHeight: 25,
    color: "#374151",
    marginBottom: 8,
  },

  bold: {
    fontWeight: "700",
    color: "#111827",
  },

  statusList: {
    marginTop: 4,
    marginBottom: 14,
  },

  statusItem: {
    fontSize: 16,
    lineHeight: 28,
    color: "#374151",
  },

  countryBlock: {
    marginTop: 8,
    marginBottom: 28,
  },

  countryHeading: {
    fontSize: 22,
    fontWeight: "500",
    color: "#021E48",
    marginBottom: 10,
  },

  supportText: {
    fontSize: 16,
    lineHeight: 25,
    color: "#111827",
  },

  link: {
    color: "#0066FF",
  },

  responseText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#374151",
    marginTop: 6,
  },
});