import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DARK_BG   = '#0D0D12';
const CARD_BG   = '#18181F';
const BORDER    = '#232330';
const TEXT_MAIN = '#F2F2F7';
const TEXT_SUB  = '#7B7B8E';
const ORANGE    = '#FF6B35';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const SETTINGS_ITEMS = [
  { id: 'account',    label: 'Account',           emoji: '\uD83D\uDC64' },
  { id: 'theme',      label: 'Theme',              emoji: '\uD83C\uDFA8' },
  { id: 'languages',  label: 'Languages',          emoji: '\uD83C\uDF10' },
  { id: 'report',     label: 'Report Content',     emoji: '\uD83D\uDEA9' },
  { id: 'rate',       label: 'Rate us',            emoji: '\u2B50' },
  { id: 'support',    label: 'Contact Us',         emoji: '\u2B50' },
  { id: 'about',      label: 'About',              emoji: '\uD83D\uDCBC' },
  { id: 'privacy',    label: 'Privacy Policy',     emoji: '\uD83D\uDD12' },
  { id: 'terms',      label: 'Terms & Conditions', emoji: '\uD83D\uDCCB' },
  { id: 'feature',    label: 'Feature Request',    emoji: '\u2728' },
  { id: 'logout',     label: 'Logout',             emoji: '\uD83D\uDEAA', danger: true },
];

const TABS = [
  { id: 'home',     label: 'Home',       icon: '\u2302' },
  { id: 'history',  label: 'History',    icon: '\u25A7' },
  { id: 'contact',  label: 'Contact Us', icon: '\u2709' },
  { id: 'settings', label: 'Settings',   icon: '\u2699' },
];

export default function SettingsScreen({ navigation }) {

  const handleAccountPress = () => {
    Alert.alert(
      'Account',
      'Choose an option',
      [
        {
          text: 'Login',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
        {
          text: 'Signup',
          onPress: () => {
            navigation.navigate('Signup');
          },
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('user_token');
            navigation.replace('Login');
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleItemPress = async (id) => {
    switch (id) {
      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout', style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('user_token');
              navigation.replace('Login');
            },
          },
        ]);
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Opens privacy policy page.');
        break;
      case 'terms':
        Alert.alert('Terms & Conditions', 'Opens terms page.');
        break;
      case 'about':
        Alert.alert('About', 'AI Writer v1.0.0\nMade with \u2764\uFE0F');
        break;
      case 'rate':
        Alert.alert('Rate Us', 'Thanks for supporting us!');
        break;
      case 'feature':
        Alert.alert('Feature Request', 'Send your ideas to support@aiwriter.app');
        break;
      case 'report':
        Alert.alert('Report Content', 'Send report to support@aiwriter.app');
        break;
      case 'theme':
        Alert.alert('Theme', 'Theme options coming soon!');
        break;
      case 'languages':
        navigation.navigate('language');
        break;
      case 'account':
        handleAccountPress();
        break;
      default:
        break;
    }
  };

  const handleTabPress = (tabId) => {
    if (tabId === 'home') navigation.navigate('Home');
    else if (tabId === 'history') Alert.alert('History', 'Coming soon!');
    else if (tabId === 'contact') Alert.alert('Contact Us', 'support@aiwriter.app');
    else if (tabId === 'settings') return;
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>{'\u2039'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SETTINGS_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingCard,
              item.danger && styles.settingCardDanger,
            ]}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.75}
          >
            <View style={[
              styles.iconBox,
              item.danger && styles.iconBoxDanger,
            ]}>
              <Text style={styles.iconEmoji}>{item.emoji}</Text>
            </View>

            <Text style={[
              styles.itemLabel,
              item.danger && styles.itemLabelDanger,
            ]}>
              {item.label}
            </Text>

            <Text style={[
              styles.arrow,
              item.danger && styles.arrowDanger,
            ]}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const active = tab.id === 'settings';
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 20,
    paddingBottom: 18,
    paddingHorizontal: 22,
    backgroundColor: DARK_BG,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F2A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 28,
    color: TEXT_MAIN,
    lineHeight: 32,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: TEXT_MAIN,
    letterSpacing: 0.2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 11,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  settingCardDanger: {
    borderColor: '#FF3B3B33',
    backgroundColor: '#1A0E0E',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E1E2A',
    borderWidth: 1,
    borderColor: '#2A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconBoxDanger: {
    backgroundColor: '#2A0E0E',
    borderColor: '#FF3B3B33',
  },
  iconEmoji: { fontSize: 20 },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  itemLabelDanger: {
    color: '#FF5252',
  },
  arrow: {
    fontSize: 24,
    color: TEXT_SUB,
    lineHeight: 26,
    marginLeft: 6,
  },
  arrowDanger: {
    color: '#FF5252',
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
});