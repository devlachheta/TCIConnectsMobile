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
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const RGPDpolicy = () => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const openLink = (url) => {
    Linking.openURL(url);
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

        <Text style={styles.headerTitle}>
          RGPD / Privacy Policy
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainHeading}>
          RGPD (GDPR) Compliance & Privacy Policy | Technological
          Crown Innovation Belgium
        </Text>

        <Text style={styles.paragraph}>
          Technological Crown Innovation (TCI) Dental Laboratory is
          committed to protecting personal data and complying with
          the General Data Protection Regulation (GDPR / RGPD).
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          1. Data Controller
        </Text>

        <Text style={styles.boldText}>
          Technological Crown Innovation (TCI)
        </Text>

        <Text style={styles.paragraph}>
          31 Rue du Saphir{"\n"}
          1030 Brussels, Belgium
        </Text>

        <Text style={styles.contactText}>
          Email:{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("mailto:info@tcidental.com")
            }
          >
            info@tcidental.com
          </Text>
          {"\n"}
          Tel: +32 2 734 8565
        </Text>

        <Text style={styles.boldText}>
          Data Protection Officer (DPO):
        </Text>

        <Text style={styles.paragraph}>
          To be appointed – contact via{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("mailto:info@tcidental.com")
            }
          >
            info@tcidental.com
          </Text>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          2. Scope & Legal Basis of Processing
        </Text>

        <Text style={styles.paragraph}>
          This policy applies to the TCI digital platform used by
          dental clinics and professionals for digital dental
          workflows and appliance manufacturing.
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            ○{" "}
            <Text style={styles.boldText}>
              Article 6(1)(b)
            </Text>{" "}
            – Contractual necessity (case processing)
          </Text>

          <Text style={styles.bulletItem}>
            ○{" "}
            <Text style={styles.boldText}>
              Article 9(2)(h)
            </Text>{" "}
            – Healthcare purposes (dental appliance manufacturing)
          </Text>
        </View>

        <Text style={styles.paragraph}>
          By registering on the platform, the dentist or clinic
          enters a professional B2B relationship with TCI.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          3. Data We Process
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.tableScroll}
        >
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.tableHeaderText}>
                  Data Type
                </Text>
              </View>

              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.tableHeaderText}>
                  Purpose
                </Text>
              </View>

              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.tableHeaderText}>
                  Retention
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Patient name / ID / RX notes
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Case manufacturing & traceability
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  10 years (legal obligation)
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Scan files (STL / DICOM)
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Design & production
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Deleted after 90 days
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Dentist / clinic details
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Account management
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Relationship duration + 5 years
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Billing & invoicing data
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  Accounting
                </Text>
              </View>

              <View style={styles.tableCell}>
                <Text style={styles.tableText}>
                  10 years
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <Text style={styles.boldText}>
          Dentist responsibility:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            ○ Patient consent has been obtained
          </Text>

          <Text style={styles.bulletItem}>
            ○ Data shared is limited and necessary
          </Text>

          <Text style={styles.bulletItem}>
            ○ Clinic is authorized to share patient data with TCI
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          4. Data Security & Storage
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            ○ EU-based servers only
          </Text>

          <Text style={styles.bulletItem}>
            ○ Encrypted transmission and storage
          </Text>

          <Text style={styles.bulletItem}>
            ○ Restricted staff access
          </Text>

          <Text style={styles.bulletItem}>
            ○ Automatic scan deletion after 90 days
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          5. Your Rights
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            ○ Right to be informed
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right of access
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right to rectification
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right to erasure (subject to legal retention)
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right to restrict processing
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right to data portability
          </Text>

          <Text style={styles.bulletItem}>
            ○ Right to object
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Requests can be sent to{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("mailto:info@tcidental.com")
            }
          >
            info@tcidental.com
          </Text>
          . Response within one month.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          6. Third Parties
        </Text>

        <Text style={styles.paragraph}>
          TCI does not sell or share personal data for marketing.
          Data may only be shared with trusted processors under a
          Data Processing Agreement or legal authorities when
          required.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          7. Cookies
        </Text>

        <Text style={styles.paragraph}>
          Only essential cookies are used for security and platform
          functionality. No marketing or tracking cookies are used.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          8. Data of Minors
        </Text>

        <Text style={styles.paragraph}>
          Services are not intended for individuals under 18 years
          of age.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          9. Complaints & Supervisory Authority
        </Text>

        <Text style={styles.paragraph}>
          Contact TCI first at{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("mailto:info@tcidental.com")
            }
          >
            info@tcidental.com
          </Text>
          .
        </Text>

        <Text style={styles.paragraph}>
          Belgium Data Protection Authority:
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            openLink(
              "https://www.autoriteprotectiondonnees.be"
            )
          }
        >
          <Text style={styles.link}>
            https://www.autoriteprotectiondonnees.be
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>
          10. Policy Updates
        </Text>

        <Text style={styles.paragraph}>
          This policy may be updated periodically. Continued use of
          the platform constitutes acceptance of updates.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.downloadHeading}>
          Downloads
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { }}
        >
          <Text style={styles.downloadLink}>
            ○ Download Privacy Policy (PDF)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => { }}
        >
          <Text style={styles.downloadLink}>
            ○ Download Data Processing Agreement (PDF)
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.footerCompany}>
          Technological Crown Innovation (TCI)
        </Text>

        <Text style={styles.footerText}>
          31 Rue du Saphir – 1030 Brussels – Belgium
        </Text>

        <Text style={styles.footerText}>
          Tel: +32 2 734 8565
        </Text>

        <Text style={styles.footerText}>
          Website:{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("https://www.tcidental.com")
            }
          >
            www.tcidental.com
          </Text>
        </Text>

        <Text style={styles.footerText}>
          Email:{" "}
          <Text
            style={styles.link}
            onPress={() =>
              openLink("mailto:info@tcidental.com")
            }
          >
            info@tcidental.com
          </Text>
        </Text>

        <Text style={styles.footerText}>
          VAT: BE 0866969469
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RGPDpolicy;

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
    fontSize: 22,
    fontWeight: "600",
    color: "#021E48",
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },

  mainHeading: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "700",
    color: "#021E48",
    marginBottom: 16,
  },

  sectionHeading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
    color: "#021E48",
    marginBottom: 14,
  },

  downloadHeading: {
    fontSize: 21,
    fontWeight: "600",
    color: "#021E48",
    marginBottom: 14,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 12,
  },

  contactText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 14,
  },

  boldText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "700",
    marginBottom: 6,
  },

  bulletList: {
    paddingLeft: 2,
    marginBottom: 12,
  },

  bulletItem: {
    fontSize: 14,
    lineHeight: 23,
    color: "#374151",
    marginBottom: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 20,
  },

  tableScroll: {
    marginBottom: 18,
  },

  table: {
    width: 720,
    borderWidth: 1,
    borderColor: "#222222",
    backgroundColor: "#FFFFFF",
  },

  tableRow: {
    flexDirection: "row",
  },

  tableCell: {
    width: 240,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#222222",
  },

  headerCell: {
    backgroundColor: "#FFFFFF",
  },

  tableHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  tableText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#374151",
  },

  link: {
    color: "#0066FF",
    fontWeight: "500",
  },

  downloadLink: {
    fontSize: 14,
    lineHeight: 24,
    color: "#0066FF",
    marginBottom: 8,
  },

  footerCompany: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  footerText: {
    fontSize: 13,
    lineHeight: 21,
    color: "#374151",
  },
});