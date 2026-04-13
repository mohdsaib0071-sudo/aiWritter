import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const CARD_BG2 = "#1E1E27";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

export default function ParagraphWriterScreen({ navigation }) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Short");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={DARK_BG} barStyle="light-content" />
      <View style={styles.root}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color={TEXT_MAIN} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paragraph Writer</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* LENGTH BUTTONS */}
          <View style={styles.lengthRow}>
            {["1 Paragraph", "3 Paragraph", "5 Paragraph"].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.lengthButton,
                  i === 0 && styles.lengthButtonActive,
                ]}
              >
                <Text style={[
                  styles.lengthText,
                  i === 0 && { color: "#fff" }
                ]}>
                  {item}
                </Text>
                {i !== 0 && <Icon name="lock" size={12} color={TEXT_SUB} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* TOPIC */}
          <Text style={styles.label}>Enter Topic</Text>
          <View style={styles.topicBox}>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="i.e The power of gratitude..."
              placeholderTextColor={TEXT_SUB}
              multiline
              style={styles.topicInput}
            />
            <TouchableOpacity style={styles.sampleBtn}>
              <Icon name="plus" size={14} color="#fff" />
              <Text style={styles.sampleText}>Sample text</Text>
            </TouchableOpacity>
          </View>

          {/* TONE */}
          <Text style={styles.label}>Writing Tone</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{tone}</Text>
            <Icon name="chevron-down" size={18} color={TEXT_MAIN} />
          </View>

          {/* LENGTH */}
          <Text style={styles.label}>Length</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{length}</Text>
            <Icon name="chevron-down" size={18} color={TEXT_MAIN} />
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.generateBtn}>
            <Text style={styles.generateText}>Generate Paragraphs</Text>
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
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F2A"
  },
  backButton: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1, textAlign: "center", color: TEXT_MAIN,
    fontSize: 18, fontWeight: "800"
  },

  scrollContent: { padding: 18 },

  lengthRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  lengthButton: {
    width: "31%", height: 50,
    borderRadius: 16, backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 5
  },
  lengthButtonActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  lengthText: { color: TEXT_MAIN, fontWeight: "700" },

  label: { color: TEXT_MAIN, marginBottom: 10, fontWeight: "700" },

  topicBox: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER,
    padding: 15, marginBottom: 20
  },
  topicInput: { color: TEXT_MAIN, minHeight: 100 },

  sampleBtn: {
    alignSelf: "flex-end", flexDirection: "row",
    backgroundColor: CARD_BG2, padding: 10,
    borderRadius: 14, marginTop: 10
  },
  sampleText: { color: "#fff", marginLeft: 5 },

  dropdown: {
    height: 54, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1,
    borderColor: BORDER, paddingHorizontal: 14,
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20
  },
  dropdownText: { color: TEXT_MAIN },

  generateBtn: {
    backgroundColor: ORANGE, height: 56,
    borderRadius: 18, alignItems: "center",
    justifyContent: "center"
  },
  generateText: { color: "#fff", fontWeight: "800" }
});