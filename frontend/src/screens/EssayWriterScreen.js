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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { generateEssayApi } from "../config/api";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const CARD_BG2 = "#1E1E27";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

export default function EssayWriterScreen({ navigation }) {
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [academicReference, setAcademicReference] = useState(false);
  const [humanizeAi, setHumanizeAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [essayType, setEssayType] = useState("Basic");
  const [showEssayTypes, setShowEssayTypes] = useState(false);

  const handleGenerateEssay = async () => {
    if (!topic.trim()) {
      alert("Please enter topic");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      let result = {
        topic: topic,
        length: 200,
      };

      const response = await generateEssayApi(result);

      setResult(response.text);
    } catch (error) {
      alert(error.message || "Something went wrong");
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
            activeOpacity={0.85}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={20} color={TEXT_MAIN} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Essay Writer</Text>

          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.lengthRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.lengthButton,
                selectedLength === "short" ? styles.lengthButtonActive : null,
              ]}
              onPress={() => setSelectedLength("short")}
            >
              <Text
                style={[
                  styles.lengthButtonText,
                  selectedLength === "short"
                    ? styles.lengthButtonTextActive
                    : null,
                ]}
              >
                Short
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.lengthButton}>
              <View style={styles.lockRow}>
                <Text style={styles.lengthButtonText}>Medium</Text>
                <Icon
                  name="lock"
                  size={12}
                  color={TEXT_SUB}
                  style={styles.lockIcon}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.lengthButton}>
              <View style={styles.lockRow}>
                <Text style={styles.lengthButtonText}>Long</Text>
                <Icon
                  name="lock"
                  size={12}
                  color={TEXT_SUB}
                  style={styles.lockIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Enter Topic</Text>

          <View style={styles.topicBox}>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="i.e The power of gratitude..."
              placeholderTextColor={TEXT_SUB}
              multiline
              textAlignVertical="top"
              style={styles.topicInput}
            />

            <TouchableOpacity activeOpacity={0.9} style={styles.sampleBtn}>
              <Icon name="plus" size={15} color="#FFFFFF" />
              <Text style={styles.sampleBtnText}>Sample text</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Essay Type</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => setShowEssayTypes(!showEssayTypes)}
          >
            <Text style={styles.dropdownText}>{essayType}</Text>
            <Icon name="chevron-down" size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          {showEssayTypes && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setEssayType("Basic");
                  setShowEssayTypes(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Basic</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setEssayType("Argumentative");
                  setShowEssayTypes(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Argumentative</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setEssayType("Narrative");
                  setShowEssayTypes(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Narrative</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setEssayType("Descriptive");
                  setShowEssayTypes(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>Descriptive</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Academic Level</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.dropdown}>
            <Text style={styles.dropdownText}>Default</Text>
            <Icon name="chevron-down" size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          <Text style={styles.label}>Extra Features</Text>

          <View style={styles.featuresWrap}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.featureCard}
              onPress={() => setAcademicReference(!academicReference)}
            >
              <View
                style={[
                  styles.checkbox,
                  academicReference ? styles.checkboxActive : null,
                ]}
              >
                {academicReference ? (
                  <Icon name="check" size={12} color="#111111" />
                ) : null}
              </View>

              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Academic Reference</Text>
                <Text style={styles.featureSub}>Premium feature</Text>
              </View>

              <Icon name="lock" size={15} color={TEXT_SUB} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.featureCard}
              onPress={() => setHumanizeAi(!humanizeAi)}
            >
              <View
                style={[
                  styles.checkbox,
                  humanizeAi ? styles.checkboxActive : null,
                ]}
              >
                {humanizeAi ? (
                  <Icon name="check" size={12} color="#111111" />
                ) : null}
              </View>

              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>Humanize AI</Text>
                <Text style={styles.featureSub}>Premium feature</Text>
              </View>

              <Icon name="lock" size={15} color={TEXT_SUB} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.generateBtn}
            onPress={handleGenerateEssay}
          >
            <Text style={styles.generateBtnText}>
              {loading ? "Generating..." : "Generate Essay"}
            </Text>
          </TouchableOpacity>

          {result ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Generated Essay</Text>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
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
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F2A",
    backgroundColor: DARK_BG,
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
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginHorizontal: 12,
  },
  headerRightSpace: {
    width: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    flexGrow: 1,
  },
  lengthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  lengthButton: {
    width: "31.5%",
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  lengthButtonActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  lengthButtonText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "700",
  },
  lengthButtonTextActive: {
    color: "#FFFFFF",
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockIcon: {
    marginLeft: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_MAIN,
    marginBottom: 10,
  },
  topicBox: {
    minHeight: 170,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    marginBottom: 18,
  },
  topicInput: {
    minHeight: 100,
    color: TEXT_MAIN,
    fontSize: 14,
    lineHeight: 21,
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
  dropdown: {
    height: 54,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  dropdownText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },
  featuresWrap: {
    marginBottom: 22,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    color: TEXT_MAIN,
    fontSize: 13.5,
    fontWeight: "700",
    marginBottom: 3,
  },
  featureSub: {
    color: TEXT_SUB,
    fontSize: 11.5,
    fontWeight: "500",
  },
  generateBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  resultTitle: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  resultText: {
    color: TEXT_SUB,
    fontSize: 13.5,
    lineHeight: 20,
  },
  dropdownOptions: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: -8,
    marginBottom: 18,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  dropdownOptionText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },
});