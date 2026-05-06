import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform,
  Modal, ActivityIndicator, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { saveToHistory } from "../utils/saveHistory";
import { useTheme } from '../ThemeContext';
import { isSubscribed } from '../utils/subscriptionService';
import SubscriptionModal from '../components/SubscriptionModal';

const ORANGE = "#FF6B35";
const CREATIVITY_OPTIONS = ["Standard", "Creative", "Highly Creative"];
const GENRE_OPTIONS = ["Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Fantasy"];
const STYLE_OPTIONS = ["Character Driven", "Plot Driven", "Non-Linear", "Stream of Consciousness"];
const SAMPLE_TOPICS = {
  Comedy: "A chai seller accidentally becomes the most famous life coach in the city.",
  Drama: "Two brothers reunite after years when they return to save their childhood home.",
  Horror: "A forgotten voice starts whispering from an old mirror every midnight.",
  Romance: "Two strangers keep meeting at the same metro station but never exchange names.",
  "Sci-Fi": "A student discovers that tomorrow's news headlines are appearing on their phone today.",
  Thriller: "A harmless parcel arrives every week, until one day it contains a photo of the receiver sleeping.",
  Fantasy: "A girl finds a hidden door in her room that opens into a kingdom where time has stopped.",
};

const getStorySize = (l) => l === "long" ? 7 : l === "medium" ? 5 : 3;

const buildOpening = (topic, genre, style, creativity) => {
  const lines = {
    Comedy: `On an otherwise ordinary day, everything changed when ${topic.toLowerCase()}.`,
    Drama: `It began quietly with ${topic.toLowerCase()}, the kind of moment that seems small until it begins to reshape people's lives.`,
    Horror: `It started with ${topic.toLowerCase()}, and from the very first sign, something felt deeply wrong.`,
    Romance: `The story began with ${topic.toLowerCase()}, unfolding in the gentle space between coincidence and destiny.`,
    "Sci-Fi": `The first hint came through ${topic.toLowerCase()}, a detail so impossible that it should have been ignored.`,
    Thriller: `The chain of events began with ${topic.toLowerCase()}, and within hours, trust became the most dangerous thing of all.`,
    Fantasy: `Legends had once whispered about ${topic.toLowerCase()}, but no one believed they would ever become real again.`,
  };
  const styleTwist = {
    "Character Driven": `At the center of it all was someone forced to confront their fears.`,
    "Plot Driven": `Every decision triggered another consequence.`,
    "Non-Linear": `The truth did not arrive in order; it came in fragments.`,
    "Stream of Consciousness": `Thoughts, fears, and memories blurred together.`,
  };
  const creativityTouch = {
    Standard: `What followed felt believable and emotionally real.`,
    Creative: `Soon, unexpected turns began to color every moment.`,
    "Highly Creative": `Reality itself seemed to bend into something surreal.`,
  };
  return `${lines[genre]} ${styleTwist[style]} ${creativityTouch[creativity]}`;
};

const buildMiddleParagraphs = (topic, genre, style, creativity, count) => {
  const paragraphs = [];
  for (let i = 1; i <= count; i++) {
    let p = genre === "Horror"
      ? `As the days passed, ${topic.toLowerCase()} stopped feeling like an isolated event.`
      : genre === "Comedy" ? `Things only grew more chaotic from there.`
      : genre === "Romance" ? `With each passing encounter, emotions became more difficult to ignore.`
      : genre === "Sci-Fi" ? `The mystery deepened when patterns began to emerge.`
      : genre === "Thriller" ? `Suspicion spread quickly. Every clue had two meanings.`
      : genre === "Fantasy" ? `Soon, the ordinary world opened into wonders long forgotten.`
      : `As events unfolded, the emotional weight of ${topic.toLowerCase()} became impossible to deny.`;
    if (style === "Non-Linear") p += ` The meaning was not understood until much later.`;
    if (creativity === "Highly Creative") p += ` Even the air seemed to hold impossible patterns.`;
    paragraphs.push(p);
  }
  return paragraphs;
};

const buildEnding = (topic, genre) => {
  const e = {
    Comedy: `In the end, what began with ${topic.toLowerCase()} left everyone somehow happier.`,
    Drama: `By the time it was over, ${topic.toLowerCase()} had changed them all.`,
    Horror: `One last sign remained — suggesting that ${topic.toLowerCase()} was never truly over.`,
    Romance: `What started with ${topic.toLowerCase()} became a turning point neither could forget.`,
    "Sci-Fi": `${topic.toLowerCase()} revealed a new understanding of reality itself.`,
    Thriller: `The truth surfaced with brutal clarity about ${topic.toLowerCase()}.`,
    Fantasy: `Thus, ${topic.toLowerCase()} entered legend.`,
  };
  return e[genre] || e.Drama;
};

const generateLocalStory = ({ topic, selectedLength, creativity, genre, style }) => {
  const t = topic.trim();
  const n = getStorySize(selectedLength);
  return [
    buildOpening(t, genre, style, creativity),
    ...buildMiddleParagraphs(t, genre, style, creativity, Math.max(n - 2, 1)),
    buildEnding(t, genre),
  ].join("\n\n");
};

export default function StoryWriterScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [creativity, setCreativity] = useState("Creative");
  const [genre, setGenre] = useState("Horror");
  const [style, setStyle] = useState("Stream of Consciousness");
  const [showCreativityDrop, setShowCreativityDrop] = useState(false);
  const [showGenreDrop, setShowGenreDrop] = useState(false);
  const [showStyleDrop, setShowStyleDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  // ── Subscription states ─────────────────────────────────────────
  const [showSubscription, setShowSubscription] = useState(false);
  const [pendingLength, setPendingLength] = useState(null);

  const currentSampleTopic = useMemo(() => SAMPLE_TOPICS[genre] || "A hidden event changes everything.", [genre]);
  const closeAll = () => {
    setShowCreativityDrop(false);
    setShowGenreDrop(false);
    setShowStyleDrop(false);
  };

  // ── Length button press ─────────────────────────────────────────
  const handleLengthPress = async (len) => {
    if (len === "short") {
      setSelectedLength("short");
      return;
    }
    // Check subscription for medium/long
    const subscribed = await isSubscribed();
    if (subscribed) {
      setSelectedLength(len);
    } else {
      setPendingLength(len);
      setShowSubscription(true);
    }
  };

  // ── After subscription success ──────────────────────────────────
  const handleSubscribed = () => {
    setShowSubscription(false);
    if (pendingLength) {
      setSelectedLength(pendingLength);
      setPendingLength(null);
    }
  };

  // ── Generate story ──────────────────────────────────────────────
  const handleGenerateStory = async () => {
    closeAll();
    if (!topic.trim()) {
      Alert.alert("Topic required", "Please enter a topic first.");
      return;
    }
    try {
      setLoading(true);
      const story = generateLocalStory({ topic, selectedLength, creativity, genre, style });
      setGeneratedStory(story);
      setShowResultModal(true);
      await saveToHistory("Story Writer", topic, story);
    } catch (error) {
      Alert.alert("Error", error?.message || "Story generate nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (label, value, options, show, setShow, setValue) => (
    <>
      <Text style={[styles.label, { color: theme.textMain }]}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.dropdown, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        onPress={() => { const n = !show; closeAll(); setShow(n); }}
      >
        <Text style={[styles.dropdownText, { color: theme.textMain }]}>{value}</Text>
        <Icon name={show ? "chevron-up" : "chevron-down"} size={18} color={theme.textMain} />
      </TouchableOpacity>
      {show && (
        <View style={[styles.dropdownMenu, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
          {options.map((opt, index) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.dropdownItem,
                { borderBottomColor: theme.border },
                value === opt && { backgroundColor: theme.cardBg },
                index === options.length - 1 && styles.dropdownItemLast,
              ]}
              onPress={() => { setValue(opt); setShow(false); }}
            >
              <Text style={[
                styles.dropdownItemText,
                { color: value === opt ? theme.textMain : theme.textSub },
                value === opt && { fontWeight: "700" },
              ]}>
                {opt}
              </Text>
              {value === opt && <Icon name="check" size={14} color={ORANGE} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar backgroundColor={theme.bg} barStyle={theme.statusBar} />
      <View style={[styles.root, { backgroundColor: theme.bg }]}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.backButton, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Story Writer</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Length Buttons */}
          <View style={styles.lengthRow}>
            {["short", "medium", "long"].map((len) => {
              const isActive = selectedLength === len;
              const isLocked = len !== "short";
              return (
                <TouchableOpacity
                  key={len}
                  activeOpacity={0.9}
                  style={[
                    styles.lengthButton,
                    {
                      backgroundColor: isActive ? ORANGE : theme.cardBg,
                      borderColor: isActive ? ORANGE : theme.border,
                    },
                  ]}
                  onPress={() => handleLengthPress(len)}
                >
                  <View style={styles.lockRow}>
                    <Text style={[
                      styles.lengthButtonText,
                      { color: isActive ? "#fff" : theme.textMain },
                    ]}>
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </Text>
                    {isLocked && !isActive && (
                      <Icon name="lock" size={12} color={theme.textSub} style={styles.lockIcon} />
                    )}
                    {isLocked && isActive && (
                      <Icon name="unlock" size={12} color="#fff" style={styles.lockIcon} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Topic Input */}
          <Text style={[styles.label, { color: theme.textMain }]}>Enter Topic</Text>
          <View style={[styles.topicBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder="i.e The power of gratitude..."
              placeholderTextColor={theme.textSub}
              multiline
              textAlignVertical="top"
              style={[styles.topicInput, { color: theme.textMain }]}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.sampleBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}
              onPress={() => setTopic(currentSampleTopic)}
            >
              <Icon name="plus" size={15} color={theme.textMain} />
              <Text style={[styles.sampleBtnText, { color: theme.textMain }]}>Sample text</Text>
            </TouchableOpacity>
          </View>

          {/* Dropdowns */}
          {renderDropdown("Set Creativity", creativity, CREATIVITY_OPTIONS, showCreativityDrop, setShowCreativityDrop, setCreativity)}
          {renderDropdown("Select Genre", genre, GENRE_OPTIONS, showGenreDrop, setShowGenreDrop, setGenre)}
          {renderDropdown("Select Styles", style, STYLE_OPTIONS, showStyleDrop, setShowStyleDrop, setStyle)}

          {/* Generate Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGenerateStory}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.generateBtnText}>Generating Story...</Text>
              </View>
            ) : (
              <Text style={styles.generateBtnText}>Generate Story</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Generated Story</Text>
              <TouchableOpacity
                onPress={() => setShowResultModal(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}
              >
                <Icon name="x" size={18} color={theme.textMain} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalStoryText, { color: theme.textMain }]}>{generatedStory}</Text>
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

      {/* ✅ Subscription Modal */}
      <SubscriptionModal
        visible={showSubscription}
        featureName={pendingLength === "medium" ? "Medium Length Story" : "Long Length Story"}
        onClose={() => {
          setShowSubscription(false);
          setPendingLength(null);
        }}
        onSubscribed={handleSubscribed}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  root: { flex: 1 },
  header: {
    paddingTop: 12, paddingBottom: 12, paddingHorizontal: 18,
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", borderBottomWidth: 1,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 14,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1, textAlign: "center", fontSize: 18,
    fontWeight: "800", marginHorizontal: 12,
  },
  headerRightSpace: { width: 44 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18, paddingTop: 18,
    paddingBottom: Platform.OS === "ios" ? 40 : 30, flexGrow: 1,
  },
  lengthRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  lengthButton: {
    width: "31.5%", height: 52, borderRadius: 16,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  lengthButtonText: { fontSize: 14, fontWeight: "700" },
  lockRow: { flexDirection: "row", alignItems: "center" },
  lockIcon: { marginLeft: 5 },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  topicBox: {
    minHeight: 170, borderRadius: 20, borderWidth: 1,
    padding: 15, marginBottom: 18,
  },
  topicInput: {
    minHeight: 100, fontSize: 14,
    lineHeight: 21, padding: 0, marginBottom: 14,
  },
  sampleBtn: {
    alignSelf: "flex-end", flexDirection: "row", alignItems: "center",
    borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14,
  },
  sampleBtnText: { fontSize: 13, fontWeight: "600", marginLeft: 6 },
  dropdown: {
    height: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14,
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 6,
  },
  dropdownText: { fontSize: 14, fontWeight: "600" },
  dropdownMenu: { borderRadius: 16, borderWidth: 1, marginBottom: 18, overflow: "hidden" },
  dropdownItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  dropdownItemLast: { borderBottomWidth: 0 },
  dropdownItemText: { fontSize: 14, fontWeight: "500" },
  generateBtn: {
    height: 56, borderRadius: 18, backgroundColor: ORANGE,
    alignItems: "center", justifyContent: "center", marginTop: 8,
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 5,
  },
  generateBtnDisabled: { opacity: 0.85 },
  generateBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalCard: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1,
    maxHeight: "82%", paddingTop: 16, paddingHorizontal: 18,
    paddingBottom: Platform.OS === "ios" ? 28 : 20,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: 12,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  modalScroll: { flexGrow: 0 },
  modalScrollContent: { paddingBottom: 14 },
  modalStoryText: { fontSize: 14, lineHeight: 24, fontWeight: "500" },
  modalActionBtn: {
    height: 52, borderRadius: 16, backgroundColor: ORANGE,
    alignItems: "center", justifyContent: "center", marginTop: 8,
  },
  modalActionBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});