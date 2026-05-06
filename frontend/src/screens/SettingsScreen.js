import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, Platform, Alert, Modal, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import { getSubscriptionDetails, cancelSubscription, isSubscribed } from '../utils/subscriptionService';
import SubscriptionModal from '../components/SubscriptionModal';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
const ORANGE = '#FF6B35';


// ── Free languages (no subscription needed) ──
const FREE_LANGUAGES = ['en', 'hi'];

// ── All languages ──
const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧', nativeName: 'English' },
  { code: 'hi', label: 'Hindi',      flag: '🇮🇳', nativeName: 'हिंदी' },
  // ── Premium languages below ──
  { code: 'ur', label: 'Urdu',       flag: '🇵🇰', nativeName: 'اردو' },
  { code: 'ar', label: 'Arabic',     flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'fr', label: 'French',     flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸', nativeName: 'Español' },
  { code: 'de', label: 'German',     flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'zh', label: 'Chinese',    flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', label: 'Japanese',   flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', label: 'Korean',     flag: '🇰🇷', nativeName: '한국어' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'ru', label: 'Russian',    flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'it', label: 'Italian',    flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'tr', label: 'Turkish',    flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'bn', label: 'Bengali',    flag: '🇧🇩', nativeName: 'বাংলা' },
  { code: 'pa', label: 'Punjabi',    flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ta', label: 'Tamil',      flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu',     flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam',  flag: '🇮🇳', nativeName: 'മലയാളം' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
];

const SETTINGS_ITEMS = [
  { id: 'account',      label: 'Account',            icon: 'person-outline' },
  { id: 'subscription', label: 'Subscription',       icon: 'diamond-outline' },
  { id: 'theme',        label: 'Theme',              icon: 'color-palette-outline' },
  { id: 'languages',    label: 'Languages',          icon: 'globe-outline' },
  { id: 'report',       label: 'Report Content',     icon: 'flag-outline' },
  { id: 'rate',         label: 'Rate us',            icon: 'star-outline' },
  { id: 'support',      label: 'Contact Us',         icon: 'mail-outline' },
  { id: 'about',        label: 'About',              icon: 'briefcase-outline' },
  { id: 'privacy',      label: 'Privacy Policy',     icon: 'lock-closed-outline' },
  { id: 'terms',        label: 'Terms & Conditions', icon: 'document-text-outline' },
  { id: 'feature',      label: 'Feature Request',    icon: 'sparkles-outline' },
  { id: 'logout',       label: 'Logout',             icon: 'log-out-outline', danger: true },
];

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home-outline' },
  { id: 'history',  label: 'History',  icon: 'time-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

const ACCOUNT_OPTIONS = [
  { id: 'login',  label: 'Login',   sub: 'Sign in to your account',  icon: 'log-in-outline',     color: '#4FC3F7', bg: '#0E2030' },
  { id: 'signup', label: 'Sign Up', sub: 'Create a new account',     icon: 'person-add-outline',  color: '#A78BFA', bg: '#1A1230' },
  { id: 'logout', label: 'Logout',  sub: 'Sign out of your account', icon: 'log-out-outline',     color: '#FF5252', bg: '#2A0E0E', danger: true },
];

export default function SettingsScreen({ navigation }) {
  const { theme, mode, toggleTheme } = useTheme();

  const [themeModalVisible, setThemeModalVisible]               = useState(false);
  const [accountModalVisible, setAccountModalVisible]           = useState(false);
  const [languageModalVisible, setLanguageModalVisible]         = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const [subDetailModalVisible, setSubDetailModalVisible]       = useState(false);
  const [aboutModalVisible, setAboutModalVisible]               = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [userSubscribed, setUserSubscribed]     = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await loadSubscription();
    await loadLanguage();
  };

  const loadSubscription = async () => {
    const data = await getSubscriptionDetails();
    const subscribed = await isSubscribed();
    setSubscriptionData(data);
    setUserSubscribed(subscribed);
  };

  const loadLanguage = async () => {
    const lang = await AsyncStorage.getItem('app_language');
    if (lang) setSelectedLanguage(lang);
  };

  // ── Language select handler ──────────────────────────────────────
  const handleLanguageSelect = async (lang) => {
    const isFree = FREE_LANGUAGES.includes(lang.code);

    if (!isFree && !userSubscribed) {
      // Show subscription popup
      setLanguageModalVisible(false);
      setTimeout(() => setSubscriptionModalVisible(true), 400);
      return;
    }

    setSelectedLanguage(lang.code);
    await AsyncStorage.setItem('app_language', lang.code);
    setLanguageModalVisible(false);
    Alert.alert(
      `${lang.flag} Language Updated`,
      `Language changed to ${lang.label} (${lang.nativeName})`
    );
  };

  const handleRateUs = () => {
    Alert.alert('⭐ Rate AI Writer', 'Enjoying AI Writer? Please rate us on the store!', [
      { text: 'Not Now', style: 'cancel' },
      {
        text: 'Rate Now ⭐',
        onPress: () => {
          const url = Platform.OS === 'ios'
            ? 'https://apps.apple.com/app/idYOUR_APP_ID'
            : 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';
          Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open store.'));
        },
      },
    ]);
  };

  const handleContactUs = () => {
    Alert.alert('📧 Contact Us', 'How would you like to reach us?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Email', onPress: () => Linking.openURL('mailto:support@aiwriter.app?subject=Support Request') },
      { text: 'WhatsApp',   onPress: () => Linking.openURL('https://wa.me/919999999999') },
    ]);
  };

  const handleCancelSubscription = () => {
    Alert.alert('Cancel Subscription', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive',
        onPress: async () => {
          await cancelSubscription();
          setSubscriptionData(null);
          setUserSubscribed(false);
          setSubDetailModalVisible(false);
          Alert.alert('Cancelled', 'Your subscription has been cancelled.');
        },
      },
    ]);
  };

  const handleAccountOptionPress = async (id) => {
    setAccountModalVisible(false);
    if (id === 'login')       setTimeout(() => navigation.navigate('Login'), 300);
    else if (id === 'signup') setTimeout(() => navigation.navigate('Signup'), 300);
    else if (id === 'logout') {
      setTimeout(() => {
        Alert.alert('Logout', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout', style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('user_token');
              navigation.replace('Login');
            },
          },
        ]);
      }, 300);
    }
  };

  const handleItemPress = (id) => {
    switch (id) {
      case 'account':      setAccountModalVisible(true); break;
      case 'subscription':
        if (userSubscribed) setSubDetailModalVisible(true);
        else setSubscriptionModalVisible(true);
        break;
      case 'theme':        setThemeModalVisible(true); break;
      case 'languages':    setLanguageModalVisible(true); break;
      case 'rate':         handleRateUs(); break;
      case 'support':      handleContactUs(); break;
      case 'report':
        Linking.openURL('mailto:report@aiwriter.app?subject=Content Report');
        break;
      case 'feature':
        Linking.openURL('mailto:features@aiwriter.app?subject=Feature Request');
        break;
      case 'privacy':
        Linking.openURL('https://yourwebsite.com/privacy-policy').catch(() =>
          Alert.alert('Privacy Policy', 'Visit: yourwebsite.com/privacy-policy'));
        break;
      case 'terms':
        Linking.openURL('https://yourwebsite.com/terms').catch(() =>
          Alert.alert('Terms', 'Visit: yourwebsite.com/terms'));
        break;
      case 'about': setAboutModalVisible(true); break;
      case 'logout':
        Alert.alert('Logout', 'Are you sure?', [
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
    }
  };

  const handleTabPress = (tabId) => {
    if (tabId === 'home')    navigation.navigate('Home');
    else if (tabId === 'history') navigation.navigate('History');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const getDaysLeft = (d) => d ? Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000)) : 0;
  const getPlanLabel = (p) => p === 'weekly' ? 'Weekly Plan' : p === 'monthly' ? 'Monthly Plan' : p === 'yearly' ? 'Yearly Plan' : 'Premium Plan';
  const currentLang = LANGUAGES.find(l => l.code === selectedLanguage);

  const freeLangs    = LANGUAGES.filter(l => FREE_LANGUAGES.includes(l.code));
  const premiumLangs = LANGUAGES.filter(l => !FREE_LANGUAGES.includes(l.code));

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={theme.statusBar} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Icon name="chevron-back" size={22} color={theme.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textMain }]}>Settings</Text>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SETTINGS_ITEMS.map((item) => (
          <TouchableOpacity key={item.id}
            style={[styles.settingCard, {
              backgroundColor: item.danger ? '#1A0E0E' : theme.cardBg,
              borderColor: item.danger ? '#FF3B3B33' : theme.border,
            }]}
            onPress={() => handleItemPress(item.id)}
          >
            <View style={[styles.iconBox, {
              backgroundColor: item.danger ? '#2A0E0E' : item.id === 'subscription' ? '#261D00' : theme.iconBox,
              borderColor: item.danger ? '#FF3B3B33' : item.id === 'subscription' ? ORANGE + '44' : theme.iconBorder,
            }]}>
              <Icon name={item.icon} size={20}
                color={item.danger ? '#FF5252' : item.id === 'subscription' ? ORANGE : theme.textMain} />
            </View>

            <Text style={[styles.itemLabel, { color: item.danger ? '#FF5252' : theme.textMain }]}>
              {item.label}
            </Text>

            {item.id === 'theme' && (
              <View style={[styles.badge, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
                <Icon name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'} size={12} color={ORANGE} />
                <Text style={styles.badgeText}>{mode === 'dark' ? 'Dark' : 'Light'}</Text>
              </View>
            )}

            {item.id === 'subscription' && (
              <View style={[styles.badge, {
                backgroundColor: userSubscribed ? '#1A2A10' : '#261D00',
                borderColor: userSubscribed ? '#4CAF5066' : ORANGE + '66',
              }]}>
                <Text style={[styles.badgeText, { color: userSubscribed ? '#4CAF50' : ORANGE }]}>
                  {userSubscribed ? '✓ Active' : 'Free'}
                </Text>
              </View>
            )}

            {item.id === 'languages' && (
              <View style={[styles.badge, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
                <Text style={styles.badgeText}>{currentLang?.flag} {currentLang?.label}</Text>
              </View>
            )}

            <Icon name="chevron-forward" size={18} color={item.danger ? '#FF5252' : theme.textSub} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: theme.bottomNav, borderTopColor: theme.bottomBorder }]}>
        {TABS.map((tab) => {
          const active = tab.id === 'settings';
          return (
            <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => handleTabPress(tab.id)}>
              <Icon name={tab.icon} size={22} color={active ? ORANGE : theme.textSub} />
              <Text style={[styles.tabLabel, { color: active ? ORANGE : theme.textSub }, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── Subscription Buy Modal ─── */}
      <SubscriptionModal
        visible={subscriptionModalVisible}
        featureName={null}
        onClose={() => setSubscriptionModalVisible(false)}
        onSubscribed={async () => {
          setSubscriptionModalVisible(false);
          await loadSubscription();
        }}
      />

      {/* ─── Language Modal ─── */}
      <Modal visible={languageModalVisible} transparent animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />

            {/* Header */}
            <View style={styles.langModalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>Select Language</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSub }]}>
                  Choose your preferred language
                </Text>
              </View>
              {!userSubscribed && (
                <View style={styles.premiumHintBadge}>
                  <Icon name="diamond-outline" size={12} color={ORANGE} />
                  <Text style={styles.premiumHintText}>18 more with Pro</Text>
                </View>
              )}
            </View>

            <ScrollView style={styles.langScroll} showsVerticalScrollIndicator={false}>

              {/* FREE Section */}
              <View style={styles.langSectionHeader}>
                <Icon name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={[styles.langSectionTitle, { color: '#4CAF50' }]}>Free</Text>
              </View>

              {freeLangs.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <TouchableOpacity key={lang.code}
                    style={[styles.langOption, {
                      backgroundColor: isSelected ? ORANGE + '18' : theme.cardBg2,
                      borderColor: isSelected ? ORANGE : theme.border,
                    }]}
                    onPress={() => handleLanguageSelect(lang)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <View style={styles.langTextWrap}>
                      <Text style={[styles.langLabel, { color: theme.textMain }]}>{lang.label}</Text>
                      <Text style={[styles.langNative, { color: theme.textSub }]}>{lang.nativeName}</Text>
                    </View>
                    {isSelected
                      ? <Icon name="checkmark-circle" size={22} color={ORANGE} />
                      : <View style={[styles.langRadio, { borderColor: theme.border }]} />
                    }
                  </TouchableOpacity>
                );
              })}

              {/* PREMIUM Section */}
              <View style={styles.langSectionHeader}>
                <Icon name="diamond-outline" size={14} color={ORANGE} />
                <Text style={[styles.langSectionTitle, { color: ORANGE }]}>
                  Premium {!userSubscribed ? '🔒' : '✓'}
                </Text>
                {!userSubscribed && (
                  <TouchableOpacity
                    style={styles.unlockBtn}
                    onPress={() => {
                      setLanguageModalVisible(false);
                      setTimeout(() => setSubscriptionModalVisible(true), 400);
                    }}
                  >
                    <Text style={styles.unlockBtnText}>Unlock All</Text>
                  </TouchableOpacity>
                )}
              </View>

              {premiumLangs.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                const locked = !userSubscribed;
                return (
                  <TouchableOpacity key={lang.code}
                    style={[
                      styles.langOption,
                      {
                        backgroundColor: locked ? theme.cardBg2 + 'AA' : isSelected ? ORANGE + '18' : theme.cardBg2,
                        borderColor: locked ? theme.border : isSelected ? ORANGE : theme.border,
                        opacity: locked ? 0.65 : 1,
                      },
                    ]}
                    onPress={() => handleLanguageSelect(lang)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.langFlag, locked && styles.langFlagLocked]}>{lang.flag}</Text>
                    <View style={styles.langTextWrap}>
                      <Text style={[styles.langLabel, { color: locked ? theme.textSub : theme.textMain }]}>
                        {lang.label}
                      </Text>
                      <Text style={[styles.langNative, { color: theme.textSub }]}>{lang.nativeName}</Text>
                    </View>
                    {locked ? (
                      <View style={styles.langLockBadge}>
                        <Icon name="lock-closed" size={14} color={ORANGE} />
                      </View>
                    ) : isSelected ? (
                      <Icon name="checkmark-circle" size={22} color={ORANGE} />
                    ) : (
                      <View style={[styles.langRadio, { borderColor: theme.border }]} />
                    )}
                  </TouchableOpacity>
                );
              })}

              <View style={{ height: 8 }} />
            </ScrollView>

            {/* Upgrade Banner (only if not subscribed) */}
            {!userSubscribed && (
              <TouchableOpacity
                style={styles.upgradeBanner}
                onPress={() => {
                  setLanguageModalVisible(false);
                  setTimeout(() => setSubscriptionModalVisible(true), 400);
                }}
              >
                <Icon name="diamond-outline" size={18} color="#fff" />
                <Text style={styles.upgradeBannerText}>
                  Unlock 18 Languages with Premium 👑
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.border, marginTop: 10 }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={[styles.cancelBtnText, { color: theme.textSub }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Subscription Detail Modal ─── */}
      <Modal visible={subDetailModalVisible} transparent animationType="slide"
        onRequestClose={() => setSubDetailModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />

            <View style={styles.crownRow}>
              <View style={styles.crownCircle}>
                <Text style={styles.crownEmoji}>👑</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>
                  {getPlanLabel(subscriptionData?.plan)}
                </Text>
                <Text style={{ color: '#4CAF50', fontSize: 13, fontWeight: '600' }}>✓ Active Subscription</Text>
              </View>
            </View>

            <View style={[styles.subDetailCard, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
              {[
                { icon: 'calendar-outline', label: 'Activated On', value: formatDate(subscriptionData?.activatedAt), color: theme.textMain },
                { icon: 'time-outline',     label: 'Expires On',   value: formatDate(subscriptionData?.expiryDate),  color: theme.textMain },
                { icon: 'hourglass-outline',label: 'Days Left',    value: `${getDaysLeft(subscriptionData?.expiryDate)} days`, color: '#4CAF50' },
              ].map((row, i, arr) => (
                <View key={row.label}>
                  <View style={styles.subDetailRow}>
                    <Icon name={row.icon} size={18} color={ORANGE} />
                    <Text style={[styles.subDetailLabel, { color: theme.textSub }]}>{row.label}</Text>
                    <Text style={[styles.subDetailValue, { color: row.color }]}>{row.value}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={[styles.subDetailDivider, { backgroundColor: theme.border }]} />}
                </View>
              ))}
            </View>

            <View style={[styles.subFeaturesBox, { backgroundColor: theme.cardBg2, borderColor: theme.border }]}>
              <Text style={[styles.subFeaturesTitle, { color: theme.textMain }]}>What's included:</Text>
              {['Unlimited Essays', 'Long & Medium Stories', 'All 20 Languages', 'All Poem Types', 'Email & Paragraph Writer', 'No Ads'].map((f) => (
                <View key={f} style={styles.subFeatureRow}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={[styles.subFeatureText, { color: theme.textSub }]}>{f}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.cancelSubBtn, { borderColor: '#FF525244' }]} onPress={handleCancelSubscription}>
              <Text style={styles.cancelSubBtnText}>Cancel Subscription</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.closePrimaryBtn, { backgroundColor: ORANGE }]} onPress={() => setSubDetailModalVisible(false)}>
              <Text style={styles.closePrimaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── About Modal ─── */}
      <Modal visible={aboutModalVisible} transparent animationType="fade" onRequestClose={() => setAboutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            <View style={styles.aboutLogoWrap}>
              <Text style={styles.aboutEmoji}>🤖</Text>
            </View>
            <Text style={[styles.aboutAppName, { color: theme.textMain }]}>AI Writer</Text>
            <Text style={[styles.aboutVersion, { color: theme.textSub }]}>Version 1.0.0</Text>
            <Text style={[styles.aboutDesc, { color: theme.textSub }]}>
              AI Writer is your all-in-one writing assistant. Generate essays, stories, poems, emails, and paragraphs with the power of AI — beautifully, quickly, and effortlessly.
            </Text>
            <View style={[styles.aboutDivider, { backgroundColor: theme.border }]} />
            {[
              { label: 'Developer', value: 'Your Company Name' },
              { label: 'Email',     value: 'support@aiwriter.app' },
              { label: 'Website',   value: 'www.aiwriter.app' },
            ].map((row) => (
              <View key={row.label} style={styles.aboutInfoRow}>
                <Text style={[styles.aboutInfoLabel, { color: theme.textSub }]}>{row.label}</Text>
                <Text style={[styles.aboutInfoValue, { color: ORANGE }]}>{row.value}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.closePrimaryBtn, { backgroundColor: ORANGE, marginTop: 16 }]} onPress={() => setAboutModalVisible(false)}>
              <Text style={styles.closePrimaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Account Modal ─── */}
      <Modal visible={accountModalVisible} transparent animationType="slide" onRequestClose={() => setAccountModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAccountModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            <View style={styles.modalTitleRow}>
              <View style={[styles.modalIconCircle, { backgroundColor: '#1A1A2A' }]}>
                <Icon name="person-outline" size={22} color={ORANGE} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textMain }]}>Account</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSub }]}>What would you like to do?</Text>
              </View>
            </View>
            {ACCOUNT_OPTIONS.map((opt) => (
              <TouchableOpacity key={opt.id}
                style={[styles.accountOptionCard, { backgroundColor: opt.bg, borderColor: opt.danger ? '#FF525230' : opt.color + '30' }]}
                onPress={() => handleAccountOptionPress(opt.id)} activeOpacity={0.85}>
                <View style={[styles.accountOptionIcon, { backgroundColor: opt.color + '20', borderColor: opt.color + '40' }]}>
                  <Icon name={opt.icon} size={22} color={opt.color} />
                </View>
                <View style={styles.accountOptionText}>
                  <Text style={[styles.accountOptionLabel, { color: opt.danger ? '#FF5252' : '#F2F2F7' }]}>{opt.label}</Text>
                  <Text style={[styles.accountOptionSub, { color: theme.textSub }]}>{opt.sub}</Text>
                </View>
                <Icon name="chevron-forward" size={18} color={opt.color + '99'} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setAccountModalVisible(false)}>
              <Text style={[styles.cancelBtnText, { color: theme.textSub }]}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ─── Theme Modal ─── */}
      <Modal visible={themeModalVisible} transparent animationType="fade" onRequestClose={() => setThemeModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setThemeModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.modalTitle, { color: theme.textMain, marginBottom: 4 }]}>Choose Theme</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSub, marginBottom: 20 }]}>Select your preferred appearance</Text>
            {[
              { id: 'dark',  icon: 'moon',  bg: '#0D0D12', iconColor: '#A78BFA', title: 'Dark Mode',  sub: 'Easy on the eyes at night' },
              { id: 'light', icon: 'sunny', bg: '#FFF8E1', iconColor: '#F59E0B', title: 'Light Mode', sub: 'Clean and bright look' },
            ].map((t) => (
              <TouchableOpacity key={t.id}
                style={[styles.themeOption, {
                  borderColor: mode === t.id ? ORANGE : theme.border,
                  backgroundColor: theme.cardBg2,
                }, mode === t.id && styles.themeOptionActive]}
                onPress={() => { toggleTheme(t.id); setThemeModalVisible(false); }}>
                <View style={[styles.themeIconCircle, { backgroundColor: t.bg, borderColor: mode === t.id ? ORANGE : theme.border }]}>
                  <Icon name={t.icon} size={22} color={t.iconColor} />
                </View>
                <View style={styles.themeTextWrap}>
                  <Text style={[styles.themeOptionTitle, { color: theme.textMain }]}>{t.title}</Text>
                  <Text style={[styles.themeOptionSub, { color: theme.textSub }]}>{t.sub}</Text>
                </View>
                {mode === t.id && <View style={styles.checkCircle}><Icon name="checkmark" size={14} color="#fff" /></View>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setThemeModalVisible(false)}>
              <Text style={[styles.cancelBtnText, { color: theme.textSub }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 20, paddingBottom: 18,
    paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 20 },
  settingCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 11 },
  iconBox: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  itemLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, marginRight: 8, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '700', color: ORANGE },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 12, paddingBottom: 14 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 11, marginTop: 4 },
  tabLabelActive: { fontWeight: '700' },

  // Modal shared
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 30 },
  modalBox: { borderRadius: 28, borderWidth: 1, padding: 20 },
  modalHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalSubtitle: { fontSize: 13, marginTop: 2 },
  cancelBtn: { height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  cancelBtnText: { fontSize: 15, fontWeight: '600' },
  closePrimaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  closePrimaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Language Modal
  langModalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  premiumHintBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#261D00', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: ORANGE + '55' },
  premiumHintText: { color: ORANGE, fontSize: 11, fontWeight: '700' },
  langScroll: { maxHeight: 380 },
  langSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  langSectionTitle: { fontSize: 13, fontWeight: '800', flex: 1 },
  unlockBtn: { backgroundColor: ORANGE, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  unlockBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  langOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 8, gap: 12 },
  langFlag: { fontSize: 24 },
  langFlagLocked: { opacity: 0.5 },
  langTextWrap: { flex: 1 },
  langLabel: { fontSize: 15, fontWeight: '600' },
  langNative: { fontSize: 12, marginTop: 1 },
  langRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  langLockBadge: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#261D00', borderWidth: 1, borderColor: ORANGE + '44', alignItems: 'center', justifyContent: 'center' },
  upgradeBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: ORANGE, borderRadius: 16, padding: 14, marginTop: 12, justifyContent: 'center' },
  upgradeBannerText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  // Subscription Detail
  crownRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  crownCircle: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#261D00', borderWidth: 1.5, borderColor: ORANGE + '55', alignItems: 'center', justifyContent: 'center' },
  crownEmoji: { fontSize: 26 },
  subDetailCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  subDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  subDetailLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  subDetailValue: { fontSize: 13, fontWeight: '700' },
  subDetailDivider: { height: 1, marginVertical: 10 },
  subFeaturesBox: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14 },
  subFeaturesTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  subFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  subFeatureText: { fontSize: 13, fontWeight: '500' },
  cancelSubBtn: { height: 46, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cancelSubBtnText: { color: '#FF5252', fontSize: 14, fontWeight: '600' },

  // Account
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  modalIconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  accountOptionCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 10 },
  accountOptionIcon: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  accountOptionText: { flex: 1 },
  accountOptionLabel: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  accountOptionSub: { fontSize: 12 },

  // Theme
  themeOption: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 12 },
  themeOptionActive: { borderWidth: 2 },
  themeIconCircle: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  themeTextWrap: { flex: 1 },
  themeOptionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  themeOptionSub: { fontSize: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },

  // About
  aboutLogoWrap: { alignSelf: 'center', width: 70, height: 70, borderRadius: 20, backgroundColor: '#2A1A12', borderWidth: 1.5, borderColor: ORANGE + '55', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  aboutEmoji: { fontSize: 34 },
  aboutAppName: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  aboutVersion: { fontSize: 13, textAlign: 'center', marginBottom: 14 },
  aboutDesc: { fontSize: 13, lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  aboutDivider: { height: 1, marginBottom: 14 },
  aboutInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  aboutInfoLabel: { fontSize: 13, fontWeight: '500' },
  aboutInfoValue: { fontSize: 13, fontWeight: '700' },
});