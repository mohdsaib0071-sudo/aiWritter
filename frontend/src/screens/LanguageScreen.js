import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Platform,
} from 'react-native';

 import AsyncStorage from '@react-native-async-storage/async-storage';

const DARK_BG   = '#0D0D12';
const CARD_BG   = '#18181F';
const BORDER    = '#232330';
const TEXT_MAIN = '#F2F2F7';
const TEXT_SUB  = '#7B7B8E';
const ORANGE    = '#FF6B35';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const LANGUAGES = [
  { code: 'en',    name: 'English',               native: 'English',            region: 'Global'       },
  { code: 'hi',    name: 'Hindi',                 native: 'हिन्दी',               region: 'India'        },
  { code: 'zh',    name: 'Chinese (Simplified)',  native: '中文 (简体)',           region: 'China'        },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '中文 (繁體)',           region: 'Taiwan'       },
  { code: 'es',    name: 'Spanish',               native: 'Español',            region: 'Global'       },
  { code: 'ar',    name: 'Arabic',                native: 'العربية',             region: 'Middle East'  },
  { code: 'pt',    name: 'Portuguese',            native: 'Português',          region: 'Brazil'       },
  { code: 'fr',    name: 'French',                native: 'Français',           region: 'France'       },
  { code: 'de',    name: 'German',                native: 'Deutsch',            region: 'Germany'      },
  { code: 'ja',    name: 'Japanese',              native: '日本語',               region: 'Japan'        },
  { code: 'ko',    name: 'Korean',                native: '한국어',               region: 'South Korea'  },
  { code: 'ru',    name: 'Russian',               native: 'Русский',            region: 'Russia'       },
  { code: 'it',    name: 'Italian',               native: 'Italiano',           region: 'Italy'        },
  { code: 'tr',    name: 'Turkish',               native: 'Türkçe',             region: 'Turkey'       },
  { code: 'nl',    name: 'Dutch',                 native: 'Nederlands',         region: 'Netherlands'  },
  { code: 'pl',    name: 'Polish',                native: 'Polski',             region: 'Poland'       },
  { code: 'sv',    name: 'Swedish',               native: 'Svenska',            region: 'Sweden'       },
  { code: 'bn',    name: 'Bengali',               native: 'বাংলা',               region: 'Bangladesh'   },
  { code: 'ta',    name: 'Tamil',                 native: 'தமிழ்',               region: 'India'        },
  { code: 'te',    name: 'Telugu',                native: 'తెలుగు',              region: 'India'        },
  { code: 'mr',    name: 'Marathi',               native: 'मराठी',               region: 'India'        },
  { code: 'gu',    name: 'Gujarati',              native: 'ગુજરાતી',             region: 'India'        },
  { code: 'ur',    name: 'Urdu',                  native: 'اردو',               region: 'Pakistan'     },
  { code: 'vi',    name: 'Vietnamese',            native: 'Tiếng Việt',         region: 'Vietnam'      },
  { code: 'th',    name: 'Thai',                  native: 'ภาษาไทย',             region: 'Thailand'     },
  { code: 'id',    name: 'Indonesian',            native: 'Bahasa Indonesia',   region: 'Indonesia'    },
  { code: 'ms',    name: 'Malay',                 native: 'Bahasa Melayu',      region: 'Malaysia'     },
];

export default function LanguageScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase())
  );


const handleSelect = async (code) => {
  setSelectedLanguage(code);

  // ✅ Save language permanently
  await AsyncStorage.setItem('app_language', code);

  setTimeout(() => navigation.goBack(), 300);

  };

  const renderItem = ({ item }) => {
    const isSelected = selectedLanguage === item.code;
    return (
      <TouchableOpacity
        style={[styles.row, isSelected && styles.rowSelected]}
        onPress={() => handleSelect(item.code)}
        activeOpacity={0.75}
      >
        {/* Left: names */}
        <View style={styles.rowLeft}>
          <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.langNative}>{item.native}</Text>
        </View>

        {/* Right: region + check */}
        <View style={styles.rowRight}>
          <View style={styles.regionPill}>
            <Text style={styles.regionText}>{item.region}</Text>
          </View>
          {isSelected && (
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedLang = LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Safe area for status bar */}
      <View style={styles.statusBarSpacer} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Languages</Text>

        {/* Spacer to center title */}
        <View style={styles.backBtn} />
      </View>

      {/* ── Active language banner ── */}
      <View style={styles.activeBanner}>
        <View style={styles.activeBannerLeft}>
          <View style={styles.activeDot} />
          <Text style={styles.activeLabelText}>Active</Text>
        </View>
        <Text style={styles.activeValue}>
          {selectedLang?.name}  ·  {selectedLang?.native}
        </Text>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            placeholderTextColor={TEXT_SUB}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && Platform.OS === 'android' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Count ── */}
      <Text style={styles.countText}>
        {filtered.length} language{filtered.length !== 1 ? 's' : ''}
      </Text>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* ── Bottom safe area ── */}
      <View style={styles.bottomSafe} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },

  // Status bar spacer
  statusBarSpacer: {
    height: STATUS_BAR_HEIGHT + (Platform.OS === 'ios' ? 44 : 0),
    backgroundColor: DARK_BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F2A',
    backgroundColor: DARK_BG,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: TEXT_MAIN,
    lineHeight: 32,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: 0.2,
  },

  // Active banner
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1408',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF6B3533',
  },
  activeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  activeLabelText: {
    fontSize: 13,
    color: ORANGE,
    fontWeight: '600',
  },
  activeValue: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '500',
  },

  // Search
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: BORDER,
    height: 48,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    height: 48,
  },
  clearBtn: {
    fontSize: 14,
    color: TEXT_SUB,
    paddingLeft: 8,
  },

  // Count
  countText: {
    fontSize: 12,
    color: TEXT_SUB,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500',
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  rowSelected: {
    backgroundColor: '#1A1408',
    borderColor: '#FF6B3566',
  },
  rowLeft: {
    flex: 1,
  },
  langName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  langNameSelected: {
    color: ORANGE,
  },
  langNative: {
    fontSize: 13,
    color: TEXT_SUB,
    marginTop: 3,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  regionPill: {
    backgroundColor: '#1E1E2A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: BORDER,
  },
  regionText: {
    fontSize: 11,
    color: TEXT_SUB,
    fontWeight: '500',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  divider: {
    height: 8,
  },

  // Bottom safe area
  bottomSafe: {
    height: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: DARK_BG,
  },
});