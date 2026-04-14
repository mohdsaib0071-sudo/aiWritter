import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const CARD_BG2 = "#1E1E27";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

const TAB_WRITE = "write";
const TAB_REPLY = "reply";

const SAMPLE_TOPICS = {
  write: "Requesting leave for tomorrow due to personal work",
  reply: "Reply to client about project timeline and next steps",
};

export default function EmailWriterScreen({ navigation }) {
  const [topic, setTopic] = useState("");
  const [activeTab, setActiveTab] = useState(TAB_WRITE);
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  const currentPlaceholder =
    activeTab === TAB_REPLY
      ? "i.e Reply to manager about meeting update..."
      : "i.e The power of gratitude...";

  const currentLabel = activeTab === TAB_REPLY ? "Reply topic" : "Email topic";

  const currentButtonText =
    activeTab === TAB_REPLY ? "Generate Reply" : "Generate Email";

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setTopic("");
  };

  const handleSamplePress = () => {
    setTopic(SAMPLE_TOPICS[activeTab]);
  };

  const getWriteEmailContent = (inputTopic) => {
    const cleanTopic = inputTopic.trim();

    return {
      subject: `Regarding ${cleanTopic}`,
      body: `Dear Sir/Madam,

I hope you are doing well.

I am writing this email regarding ${cleanTopic.toLowerCase()}. I wanted to connect with you and share the details in a clear and professional manner.

Please let me know if any further information is required from my side. I would be happy to provide additional details if needed.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
    };
  };

  const getReplyEmailContent = (inputTopic) => {
    const cleanTopic = inputTopic.trim();

    return {
      subject: `Re: ${cleanTopic}`,
      body: `Dear Sir/Madam,

Thank you for your email.

I appreciate you reaching out regarding ${cleanTopic.toLowerCase()}. I have reviewed the matter and wanted to respond accordingly.

Please let me know if you would like me to share anything further or clarify any point. I will be happy to assist.

Best regards,
[Your Name]`,
    };
  };

  const handleGenerateEmail = async () => {
    if (!topic.trim()) {
      Alert.alert("Topic required", "Please enter an email topic first.");
      return;
    }

    try {
      setLoading(true);

      const result =
        activeTab === TAB_REPLY
          ? getReplyEmailContent(topic)
          : getWriteEmailContent(topic);

      const finalText = `Subject: ${result.subject}

${result.body}`;

      setGeneratedEmail(finalText);
      setShowResultModal(true);
    } catch (error) {
      Alert.alert("Error", error?.message || "Email generate nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={DARK_BG} barStyle="light-content" />

      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Icon name="chevron-left" size={20} color={TEXT_MAIN} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Email Writer</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tabRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={activeTab === TAB_WRITE ? styles.activeTab : styles.tab}
              onPress={() => handleTabPress(TAB_WRITE)}
            >
              <Text style={activeTab === TAB_WRITE ? styles.activeTabText : styles.tabText}>
                Write Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={activeTab === TAB_REPLY ? styles.activeTab : styles.tab}
              onPress={() => handleTabPress(TAB_REPLY)}
            >
              <Text style={activeTab === TAB_REPLY ? styles.activeTabText : styles.tabText}>
                Reply Email
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{currentLabel}</Text>

          <View style={styles.topicBox}>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder={currentPlaceholder}
              placeholderTextColor={TEXT_SUB}
              multiline
              textAlignVertical="top"
              style={styles.topicInput}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.sampleBtn}
              onPress={handleSamplePress}
            >
              <Icon name="plus" size={15} color="#FFFFFF" />
              <Text style={styles.sampleBtnText}>Sample text</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGenerateEmail}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.generateTextLoading}>
                  {activeTab === TAB_REPLY ? "Generating Reply..." : "Generating Email..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.generateText}>{currentButtonText}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={showResultModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeTab === TAB_REPLY ? "Generated Reply" : "Generated Email"}
              </Text>

              <TouchableOpacity
                onPress={() => setShowResultModal(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.85}
              >
                <Icon name="x" size={18} color={TEXT_MAIN} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalText}>{generatedEmail}</Text>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalActionBtn}
              onPress={() => setShowResultModal(false)}
            >
              <Text style={styles.modalActionBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },

  header: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F2A",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: TEXT_MAIN,
    fontSize: 18,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 44,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
  },

  activeTab: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },

  tabText: {
    color: TEXT_SUB,
    fontSize: 14,
    fontWeight: "500",
  },

  label: {
    color: TEXT_MAIN,
    marginBottom: 10,
    fontWeight: "700",
    fontSize: 14,
  },

  topicBox: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    marginBottom: 20,
    minHeight: 170,
  },

  topicInput: {
    color: TEXT_MAIN,
    minHeight: 110,
    fontSize: 14,
    lineHeight: 22,
    padding: 0,
    marginBottom: 14,
  },

  sampleBtn: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG2,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },

  sampleBtnText: {
    color: TEXT_MAIN,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  generateBtn: {
    height: 56,
    backgroundColor: ORANGE,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  generateBtnDisabled: {
    opacity: 0.85,
  },

  generateText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  generateTextLoading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    maxHeight: "82%",
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  modalTitle: {
    color: TEXT_MAIN,
    fontSize: 18,
    fontWeight: "800",
  },

  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: CARD_BG2,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  modalScroll: {
    flexGrow: 0,
  },

  modalScrollContent: {
    paddingBottom: 14,
  },

  modalText: {
    color: TEXT_MAIN,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "500",
  },

  modalActionBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  modalActionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});