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

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const CARD_BG2 = "#1E1E27";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

const CREATIVITY_OPTIONS = ["Standard", "Creative", "Highly Creative"];
const GENRE_OPTIONS = ["Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Fantasy"];
const STYLE_OPTIONS = ["Character Driven", "Plot Driven", "Non-Linear", "Stream of Consciousness"];

export default function StoryWriterScreen({ navigation }) {
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [creativity, setCreativity] = useState("Standard");
  const [genre, setGenre] = useState("Comedy");
  const [style, setStyle] = useState("Character Driven");
  const [showCreativityDrop, setShowCreativityDrop] = useState(false);
  const [showGenreDrop, setShowGenreDrop] = useState(false);
  const [showStyleDrop, setShowStyleDrop] = useState(false);

  const closeAll = () => {
    setShowCreativityDrop(false);
    setShowGenreDrop(false);
    setShowStyleDrop(false);
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
          <Text style={styles.headerTitle}>Story Writer</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.lengthRow}>
            {["short", "medium", "long"].map((len) => (
              <TouchableOpacity
                key={len}
                activeOpacity={0.9}
                style={[
                  styles.lengthButton,
                  selectedLength === len && len === "short" ? styles.lengthButtonActive : null,
                ]}
                onPress={() => len === "short" && setSelectedLength("short")}
              >
                <View style={styles.lockRow}>
                  <Text
                    style={[
                      styles.lengthButtonText,
                      selectedLength === len && len === "short" ? styles.lengthButtonTextActive : null,
                    ]}
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </Text>
                  {len !== "short" && (
                    <Icon name="lock" size={12} color={TEXT_SUB} style={styles.lockIcon} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
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

          <Text style={styles.label}>Set Creativity</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => { closeAll(); setShowCreativityDrop(!showCreativityDrop); }}
          >
            <Text style={styles.dropdownText}>{creativity}</Text>
            <Icon name={showCreativityDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>
          {showCreativityDrop && (
            <View style={styles.dropdownMenu}>
              {CREATIVITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, creativity === opt && styles.dropdownItemActive]}
                  onPress={() => { setCreativity(opt); setShowCreativityDrop(false); }}
                >
                  <Text style={[styles.dropdownItemText, creativity === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  {creativity === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Select Genre</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => { closeAll(); setShowGenreDrop(!showGenreDrop); }}
          >
            <Text style={styles.dropdownText}>{genre}</Text>
            <Icon name={showGenreDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>
          {showGenreDrop && (
            <View style={styles.dropdownMenu}>
              {GENRE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, genre === opt && styles.dropdownItemActive]}
                  onPress={() => { setGenre(opt); setShowGenreDrop(false); }}
                >
                  <Text style={[styles.dropdownItemText, genre === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  {genre === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Select Styles</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => { closeAll(); setShowStyleDrop(!showStyleDrop); }}
          >
            <Text style={styles.dropdownText}>{style}</Text>
            <Icon name={showStyleDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>
          {showStyleDrop && (
            <View style={styles.dropdownMenu}>
              {STYLE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, style === opt && styles.dropdownItemActive]}
                  onPress={() => { setStyle(opt); setShowStyleDrop(false); }}
                >
                  <Text style={[styles.dropdownItemText, style === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  {style === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity activeOpacity={0.9} style={styles.generateBtn}>
            <Text style={styles.generateBtnText}>Generate Story</Text>
          </TouchableOpacity>
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
  root: { flex: 1, backgroundColor: DARK_BG },
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
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1, textAlign: "center", fontSize: 18,
    fontWeight: "800", color: TEXT_MAIN, marginHorizontal: 12,
  },
  headerRightSpace: { width: 44 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    flexGrow: 1,
  },
  lengthRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  lengthButton: {
    width: "31.5%", height: 52, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
    alignItems: "center", justifyContent: "center",
  },
  lengthButtonActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  lengthButtonText: { color: TEXT_MAIN, fontSize: 14, fontWeight: "700" },
  lengthButtonTextActive: { color: "#FFFFFF" },
  lockRow: { flexDirection: "row", alignItems: "center" },
  lockIcon: { marginLeft: 5 },
  label: { fontSize: 14, fontWeight: "700", color: TEXT_MAIN, marginBottom: 10 },
  topicBox: {
    minHeight: 170, backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER, padding: 15, marginBottom: 18,
  },
  topicInput: {
    minHeight: 100, color: TEXT_MAIN, fontSize: 14,
    lineHeight: 21, padding: 0, marginBottom: 14,
  },
  sampleBtn: {
    alignSelf: "flex-end", flexDirection: "row", alignItems: "center",
    backgroundColor: CARD_BG2, borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14,
  },
  sampleBtnText: { color: TEXT_MAIN, fontSize: 13, fontWeight: "600", marginLeft: 6 },
  dropdown: {
    height: 54, backgroundColor: CARD_BG, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6,
  },
  dropdownText: { color: TEXT_MAIN, fontSize: 14, fontWeight: "600" },
  dropdownMenu: {
    backgroundColor: CARD_BG2, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, marginBottom: 18, overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  dropdownItemActive: { backgroundColor: "#22222E" },
  dropdownItemText: { color: TEXT_SUB, fontSize: 14, fontWeight: "500" },
  dropdownItemTextActive: { color: TEXT_MAIN, fontWeight: "700" },
  generateBtn: {
    height: 56, borderRadius: 18, backgroundColor: ORANGE,
    alignItems: "center", justifyContent: "center", marginTop: 8,
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 5,
  },
  generateBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
});