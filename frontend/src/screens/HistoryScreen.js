import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, FlatList,
  StatusBar, SafeAreaView, Alert, TouchableOpacity, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../ThemeContext';

const ORANGE = '#FF6B35';
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

export default function HistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const raw = await AsyncStorage.getItem('ai_history');
        setHistoryData(raw ? JSON.parse(raw) : []);
      } catch (e) { console.log('Load history error:', e); }
      finally { setLoading(false); }
    };
    loadHistory();
  }, []));

  const deleteItem = (id) => {
    Alert.alert('Delete', 'Remove this item from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const updated = historyData.filter((h) => h.id !== id);
        setHistoryData(updated);
        await AsyncStorage.setItem('ai_history', JSON.stringify(updated));
      }},
    ]);
  };

  const clearAll = () => {
    Alert.alert('Clear All', 'Delete all history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: async () => {
        setHistoryData([]);
        await AsyncStorage.removeItem('ai_history');
      }},
    ]);
  };

  const filters = ['All', 'Essay Writer', 'Story Writer', 'Poem Writer', 'Email Writer', 'Paragraph Writer'];
  const filteredData = selectedTab === 'All' ? historyData : historyData.filter((item) => item.type === selectedTab);

  const renderFilter = ({ item }) => {
    const active = selectedTab === item;
    return (
      <Pressable onPress={() => setSelectedTab(item)}
        style={[styles.filterChip,
          { backgroundColor: active ? 'transparent' : theme.cardBg,
            borderColor: active ? theme.textMain : 'transparent' }]}>
        <Text style={[styles.filterText, { color: active ? theme.textMain : theme.textSub, fontWeight: active ? '600' : '500' }]}>
          {item}
        </Text>
      </Pressable>
    );
  };

  const renderHistoryCard = ({ item }) => (
    <Pressable style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <View style={styles.cardTopRow}>
        <View style={[styles.cardTypeBadge, { backgroundColor: theme.cardBg2 }]}>
          <Text style={styles.cardTypeBadgeText}>{item.type}</Text>
        </View>
        <Pressable style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
          <Icon name="trash-2" size={16} color="#FF5252" />
        </Pressable>
      </View>
      <Text style={[styles.cardTitle, { color: theme.textMain }]} numberOfLines={2}>{item.title}</Text>
      <Text style={[styles.cardPreview, { color: theme.textSub }]} numberOfLines={3}>{item.preview}</Text>
      <View style={styles.cardFooter}>
        <Icon name="calendar" size={12} color={theme.textSub} style={{ marginRight: 5 }} />
        <Text style={[styles.cardDate, { color: theme.textSub }]}>{item.date}</Text>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyEmoji}>🕘</Text>
      <Text style={[styles.emptyTitle, { color: theme.textMain }]}>No History Yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSub }]}>
        Generate essays, poems or stories{'\n'}and they'll appear here.
      </Text>
      <TouchableOpacity style={styles.goHomeBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.goHomeBtnText}>Start Writing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
      <View style={[styles.container, { backgroundColor: theme.bg }]}>

        <View style={styles.headerRow}>
          <Text style={[styles.heading, { color: theme.textMain }]}>History</Text>
          {historyData.length > 0 && (
            <Pressable style={styles.clearBtn} onPress={clearAll}>
              <Icon name="trash" size={14} color="#FF5252" />
              <Text style={styles.clearBtnText}>Clear All</Text>
            </Pressable>
          )}
        </View>

        {historyData.length > 0 && (
          <Text style={[styles.countText, { color: theme.textSub }]}>
            {filteredData.length} item{filteredData.length !== 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.filterListWrap}>
          <FlatList data={filters} horizontal keyExtractor={(item) => item}
            renderItem={renderFilter} showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent} />
        </View>

        <FlatList data={filteredData} keyExtractor={(item) => item.id}
          renderItem={renderHistoryCard} showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!loading ? renderEmpty : null} />

        <View style={styles.bottomNavWrap}>
          <View style={[styles.bottomNav, { backgroundColor: theme.bottomNav, borderColor: theme.border }]}>
            <Pressable style={[styles.navItem, { backgroundColor: theme.cardBg2 }]} onPress={() => navigation?.navigate('Home')}>
              <Icon name="home" size={22} color={theme.textSub} />
              <Text style={[styles.navText, { color: theme.textSub }]}>Home</Text>
            </Pressable>
            <Pressable style={[styles.navItem, styles.activeNavItem, { backgroundColor: theme.cardBg2 }]}>
              <Icon name="file-text" size={22} color={ORANGE} />
              <Text style={[styles.navText, { color: ORANGE, fontWeight: '600' }]}>History</Text>
            </Pressable>
            <Pressable style={[styles.navItem, { backgroundColor: theme.cardBg2 }]} onPress={() => navigation?.navigate('Settings')}>
              <Icon name="settings" size={22} color={theme.textSub} />
              <Text style={[styles.navText, { color: theme.textSub }]}>Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: STATUS_BAR_HEIGHT + 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  heading: { fontSize: 30, fontWeight: '700', letterSpacing: 0.2 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#1A0E0E', borderRadius: 12, borderWidth: 1, borderColor: '#FF525233' },
  clearBtnText: { color: '#FF5252', fontSize: 13, fontWeight: '600' },
  countText: { fontSize: 13, marginBottom: 14 },
  filterListWrap: { marginBottom: 18 },
  filterContent: { paddingRight: 8 },
  filterChip: { minHeight: 44, paddingHorizontal: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1 },
  filterText: { fontSize: 14 },
  listContent: { paddingBottom: 140 },
  card: { borderRadius: 20, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, marginBottom: 14, borderWidth: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardTypeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardTypeBadgeText: { fontSize: 11, color: ORANGE, fontWeight: '700', letterSpacing: 0.3 },
  deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2A1010', borderRadius: 8, borderWidth: 1, borderColor: '#FF525222' },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8, lineHeight: 22 },
  cardPreview: { fontSize: 13, lineHeight: 21, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  cardDate: { fontSize: 12, fontWeight: '500' },
  emptyWrap: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 30 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  goHomeBtn: { backgroundColor: ORANGE, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 16, elevation: 4 },
  goHomeBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  bottomNavWrap: { position: 'absolute', left: 20, right: 20, bottom: 18 },
  bottomNav: { flexDirection: 'row', borderRadius: 28, paddingVertical: 10, paddingHorizontal: 8, borderWidth: 1 },
  navItem: { flex: 1, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  activeNavItem: { borderWidth: 1, borderColor: 'rgba(249,115,22,0.35)' },
  navText: { marginTop: 6, fontSize: 12, fontWeight: '500' },
});