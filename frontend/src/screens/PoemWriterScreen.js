import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Platform,
  Modal, ActivityIndicator, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { saveToHistory } from "../utils/saveHistory";
import { useTheme } from '../ThemeContext';

const ORANGE = "#FF6B35";
const CREATIVITY_OPTIONS = ["Standard", "Creative", "Highly Creative"];
const POEM_TYPE_OPTIONS = ["Villanelle", "Sonnet", "Haiku", "Free Verse", "Limerick", "Ode", "Ballad"];
const SAMPLE_TOPICS = { Villanelle: "Twinkle twinkle in a sleepless city sky", Sonnet: "A quiet love that waits through every season", Haiku: "Morning dew on silent grass", "Free Verse": "The noise inside a lonely heart", Limerick: "A clever old man from Delhi", Ode: "The beauty of moonlight after rain", Ballad: "A traveler walking home through storms" };

const getCreativityLine = (c) => c === "Highly Creative" ? "with vivid images and emotionally rich language" : c === "Creative" ? "with expressive words and poetic imagination" : "with clear and graceful poetic language";

const generatePoemByType = ({ topic, poemType, creativity }) => {
  const t = topic.trim();
  const cl = getCreativityLine(creativity);
  if (poemType === "Haiku") return `${t}\n${creativity === "Highly Creative" ? "dreams bloom in still air" : "soft colors drift near"}\nnight listens softly\n\n[Tone: ${cl}]`;
  if (poemType === "Limerick") return `There once was a feeling called ${t},\nThat danced in a way quite hypnotic,\nIt sparkled all day,\nThen floated away,\nYet returned with a grin quite melodic.\n\n[Tone: ${cl}]`;
  if (poemType === "Sonnet") return `When ${t.toLowerCase()} first brushed against my mind,\nIt stirred a hush no daylight could undo,\nA fragile thread of wonder, finely twined,\nThat bound the passing hour to something true.\n\nIt moved like music through an open door,\nAnd filled the quiet spaces of the soul,\nTill simple things seemed simple nevermore,\nAnd broken pieces leaned to become whole.\n\nThough time may test the shape of what remains,\nAnd seasons teach the heart to bend with grace,\nSome beauty lives beneath our hidden pains,\nAnd leaves its light on every darkened place.\n\nSo let ${t.toLowerCase()} stay, refined, and bright,\nA small forever glowing through the night.\n\n[Tone: ${cl}]`;
  if (poemType === "Free Verse") return `${t}\narrives without warning,\nlike a thought standing quietly at the door\nwaiting to be noticed.\n\nIt does not ask permission.\nIt enters the room,\nsits beside memory,\nand turns ordinary silence\ninto something full of meaning.\n\nAnd for a moment,\nnothing is wasted,\nnot the ache, not the hope.\n\nThat is what ${t.toLowerCase()} does.\n\n[Tone: ${cl}]`;
  if (poemType === "Ode") return `O ${t}, gentle keeper of the hour,\nYou lean upon the edges of the day\nAnd turn the smallest moment to a flower\nThat blooms in thought long after light gives way.\n\nRemain awhile within this restless chest,\nAnd let your quiet brightness never part;\nFor in your presence language does its best\nTo name the tender weather of the heart.\n\n[Tone: ${cl}]`;
  if (poemType === "Ballad") return `There walked a soul through wind and rain,\nBeneath a fading sky,\nAnd ${t.toLowerCase()} moved beside that soul\nLike stars that never die.\n\nThrough broken roads and distant towns,\nThrough loss too deep to name,\nIt kept a quiet fire alive\nInside a heart of flame.\n\n[Tone: ${cl}]`;
  // Villanelle
  return `${t}, you echo through the night\nYou move through silent rooms beyond my sight,\nStill you return in soft and silver light\n\nAcross my thoughts you wander out of view,\nYou leave behind a tender trace and hue,\n${t}, you echo through the night\n\nThe darkened sky feels deeper, calm, and bright,\nAs if the stars themselves remember you,\nStill you return in soft and silver light\n\n[Tone: ${cl}]`;
};

export default function PoemWriterScreen({ navigation }) {
  const { theme } = useTheme();
  const [topic, setTopic] = useState("");
  const [creativity, setCreativity] = useState("Creative");
  const [poemType, setPoemType] = useState("Villanelle");
  const [showCreativityDrop, setShowCreativityDrop] = useState(false);
  const [showPoemTypeDrop, setShowPoemTypeDrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);

  const sampleTopic = useMemo(() => SAMPLE_TOPICS[poemType] || "The light of the moon", [poemType]);
  const closeAll = () => { setShowCreativityDrop(false); setShowPoemTypeDrop(false); };

  const handleGeneratePoem = async () => {
    closeAll();
    if (!topic.trim()) { Alert.alert("Topic required", "Please enter a topic first."); return; }
    try {
      setLoading(true);
      const poem = generatePoemByType({ topic, poemType, creativity });
      setGeneratedPoem(poem);
      setShowResultModal(true);
      await saveToHistory("Poem Writer", topic, poem);
    } catch (error) {
      Alert.alert("Error", error?.message || "Poem generate nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  const renderDrop = (label, value, options, show, setShow, setValue) => (
    <>
      <Text style={[styles.label, { color: theme.textMain }]}>{label}</Text>
      <TouchableOpacity activeOpacity={0.9}
        style={[styles.dropdown, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        onPress={() => { const n = !show; closeAll(); setShow(n); }}>
        <Text style={[styles.dropdownText, { color: theme.textMain }]}>{value}</Text>
        <Icon name={show ? "chevron-up" : "chevron-down"} size={18} color={theme.textMain} />
      </TouchableOpacity>
      {show && (
        <View style={[styles.dropdownMenu, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
          {options.map((opt, i) => (
            <TouchableOpacity key={opt}
              style={[styles.dropdownItem, { borderBottomColor: theme.border }, value === opt && { backgroundColor: theme.cardBg }, i === options.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => { setValue(opt); setShow(false); }}>
              <Text style={[styles.dropdownItemText, { color: value === opt ? theme.textMain : theme.textSub }, value === opt && { fontWeight: "700" }]}>{opt}</Text>
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
        <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
          <TouchableOpacity activeOpacity={0.85}
            style={[styles.backButton, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Poem Writer</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.label, { color: theme.textMain }]}>Enter Topic</Text>
          <View style={[styles.topicBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <TextInput value={topic} onChangeText={setTopic} placeholder="i.e The power of gratitude..."
              placeholderTextColor={theme.textSub} multiline textAlignVertical="top"
              style={[styles.topicInput, { color: theme.textMain }]} />
            <TouchableOpacity activeOpacity={0.9}
              style={[styles.sampleBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}
              onPress={() => setTopic(sampleTopic)}>
              <Icon name="plus" size={15} color={theme.textMain} />
              <Text style={[styles.sampleBtnText, { color: theme.textMain }]}>Sample text</Text>
            </TouchableOpacity>
          </View>

          {renderDrop("Set Creativity", creativity, CREATIVITY_OPTIONS, showCreativityDrop, setShowCreativityDrop, setCreativity)}
          {renderDrop("Poem Type", poemType, POEM_TYPE_OPTIONS, showPoemTypeDrop, setShowPoemTypeDrop, setPoemType)}

          <TouchableOpacity activeOpacity={0.9}
            style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
            onPress={handleGeneratePoem} disabled={loading}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.generateBtnText}>Generating Poem...</Text>
              </View>
            ) : <Text style={styles.generateBtnText}>Generate Poem</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={showResultModal} animationType="slide" transparent onRequestClose={() => setShowResultModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>Generated Poem</Text>
              <TouchableOpacity onPress={() => setShowResultModal(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
                <Icon name="x" size={18} color={theme.textMain} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalText, { color: theme.textMain }]}>{generatedPoem}</Text>
            </ScrollView>
            <TouchableOpacity activeOpacity={0.9} style={styles.modalActionBtn} onPress={() => setShowResultModal(false)}>
              <Text style={styles.modalActionBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  label: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  topicBox: { minHeight: 170, borderRadius: 20, borderWidth: 1, padding: 15, marginBottom: 18 },
  topicInput: { minHeight: 100, fontSize: 14, lineHeight: 21, padding: 0, marginBottom: 14 },
  sampleBtn: { alignSelf: "flex-end", flexDirection: "row", alignItems: "center", borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14 },
  sampleBtnText: { fontSize: 13, fontWeight: "600", marginLeft: 6 },
  dropdown: { height: 54, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  dropdownText: { fontSize: 14, fontWeight: "600" },
  dropdownMenu: { borderRadius: 16, borderWidth: 1, marginBottom: 18, overflow: "hidden" },
  dropdownItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 14, fontWeight: "500" },
  generateBtn: { height: 56, borderRadius: 18, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginTop: 8, shadowColor: ORANGE, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 10, elevation: 5 },
  generateBtnDisabled: { opacity: 0.85 },
  generateBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.2 },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, maxHeight: "82%", paddingTop: 16, paddingHorizontal: 18, paddingBottom: Platform.OS === "ios" ? 28 : 20 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  modalScroll: { flexGrow: 0, maxHeight: "80%" },
  modalText: { fontSize: 14, lineHeight: 24, fontWeight: "500", paddingBottom: 14 },
  modalActionBtn: { height: 52, borderRadius: 16, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginTop: 8 },
  modalActionBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});