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
import { generateAIPoem } from '../services/aiService';

const DARK_BG   = '#0D0D12';
const CARD_BG   = '#18181F';
const CARD_BG2  = '#1E1E27';
const BORDER    = '#28283399';
const TEXT_MAIN = '#F2F2F7';
const TEXT_SUB  = '#7B7B8E';
const ORANGE    = '#FF6B35';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const TOOLS = [
  { id: 'essay',     label: 'Essay Writer',    description: 'Generate high-quality essays.',    emoji: '✍️', accent: '#FF6B35', bg: '#2A1A12', prompt: 'Write a detailed essay about: '   },
  { id: 'story',     label: 'Story Writer',    description: 'Create imaginative stories.',      emoji: '✨', accent: '#4FC3F7', bg: '#0E2030', prompt: 'Write a creative story about: '    },
  { id: 'poem',      label: 'Poem Writer',     description: 'Words into beautiful poems.',      emoji: '❤️', accent: '#E91E8C', bg: '#280D1E', prompt: 'Write a beautiful poem about: '    },
  { id: 'email',     label: 'Email Writer',    description: 'Write personalized emails.',       emoji: '🔥', accent: '#FFB300', bg: '#261D00', prompt: 'Write a professional email about: ' },
  { id: 'paragraph', label: 'Paragraph Writer',description: 'Clear paragraphs for any topic.',  emoji: '📝', accent: '#9C6FFF', bg: '#1A1230', prompt: 'Write a clear paragraph about: '    },
  { id: 'thesis',    label: 'Thesis Statement',description: 'Accurate thesis statements.',      emoji: '📋', accent: '#FF9800', bg: '#231500', prompt: 'Write a thesis statement for: '     },
  {
    id: 'history',
    label: 'History',
    description: 'View your previous content.',
    emoji: '🕘',
    accent: '#6366F1',
    bg: '#14142A',
  },
];

const TABS = [
  { id: 'home',     label: 'Home',       icon: '⌂' },
  { id: 'history',  label: 'History',    icon: '◧' },

  { id: 'settings', label: 'Settings',   icon: '⚙' },
];

function ToolCard({ tool, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.965, useNativeDriver: true, speed: 30 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(tool)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.toolCard, { transform: [{ scale }] }]}>
        <View style={[styles.toolIconBox, { backgroundColor: tool.bg }]}>
          <Text style={styles.toolEmoji}>{tool.emoji}</Text>
        </View>
        <View style={styles.toolTextWrap}>
          <Text style={styles.toolLabel}>{tool.label}</Text>
          <Text style={styles.toolDesc}>{tool.description}</Text>
        </View>
        <Text style={[styles.toolArrow, { color: tool.accent }]}>›</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function ResultModal({ visible, tool, result, loading, onClose }) {
  if (!tool) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
    </Modal>
  );
}

export default function HomeScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user_token');
          navigation.replace('Login');
        },
      },
    ]);
  };

  const generate = async (tool, fullPrompt) => {
    setSelectedTool(tool);
    setResult('');
    setModalVisible(true);
    setLoading(true);
    try {
      const response = await generateAIPoem(fullPrompt);
      setResult(response.text || response.message || 'AI produced no result.');
    } catch (e) {
      Alert.alert('Error', e.message);
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAsk = () => {
    if (!prompt.trim()) {
      return Alert.alert('Wait!', 'Please enter something first.');
    }
    generate(
      { label: 'AI Writer', emoji: '🤖', accent: ORANGE, bg: '#1A1200' },
      prompt.trim()
    );
  };

  const handleToolPress = (tool) => {
    if (tool.id === 'essay') {
      navigation.navigate('EssayWriter');
      return;
    }

    if (tool.id === 'story') {
      navigation.navigate('StoryWriter');
      return;
    }

    if (tool.id === 'email') {
      navigation.navigate('EmailWriter');
      return;
    }

    if (tool.id === 'paragraph') {
      navigation.navigate('ParagraphWriter');
      return;
    }

    if (tool.id === 'history') {
      navigation.navigate('History');
      return;
    }

    if (tool.id === 'poem') {
      navigation.navigate('PoemWriter');
      return;
    }

    if (!prompt.trim()) {
      Alert.alert(
        tool.label,
        `Type your topic in the search bar above, then tap "${tool.label}" again.`,
        [{ text: 'Got it!' }]
      );
      return;
    }

    generate(tool, tool.prompt + prompt.trim());
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'settings') navigation.navigate('Settings');
    else if (tabId === 'contact') Alert.alert('Contact Us', 'support@aiwriter.app');
    else if (tabId === 'history') Alert.alert('History', 'Coming soon!');
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.appIconWrap}>
            <Text style={styles.appIconEmoji}>🤖</Text>
          </View>
          <Text style={styles.appName}>AI Writer</Text>
        </View>
        {/* <TouchableOpacity style={styles.proBtn} onPress={handleLogout}>
          <Text style={styles.proCrown}>👑</Text>
          <Text style={styles.proText}> Go Pro</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ask me anything…"
            placeholderTextColor={TEXT_SUB}
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="go"
            onSubmitEditing={handleQuickAsk}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleQuickAsk}>
            <Text style={styles.searchBtnIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Select Tool</Text>
          <View style={styles.menuBtn}>
            <Text style={styles.menuIcon}>≡</Text>
          </View>
        </View>

        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onPress={handleToolPress} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
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
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: STATUS_BAR_HEIGHT + 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: DARK_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F2A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#2A1A12',
    borderWidth: 1.5,
    borderColor: ORANGE + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconEmoji: { fontSize: 23 },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_MAIN,
    letterSpacing: 0.2,
  },
  proBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#1E1200',
    borderWidth: 1.5,
    borderColor: ORANGE + '88',
  },
  proCrown: { fontSize: 15 },
  proText: {
    color: ORANGE,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252530',
    paddingLeft: 18,
    paddingRight: 9,
    height: 58,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 15,
    paddingVertical: 0,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
  searchBtnIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_MAIN,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: CARD_BG2,
    borderWidth: 1,
    borderColor: '#2A2A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    color: TEXT_MAIN,
    fontSize: 20,
    lineHeight: 22,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232330',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 11,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  toolIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  toolEmoji: { fontSize: 24 },
  toolTextWrap: { flex: 1 },
  toolLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  toolDesc: {
    fontSize: 13,
    color: TEXT_SUB,
    lineHeight: 18,
  },
  toolArrow: {
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 6,
    lineHeight: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: '#1F1F2A',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  tabIcon: {
    fontSize: 22,
    color: TEXT_SUB,
  },
  tabIconActive: { color: ORANGE },
  tabLabel: {
    fontSize: 11,
    color: TEXT_SUB,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: ORANGE,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#14141C',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 44,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#252530',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333344',
    marginTop: 14,
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_MAIN,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A2A35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: TEXT_MAIN,
    fontSize: 13,
    fontWeight: '700',
  },
  modalBody: { maxHeight: '80%' },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 18,
  },
  loadingText: {
    color: TEXT_SUB,
    fontSize: 15,
  },
  resultText: {
    color: TEXT_MAIN,
    fontSize: 16,
    lineHeight: 27,
    letterSpacing: 0.15,
  },
});