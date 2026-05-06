import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAIPoem } from '../config/api';
import { useTheme } from '../ThemeContext'; // ✅ IMPORT



const ORANGE = '#FF6B35';
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const TOOLS = [
  { id: 'essay',     label: 'Essay Writer',     description: 'Generate high-quality essays.',   emoji: '✍️', accent: '#FF6B35', bg: '#2A1A12', prompt: 'Write a detailed essay about: '   },
  { id: 'story',     label: 'Story Writer',     description: 'Create imaginative stories.',     emoji: '✨', accent: '#4FC3F7', bg: '#0E2030', prompt: 'Write a creative story about: '    },
  { id: 'poem',      label: 'Poem Writer',      description: 'Words into beautiful poems.',     emoji: '❤️', accent: '#E91E8C', bg: '#280D1E', prompt: 'Write a beautiful poem about: '    },
  { id: 'email',     label: 'Email Writer',     description: 'Write personalized emails.',      emoji: '🔥', accent: '#FFB300', bg: '#261D00', prompt: 'Write a professional email about: ' },
  { id: 'paragraph', label: 'Paragraph Writer', description: 'Clear paragraphs for any topic.', emoji: '📝', accent: '#9C6FFF', bg: '#1A1230', prompt: 'Write a clear paragraph about: '   },
];

const TABS = [
  { id: 'home',     label: 'Home',     icon: '⌂' },
  { id: 'history',  label: 'History',  icon: '◧' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

const saveToHistory = async (type, title, preview) => {
  try {
    const existing = await AsyncStorage.getItem('ai_history');
    const list = existing ? JSON.parse(existing) : [];
    const newItem = {
      id: Date.now().toString(),
      type, title, preview,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    const updated = [newItem, ...list].slice(0, 100);
    await AsyncStorage.setItem('ai_history', JSON.stringify(updated));
  } catch (e) {
    console.log('History save error:', e);
  }
};

function ToolCardList({ tool, onPress, theme }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.965, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,     useNativeDriver: true, speed: 30 }).start();

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(tool)} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[
        styles.toolCardList,
        { transform: [{ scale }], backgroundColor: theme.cardBg, borderColor: theme.border }
      ]}>
        <View style={[styles.toolIconBox, { backgroundColor: tool.bg }]}>
          <Text style={styles.toolEmoji}>{tool.emoji}</Text>
        </View>
        <View style={styles.toolTextWrap}>
          <Text style={[styles.toolLabel, { color: theme.textMain }]}>{tool.label}</Text>
          <Text style={[styles.toolDesc,  { color: theme.textSub  }]}>{tool.description}</Text>
        </View>
        <Text style={[styles.toolArrow, { color: tool.accent }]}>›</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function ToolCardGrid({ tool, onPress, theme }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 30 }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(tool)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.gridCardWrap}
    >
      <Animated.View style={[
        styles.toolCardGrid,
        { transform: [{ scale }], backgroundColor: theme.cardBg, borderColor: theme.border }
      ]}>
        <View style={[styles.gridIconBox, { backgroundColor: tool.bg }]}>
          <Text style={styles.gridEmoji}>{tool.emoji}</Text>
        </View>
        <Text style={[styles.gridLabel, { color: theme.textMain }]}>{tool.label}</Text>
        <Text style={[styles.gridDesc,  { color: theme.textSub  }]} numberOfLines={2}>{tool.description}</Text>
        <View style={[styles.gridAccentBar, { backgroundColor: tool.accent + '40' }]}>
          <View style={[styles.gridAccentFill, { backgroundColor: tool.accent }]} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function ResultModal({ visible, tool, result, loading, onClose }) {
  return (
    <Modal
      visible={visible && !!tool}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {tool && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={[styles.toolIconBox, { backgroundColor: tool.bg || '#1A1A22' }]}>
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
              </View>
              <Text style={styles.modalTitle}>{tool.label}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator color={ORANGE} size="large" />
                  <Text style={styles.loadingText}>Generating with AI…</Text>
                </View>
              ) : result ? (
                <Text style={styles.resultText}>{result}</Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      )}
    </Modal>
  );
}

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme(); // ✅ THEME USE KARO

  const [prompt, setPrompt]             = useState('');
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab]       = useState('home');
  const [isGridView, setIsGridView]     = useState(false);

  const generate = async (tool, fullPrompt) => {
    setSelectedTool(tool);
    setResult('');
    setModalVisible(true);
    setLoading(true);
    try {
      const response = await generateAIPoem(fullPrompt);
      const text = response.text || response.message || 'AI produced no result.';
      setResult(text);
      const title   = prompt.trim() || fullPrompt.slice(0, 60);
      const preview = text.slice(0, 200);
      await saveToHistory(tool.label, title, preview);
    } catch (e) {
      Alert.alert('Error', e.message);
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAsk = () => {
    if (!prompt.trim()) return Alert.alert('Wait!', 'Please enter something first.');
    generate({ label: 'AI Writer', emoji: '🤖', accent: ORANGE, bg: '#1A1200' }, prompt.trim());
  };

  const handleToolPress = (tool) => {
    if (tool.id === 'essay')     { navigation.navigate('EssayWriter');     return; }
    if (tool.id === 'story')     { navigation.navigate('StoryWriter');     return; }
    if (tool.id === 'email')     { navigation.navigate('EmailWriter');     return; }
    if (tool.id === 'paragraph') { navigation.navigate('ParagraphWriter'); return; }
    if (tool.id === 'poem')      { navigation.navigate('PoemWriter');      return; }
    if (tool.id === 'history')   { navigation.navigate('History');         return; }
    if (!prompt.trim()) {
      Alert.alert(tool.label, `Type your topic above, then tap "${tool.label}" again.`, [{ text: 'Got it!' }]);
      return;
    }
    generate(tool, tool.prompt + prompt.trim());
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'settings') navigation.navigate('Settings');
    if (tabId === 'history')  navigation.navigate('History');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.statusBar} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.bottomBorder }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.appIconWrap, { borderColor: ORANGE + '55' }]}>
            <Text style={styles.appIconEmoji}>🤖</Text>
          </View>
          <Text style={[styles.appName, { color: theme.textMain }]}>AI Writer</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={[styles.searchRow, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.textMain }]}
            placeholder="Ask me anything…"
            placeholderTextColor={theme.textSub}
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="go"
            onSubmitEditing={handleQuickAsk}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleQuickAsk}>
            <Text style={styles.searchBtnIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Section Row */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Select Tool</Text>

          <TouchableOpacity
            style={[styles.viewToggleBtn, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}
            onPress={() => setIsGridView(!isGridView)}
            activeOpacity={0.8}
          >
            {isGridView ? (
              <View style={styles.listIconWrap}>
                <View style={[styles.listIconLine, { backgroundColor: theme.textMain }]} />
                <View style={[styles.listIconLine, { backgroundColor: theme.textMain }]} />
                <View style={[styles.listIconLine, { backgroundColor: theme.textMain }]} />
              </View>
            ) : (
              <View style={styles.gridIconWrap}>
                <View style={styles.gridIconRow}>
                  <View style={[styles.gridIconDot, { backgroundColor: theme.textMain }]} />
                  <View style={[styles.gridIconDot, { backgroundColor: theme.textMain }]} />
                </View>
                <View style={styles.gridIconRow}>
                  <View style={[styles.gridIconDot, { backgroundColor: theme.textMain }]} />
                  <View style={[styles.gridIconDot, { backgroundColor: theme.textMain }]} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* List View */}
        {!isGridView && TOOLS.map((tool) => (
          <ToolCardList key={tool.id} tool={tool} onPress={handleToolPress} theme={theme} />
        ))}

        {/* Grid View */}
        {isGridView && (
          <View style={styles.gridContainer}>
            {TOOLS.map((tool) => (
              <ToolCardGrid key={tool.id} tool={tool} onPress={handleToolPress} theme={theme} />
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: theme.bottomNav, borderTopColor: theme.bottomBorder }]}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => handleTabPress(tab.id)}>
              <Text style={[styles.tabIcon, { color: active ? ORANGE : theme.textSub }]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, { color: active ? ORANGE : theme.textSub }, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ResultModal
        visible={modalVisible}
        tool={selectedTool}
        result={result}
        loading={loading}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: STATUS_BAR_HEIGHT + 16, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIconWrap: {
    width: 46, height: 46, borderRadius: 13, backgroundColor: '#2A1A12',
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  appIconEmoji: { fontSize: 23 },
  appName: { fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 16 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1,
    paddingLeft: 18, paddingRight: 9, height: 58, marginBottom: 28,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  searchBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 8,
  },
  searchBtnIcon: { color: '#fff', fontSize: 14, fontWeight: '800' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  viewToggleBtn: {
    width: 42, height: 42, borderRadius: 13, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  listIconWrap: { gap: 4, alignItems: 'center', justifyContent: 'center' },
  listIconLine: { width: 18, height: 2.5, borderRadius: 2 },
  gridIconWrap: { gap: 4 },
  gridIconRow: { flexDirection: 'row', gap: 4 },
  gridIconDot: { width: 7, height: 7, borderRadius: 2 },
  toolCardList: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, borderWidth: 1,
    paddingVertical: 14, paddingHorizontal: 14, marginBottom: 11,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  toolIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  toolEmoji: { fontSize: 24 },
  toolTextWrap: { flex: 1 },
  toolLabel: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  toolDesc:  { fontSize: 13, lineHeight: 18 },
  toolArrow: { fontSize: 28, fontWeight: '300', marginLeft: 6, lineHeight: 30 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCardWrap: { width: '48.5%', marginBottom: 12 },
  toolCardGrid: {
    borderRadius: 20, borderWidth: 1, padding: 16, minHeight: 150,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  gridIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  gridEmoji: { fontSize: 22 },
  gridLabel: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  gridDesc:  { fontSize: 12, lineHeight: 17, marginBottom: 14, flex: 1 },
  gridAccentBar: { height: 3, borderRadius: 2, overflow: 'hidden' },
  gridAccentFill: { width: '40%', height: '100%', borderRadius: 2 },
  bottomNav: {
    flexDirection: 'row', borderTopWidth: 1,
    paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  tabItem:  { flex: 1, alignItems: 'center', gap: 5 },
  tabIcon:  { fontSize: 22 },
  tabLabel: { fontSize: 11, fontWeight: '500' },
  tabLabelActive: { fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#14141C', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingBottom: 44, maxHeight: '85%',
    borderTopWidth: 1, borderColor: '#252530',
  },
  modalHandle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: '#333344', marginTop: 14, marginBottom: 18 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#F2F2F7' },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2A2A35', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: '#F2F2F7', fontSize: 13, fontWeight: '700' },
  modalBody: { maxHeight: '80%' },
  loadingWrap: { alignItems: 'center', paddingVertical: 48, gap: 18 },
  loadingText: { color: '#7B7B8E', fontSize: 15 },
  resultText: { color: '#F2F2F7', fontSize: 16, lineHeight: 27, letterSpacing: 0.15 },
});