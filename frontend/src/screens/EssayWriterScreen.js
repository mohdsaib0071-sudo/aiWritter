import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { generateEssayApi } from "../config/api";
import { saveToHistory } from "../utils/saveHistory";
import { useTheme } from '../ThemeContext';

const ORANGE = "#FF6B35";

export default function EssayWriterScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [essayType, setEssayType] = useState("Basic");
  const [showEssayTypes, setShowEssayTypes] = useState(false);
  const [academicLevel, setAcademicLevel] = useState("Default");
  const [showAcademicLevels, setShowAcademicLevels] = useState(false);

  const handleGenerateEssay = async () => {
    if (!topic.trim()) { alert("Please enter topic"); return; }
    try {
      setLoading(true);
      setResult("");
      const response = await generateEssayApi({
        topic,
        length: selectedLength === "short" ? 200 : selectedLength === "medium" ? 500 : 1000,
      });
      setResult(response.text);
      await saveToHistory("Essay Writer", topic, response.text);
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar backgroundColor={theme.bg} barStyle={theme.statusBar} />
      <View style={[styles.root, { backgroundColor: theme.bg }]}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
          <TouchableOpacity activeOpacity={0.85}
            style={[styles.backButton, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Essay Writer</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Length Buttons */}
          <View style={styles.lengthRow}>
            {["short", "medium", "long"].map((len) => (
              <TouchableOpacity key={len} activeOpacity={0.9}
                style={[styles.lengthButton,
                  { backgroundColor: selectedLength === len ? ORANGE : theme.cardBg,
                    borderColor: selectedLength === len ? ORANGE : theme.border }]}
                onPress={() => setSelectedLength(len)}>
                <Text style={[styles.lengthButtonText,
                  { color: selectedLength === len ? "#fff" : theme.textMain }]}>
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.textMain }]}>Enter Topic</Text>
          <View style={[styles.topicBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TextInput value={topic} onChangeText={setTopic}
              placeholder="i.e The power of gratitude..."
              placeholderTextColor={theme.textSub} multiline textAlignVertical="top"
              style={[styles.topicInput, { color: theme.textMain }]} />
            <TouchableOpacity activeOpacity={0.9}
              style={[styles.sampleBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
              <Icon name="plus" size={15} color={theme.textMain} />
              <Text style={[styles.sampleBtnText, { color: theme.textMain }]}>Sample text</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: theme.textMain }]}>Essay Type</Text>
          <TouchableOpacity activeOpacity={0.9}
            style={[styles.dropdown, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => setShowEssayTypes(!showEssayTypes)}>
            <Text style={[styles.dropdownText, { color: theme.textMain }]}>{essayType}</Text>
            <Icon name={showEssayTypes ? "chevron-up" : "chevron-down"} size={18} color={theme.textMain} />
          </TouchableOpacity>
          {showEssayTypes && (
            <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              {["Basic","Argumentative","Narrative","Descriptive","Expository","Persuasive"].map((type) => (
                <TouchableOpacity key={type}
                  style={[styles.dropdownOption, { borderBottomColor: theme.border },
                    essayType === type ? { backgroundColor: theme.cardBg2 } : null]}
                  onPress={() => { setEssayType(type); setShowEssayTypes(false); }}>
                  <Text style={[styles.dropdownOptionText,
                    { color: essayType === type ? ORANGE : theme.textMain }]}>{type}</Text>
                  {essayType === type && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.label, { color: theme.textMain }]}>Academic Level</Text>
          <TouchableOpacity activeOpacity={0.9}
            style={[styles.dropdown, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => setShowAcademicLevels(!showAcademicLevels)}>
            <Text style={[styles.dropdownText, { color: theme.textMain }]}>{academicLevel}</Text>
            <Icon name={showAcademicLevels ? "chevron-up" : "chevron-down"} size={18} color={theme.textMain} />
          </TouchableOpacity>
          {showAcademicLevels && (
            <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              {["Default","High School","Undergraduate","Postgraduate","PhD"].map((level) => (
                <TouchableOpacity key={level}
                  style={[styles.dropdownOption, { borderBottomColor: theme.border },
                    academicLevel === level ? { backgroundColor: theme.cardBg2 } : null]}
                  onPress={() => { setAcademicLevel(level); setShowAcademicLevels(false); }}>
                  <Text style={[styles.dropdownOptionText,
                    { color: academicLevel === level ? ORANGE : theme.textMain }]}>{level}</Text>
                  {academicLevel === level && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity activeOpacity={0.9} style={styles.generateBtn}
            onPress={handleGenerateEssay} disabled={loading}>
            <Text style={styles.generateBtnText}>{loading ? "Generating..." : "Generate Essay"}</Text>
          </TouchableOpacity>

          {result ? (
            <View style={[styles.resultBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text style={[styles.resultTitle, { color: theme.textMain }]}>Generated Essay</Text>
              <Text style={[styles.resultText, { color: theme.textSub }]}>{result}</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  root: { flex: 1 },
  header: { paddingTop: 12, paddingBottom: 12, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1 },
  backButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "800", marginHorizontal: 12 },
  headerRightSpace: { width: 44 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: Platform.OS === "ios" ? 40 : 30, flexGrow: 1 },
  lengthRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  lengthButton: { width: "31.5%", height: 52, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  lengthButtonText: { fontSize: 14, fontWeight: "700" },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  topicBox: { minHeight: 170, borderRadius: 20, borderWidth: 1, padding: 15, marginBottom: 18 },
  topicInput: { minHeight: 100, fontSize: 14, lineHeight: 21, padding: 0, marginBottom: 14 },
  sampleBtn: { alignSelf: "flex-end", flexDirection: "row", alignItems: "center", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14 },
  sampleBtnText: { fontSize: 13, fontWeight: "600", marginLeft: 6 },
  dropdown: { height: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  dropdownText: { fontSize: 14, fontWeight: "600" },
  dropdownOptions: { borderRadius: 18, borderWidth: 1, marginTop: -8, marginBottom: 18, overflow: "hidden" },
  dropdownOption: { paddingHorizontal: 14, paddingVertical: 14, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dropdownOptionText: { fontSize: 14, fontWeight: "600" },
  generateBtn: { height: 56, borderRadius: 18, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginTop: 8, shadowColor: ORANGE, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 5 },
  generateBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  resultBox: { marginTop: 20, borderRadius: 18, borderWidth: 1, padding: 16 },
  resultTitle: { fontSize: 15, fontWeight: "800", marginBottom: 10 },
  resultText: { fontSize: 13.5, lineHeight: 20 },
});