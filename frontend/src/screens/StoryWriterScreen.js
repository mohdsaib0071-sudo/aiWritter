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

const getStorySize = (selectedLength) => {
  if (selectedLength === "long") return 7;
  if (selectedLength === "medium") return 5;
  return 3;
};

const buildOpening = (topic, genre, style, creativity) => {
  const lines = {
    Comedy: `On an otherwise ordinary day, everything changed when ${topic.toLowerCase()}. Nobody expected it to be funny, least of all the people living through it.`,
    Drama: `It began quietly with ${topic.toLowerCase()}, the kind of moment that seems small until it begins to reshape people's lives.`,
    Horror: `It started with ${topic.toLowerCase()}, and from the very first sign, something felt deeply wrong.`,
    Romance: `The story began with ${topic.toLowerCase()}, unfolding in the gentle space between coincidence and destiny.`,
    "Sci-Fi": `The first hint came through ${topic.toLowerCase()}, a detail so impossible that it should have been ignored.`,
    Thriller: `The chain of events began with ${topic.toLowerCase()}, and within hours, trust became the most dangerous thing of all.`,
    Fantasy: `Legends had once whispered about ${topic.toLowerCase()}, but no one believed they would ever become real again.`,
  };

  const styleTwist = {
    "Character Driven": `At the center of it all was someone forced to confront their fears, desires, and hidden strengths.`,
    "Plot Driven": `Every decision triggered another consequence, pulling the story forward faster than anyone could stop it.`,
    "Non-Linear": `The truth did not arrive in order; it came in fragments, memories, and revelations that only later made sense.`,
    "Stream of Consciousness": `Thoughts, fears, memories, and half-formed hopes blurred together as reality shifted from one moment to the next.`,
  };

  const creativityTouch = {
    Standard: `What followed felt believable, grounded, and emotionally real.`,
    Creative: `Soon, strange details and unexpected turns began to color every moment.`,
    "Highly Creative": `Reality itself seemed to bend, turning the familiar into something unforgettable and surreal.`,
  };

  return `${lines[genre]} ${styleTwist[style]} ${creativityTouch[creativity]}`;
};

const buildMiddleParagraphs = (topic, genre, style, creativity, count) => {
  const paragraphs = [];

  for (let i = 1; i <= count; i++) {
    let paragraph = "";

    if (genre === "Horror") {
      paragraph = `As the days passed, ${topic.toLowerCase()} stopped feeling like an isolated event and became a presence that followed every step. Shadows lingered too long, doors creaked without touch, and silence itself seemed to listen. The deeper the characters looked, the more they realized that some things do not want to be understood.`;
    } else if (genre === "Comedy") {
      paragraph = `Things only grew more chaotic from there. Every attempt to fix the problem created two new ones, and every serious conversation somehow ended in confusion. Yet beneath the laughter, the characters discovered that absurd situations have a way of exposing honest truths.`;
    } else if (genre === "Romance") {
      paragraph = `With each passing encounter, emotions became more difficult to ignore. Small gestures gained meaning, ordinary places became unforgettable, and silence often said more than words could. What began as curiosity slowly transformed into something tender and impossible to dismiss.`;
    } else if (genre === "Sci-Fi") {
      paragraph = `The mystery deepened when patterns began to emerge. Devices glitched with intention, time seemed to misbehave, and answers only led to larger questions. The more they uncovered, the more obvious it became that the world was far stranger than anyone had imagined.`;
    } else if (genre === "Thriller") {
      paragraph = `Suspicion spread quickly. Every clue had two meanings, every face hid a motive, and every choice carried risk. The closer they came to the truth, the more dangerous the truth itself became.`;
    } else if (genre === "Fantasy") {
      paragraph = `Soon, the ordinary world opened into wonders long forgotten. Strange symbols awakened, old promises returned, and hidden powers stirred beneath the surface of everyday life. But magic always asks for a price, and this story was no exception.`;
    } else {
      paragraph = `As events unfolded, the emotional weight of ${topic.toLowerCase()} became impossible to deny. Relationships were tested, old wounds reopened, and each character had to choose what mattered most before it was too late.`;
    }

    if (style === "Non-Linear") {
      paragraph += ` Oddly, the meaning of that moment was not fully understood until much later, when another memory returned and changed everything.`;
    }

    if (style === "Stream of Consciousness") {
      paragraph += ` Thoughts collided with memories, sensations, and unfinished fears, making each moment feel both immediate and dreamlike.`;
    }

    if (creativity === "Highly Creative") {
      paragraph += ` Even the air seemed to hold symbols, echoes, and impossible patterns that could not be explained by logic alone.`;
    } else if (creativity === "Creative") {
      paragraph += ` Unexpected details kept reshaping the path ahead in ways no one could have predicted.`;
    }

    paragraphs.push(paragraph);
  }

  return paragraphs;
};

const buildEnding = (topic, genre) => {
  const endings = {
    Comedy: `In the end, what began with ${topic.toLowerCase()} left everyone exhausted, embarrassed, and somehow happier than before. It became the kind of story retold with laughter for years.`,
    Drama: `By the time it was over, ${topic.toLowerCase()} had changed them all. Not every wound healed perfectly, but they finally understood what they had been carrying for so long.`,
    Horror: `And when it finally seemed finished, one last sign remained—small, unmistakable, and terrible enough to suggest that ${topic.toLowerCase()} was never truly over.`,
    Romance: `What started with ${topic.toLowerCase()} became a turning point neither of them could forget. In choosing each other, they also chose the kind of life they wanted to live.`,
    "Sci-Fi": `When the final pieces fell into place, ${topic.toLowerCase()} revealed not just a mystery, but a new understanding of reality itself—and of the people brave enough to face it.`,
    Thriller: `At the end, the truth surfaced with brutal clarity. It answered the central mystery of ${topic.toLowerCase()}, but not without leaving scars that would last long after the danger passed.`,
    Fantasy: `Thus, ${topic.toLowerCase()} entered legend. Some would call it myth, others destiny, but those who lived it knew they had crossed the boundary between ordinary life and wonder.`,
  };

  return endings[genre] || endings.Drama;
};

const generateLocalStory = ({ topic, selectedLength, creativity, genre, style }) => {
  const cleanedTopic = topic.trim();
  const totalParagraphs = getStorySize(selectedLength);

  const intro = buildOpening(cleanedTopic, genre, style, creativity);
  const middle = buildMiddleParagraphs(
    cleanedTopic,
    genre,
    style,
    creativity,
    Math.max(totalParagraphs - 2, 1)
  );
  const ending = buildEnding(cleanedTopic, genre);

  return [intro, ...middle, ending].join("\n\n");
};

export default function StoryWriterScreen({ navigation }) {
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

  const currentSampleTopic = useMemo(() => {
    return SAMPLE_TOPICS[genre] || "A hidden event changes everything in one night.";
  }, [genre]);

  const closeAll = () => {
    setShowCreativityDrop(false);
    setShowGenreDrop(false);
    setShowStyleDrop(false);
  };

  const handleLengthPress = (len) => {
    if (len !== "short") {
      Alert.alert("Locked", `${len.charAt(0).toUpperCase() + len.slice(1)} option abhi locked hai.`);
      return;
    }
    setSelectedLength("short");
  };

  const handleSamplePress = () => {
    setTopic(currentSampleTopic);
  };

  const handleGenerateStory = async () => {
    closeAll();

    if (!topic.trim()) {
      Alert.alert("Topic required", "Please enter a topic first.");
      return;
    }

    try {
      setLoading(true);

      const story = generateLocalStory({
        topic,
        selectedLength,
        creativity,
        genre,
        style,
      });

      setGeneratedStory(story);
      setShowResultModal(true);
    } catch (error) {
      Alert.alert("Error", error?.message || "Story generate nahi ho paayi.");
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

            <TouchableOpacity activeOpacity={0.9} style={styles.sampleBtn} onPress={handleSamplePress}>
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
            <Icon
              name={showCreativityDrop ? "chevron-up" : "chevron-down"}
              size={18}
              color={TEXT_MAIN}
            />
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
                  <Text
                    style={[
                      styles.dropdownItemText,
                      creativity === opt && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {creativity === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Select Genre</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => {
              const next = !showGenreDrop;
              closeAll();
              setShowGenreDrop(next);
            }}
          >
            <Text style={styles.dropdownText}>{genre}</Text>
            <Icon name={showGenreDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          {showGenreDrop && (
            <View style={styles.dropdownMenu}>
              {GENRE_OPTIONS.map((opt, index) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    genre === opt && styles.dropdownItemActive,
                    index === GENRE_OPTIONS.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    setGenre(opt);
                    setShowGenreDrop(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      genre === opt && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {genre === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Select Styles</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.dropdown}
            onPress={() => {
              const next = !showStyleDrop;
              closeAll();
              setShowStyleDrop(next);
            }}
          >
            <Text style={styles.dropdownText}>{style}</Text>
            <Icon name={showStyleDrop ? "chevron-up" : "chevron-down"} size={18} color={TEXT_MAIN} />
          </TouchableOpacity>

          {showStyleDrop && (
            <View style={styles.dropdownMenu}>
              {STYLE_OPTIONS.map((opt, index) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dropdownItem,
                    style === opt && styles.dropdownItemActive,
                    index === STYLE_OPTIONS.length - 1 && styles.dropdownItemLast,
                  ]}
                  onPress={() => {
                    setStyle(opt);
                    setShowStyleDrop(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      style === opt && styles.dropdownItemTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {style === opt && <Icon name="check" size={14} color={ORANGE} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGenerateStory}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.generateBtnTextLoading}>Generating Story...</Text>
              </View>
            ) : (
              <Text style={styles.generateBtnText}>Generate Story</Text>
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
              <Text style={styles.modalTitle}>Generated Story</Text>
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
              <Text style={styles.modalStoryText}>{generatedStory}</Text>
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
    marginBottom: 6,
  },

  dropdownText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },

  dropdownMenu: {
    backgroundColor: CARD_BG2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 18,
    overflow: "hidden",
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  dropdownItemActive: {
    backgroundColor: "#22222E",
  },

  dropdownItemText: {
    color: TEXT_SUB,
    fontSize: 14,
    fontWeight: "500",
  },

  dropdownItemTextActive: {
    color: TEXT_MAIN,
    fontWeight: "700",
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

  generateBtnDisabled: {
    opacity: 0.85,
  },

  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

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