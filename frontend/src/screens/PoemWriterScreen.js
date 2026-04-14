import React, { useMemo, useState } from "react";
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

const CREATIVITY_OPTIONS = ["Standard", "Creative", "Highly Creative"];
const POEM_TYPE_OPTIONS = ["Villanelle", "Sonnet", "Haiku", "Free Verse", "Limerick", "Ode", "Ballad"];

const SAMPLE_TOPICS = {
  Villanelle: "Twinkle twinkle in a sleepless city sky",
  Sonnet: "A quiet love that waits through every season",
  Haiku: "Morning dew on silent grass",
  "Free Verse": "The noise inside a lonely heart",
  Limerick: "A clever old man from Delhi",
  Ode: "The beauty of moonlight after rain",
  Ballad: "A traveler walking home through storms",
};

const getCreativityLine = (creativity) => {
  if (creativity === "Highly Creative") {
    return "with vivid images, unusual metaphors, and emotionally rich language";
  }
  if (creativity === "Creative") {
    return "with expressive words and poetic imagination";
  }
  return "with clear and graceful poetic language";
};

const generateVillanelle = (topic, creativity) => {
  const lineA1 = `${topic}, you echo through the night`;
  const lineA2 = `Still you return in soft and silver light`;

  return [
    lineA1,
    `You move through silent rooms beyond my sight,`,
    lineA2,
    ``,
    `Across my thoughts you wander out of view,`,
    `You leave behind a tender trace and hue,`,
    lineA1,
    ``,
    `The darkened sky feels deeper, calm, and bright,`,
    `As if the stars themselves remember you,`,
    lineA2,
    ``,
    `The heart keeps turning toward what feels so true,`,
    `Even when dawn dissolves the fragile blue,`,
    lineA1,
    ``,
    `And in that hush where dreams and mornings meet,`,
    `Your memory walks on slow and careful feet,`,
    lineA2,
    ``,
    `So let this song remain, both old and new,`,
    `A circle made of longing pulling through,`,
    lineA1,
    lineA2,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateSonnet = (topic, creativity) => {
  return [
    `When ${topic.toLowerCase()} first brushed against my mind,`,
    `It stirred a hush no daylight could undo,`,
    `A fragile thread of wonder, finely twined,`,
    `That bound the passing hour to something true.`,
    ``,
    `It moved like music through an open door,`,
    `And filled the quiet spaces of the soul,`,
    `Till simple things seemed simple nevermore,`,
    `And broken pieces leaned to become whole.`,
    ``,
    `Though time may test the shape of what remains,`,
    `And seasons teach the heart to bend with grace,`,
    `Some beauty lives beneath our hidden pains,`,
    `And leaves its light on every darkened place.`,
    ``,
    `So let ${topic.toLowerCase()} stay, refined, and bright,`,
    `A small forever glowing through the night.`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateHaiku = (topic, creativity) => {
  const creativeTag =
    creativity === "Highly Creative"
      ? "dreams bloom in still air"
      : creativity === "Creative"
      ? "soft colors drift near"
      : "calm silence settles";

  return [
    `${topic}`,
    creativeTag,
    `night listens softly`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateFreeVerse = (topic, creativity) => {
  return [
    `${topic}`,
    `arrives without warning,`,
    `like a thought standing quietly at the door`,
    `waiting to be noticed.`,
    ``,
    `It does not ask permission.`,
    `It enters the room,`,
    `sits beside memory,`,
    `and turns ordinary silence`,
    `into something full of meaning.`,
    ``,
    `I watch it change the air.`,
    `The walls seem softer.`,
    `The night becomes larger.`,
    `Even my unfinished feelings`,
    `begin to speak in complete sentences.`,
    ``,
    `And for a moment,`,
    `nothing is wasted,`,
    `not the ache,`,
    `not the hope,`,
    `not even the distance between what I feel and what I can say.`,
    ``,
    `That is what ${topic.toLowerCase()} does.`,
    `It remains, gently,`,
    `until the heart learns how to answer.`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateLimerick = (topic, creativity) => {
  return [
    `There once was a feeling called ${topic},`,
    `That danced in a way quite hypnotic,`,
    `It sparkled all day,`,
    `Then floated away,`,
    `Yet returned with a grin quite melodic.`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateOde = (topic, creativity) => {
  return [
    `O ${topic}, gentle keeper of the hour,`,
    `You lean upon the edges of the day`,
    `And turn the smallest moment to a flower`,
    `That blooms in thought long after light gives way.`,
    ``,
    `You teach the weary spirit how to stand,`,
    `You place a softer meaning in the air,`,
    `And like a patient, warm, and open hand,`,
    `You make the hidden parts of living bear.`,
    ``,
    `Remain awhile within this restless chest,`,
    `And let your quiet brightness never part;`,
    `For in your presence language does its best`,
    `To name the tender weather of the heart.`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generateBallad = (topic, creativity) => {
  return [
    `There walked a soul through wind and rain,`,
    `Beneath a fading sky,`,
    `And ${topic.toLowerCase()} moved beside that soul`,
    `Like stars that never die.`,
    ``,
    `Through broken roads and distant towns,`,
    `Through loss too deep to name,`,
    `It kept a quiet fire alive`,
    `Inside a heart of flame.`,
    ``,
    `And when at last the dawn appeared`,
    `Across the hills so wide,`,
    `That faithful song of ${topic.toLowerCase()}`,
    `Still traveled by their side.`,
    ``,
    `[Tone: ${getCreativityLine(creativity)}]`,
  ].join("\n");
};

const generatePoemByType = ({ topic, poemType, creativity }) => {
  const cleanedTopic = topic.trim();

  if (poemType === "Villanelle") return generateVillanelle(cleanedTopic, creativity);
  if (poemType === "Sonnet") return generateSonnet(cleanedTopic, creativity);
  if (poemType === "Haiku") return generateHaiku(cleanedTopic, creativity);
  if (poemType === "Free Verse") return generateFreeVerse(cleanedTopic, creativity);
  if (poemType === "Limerick") return generateLimerick(cleanedTopic, creativity);
  if (poemType === "Ode") return generateOde(cleanedTopic, creativity);
  if (poemType === "Ballad") return generateBallad(cleanedTopic, creativity);

  return generateFreeVerse(cleanedTopic, creativity);
};

export default function PoemWriterScreen({ navigation }) {
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [creativity, setCreativity] = useState("Creative");
  const [poemType, setPoemType] = useState("Villanelle");
  const [showCreativityDrop, setShowCreativityDrop] = useState(false);
  const [showPoemTypeDrop, setShowPoemTypeDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  const sampleTopic = useMemo(() => {
    return SAMPLE_TOPICS[poemType] || "The light of the moon";
  }, [poemType]);

  const closeAll = () => {
    setShowCreativityDrop(false);
    setShowPoemTypeDrop(false);
  };

  const handleLengthPress = (len) => {
    if (len !== "short") {
      Alert.alert("Locked", `${len.charAt(0).toUpperCase() + len.slice(1)} option abhi locked hai.`);
      return;
    }
    setSelectedLength("short");
  };

  const handleSampleText = () => {
    setTopic(sampleTopic);
  };

  const handleGeneratePoem = async () => {
    closeAll();

    if (!topic.trim()) {
      Alert.alert("Topic required", "Please enter a topic first.");
      return;
    }

    try {
      setLoading(true);

      const poem = generatePoemByType({
        topic,
        poemType,
        creativity,
      });

      setGeneratedPoem(poem);
      setShowResultModal(true);
    } catch (error) {
      Alert.alert("Error", error?.message || "Poem generate nahi ho paayi.");
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
          <Text style={styles.headerTitle}>Poem Writer</Text>
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
                onPress={() => handleLengthPress(len)}
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
            <TouchableOpacity activeOpacity={0.9} style={styles.sampleBtn} onPress={handleSampleText}>
              <Icon name="plus" size={15} color="#FFFFFF" />
              <Text style={styles.sampleBtnText}>Sample text</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Set Creativity</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => {
              const next = !showCreativityDrop;
              closeAll();
              setShowCreativityDrop(next);
            }}
          >
            <Text style={styles.dropdownText}>{creativity}</Text>
            <Icon name={showCreativityDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          {showCreativityDrop && (
            <View style={styles.dropdownMenu}>
              {CREATIVITY_OPTIONS.map((opt, index) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    creativity === opt && styles.dropdownItemActive,
                    index === CREATIVITY_OPTIONS.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    setCreativity(opt);
                    setShowCreativityDrop(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, creativity === opt && styles.dropdownItemTextActive]}>
                    {opt}
                  </Text>
                  {creativity === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Poem Type</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => {
              const next = !showPoemTypeDrop;
              closeAll();
              setShowPoemTypeDrop(next);
            }}
          >
            <Text style={styles.dropdownText}>{poemType}</Text>
            <Icon name={showPoemTypeDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          {showPoemTypeDrop && (
            <View style={styles.dropdownMenu}>
              {POEM_TYPE_OPTIONS.map((opt, index) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    poemType === opt && styles.dropdownItemActive,
                    index === POEM_TYPE_OPTIONS.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    setPoemType(opt);
                    setShowPoemTypeDrop(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, poemType === opt && styles.dropdownItemTextActive]}>
                    {opt}
                  </Text>
                  {poemType === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGeneratePoem}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.generateBtnTextLoading}>Generating Poem...</Text>
              </View>
            ) : (
              <Text style={styles.generateBtnText}>Generate Poem</Text>
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
              <Text style={styles.modalTitle}>Generated Poem</Text>
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
              <Text style={styles.modalStoryText}>{generatedPoem}</Text>
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
  dropdownItemLast: {
    borderBottomWidth: 0,
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
  generateBtnDisabled: {
    opacity: 0.85,
  },
  generateBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnTextLoading: {
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
  modalStoryText: {
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