import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

export default function EmailWriterScreen({ navigation }) {
  const [topic, setTopic] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={DARK_BG} barStyle="light-content" />

      <View style={styles.root}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color={TEXT_MAIN} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Email Writer</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* TAB */}
          <View style={styles.tabRow}>
            <View style={styles.activeTab}><Text style={styles.activeTabText}>Write Email</Text></View>
            <View style={styles.tab}><Text style={styles.tabText}>Reply Email</Text></View>
          </View>

          {/* INPUT */}
          <Text style={styles.label}>Email topic</Text>
          <View style={styles.topicBox}>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="i.e The power of gratitude..."
              placeholderTextColor={TEXT_SUB}
              multiline
              style={styles.topicInput}
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.generateBtn}>
            <Text style={styles.generateText}>Generate Email</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK_BG, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  root: { flex: 1, backgroundColor: DARK_BG },

  header: {
    padding: 18, flexDirection: "row",
    alignItems: "center", borderBottomWidth: 1,
    borderBottomColor: "#1F1F2A"
  },
  backButton: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: CARD_BG, borderWidth: 1,
    borderColor: BORDER, alignItems: "center", justifyContent: "center"
  },
  headerTitle: { flex: 1, textAlign: "center", color: TEXT_MAIN, fontSize: 18, fontWeight: "800" },

  scrollContent: { padding: 18 },

  tabRow: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 20,
    padding: 4
  },
  activeTab: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center"
  },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  activeTabText: { color: "#000", fontWeight: "700" },
  tabText: { color: TEXT_SUB },

  label: { color: TEXT_MAIN, marginBottom: 10, fontWeight: "700" },

  topicBox: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    marginBottom: 20
  },
  topicInput: { color: TEXT_MAIN, minHeight: 120 },

  generateBtn: {
    height: 56,
    backgroundColor: ORANGE,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  generateText: { color: "#fff", fontWeight: "800" }
});