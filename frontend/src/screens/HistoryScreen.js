import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function HistoryScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("All");

  const historyData = [
    {
      id: "1",
      type: "Essay Writer",
      title: "The power of gratitude",
      preview:
        "The Power of Gratitude  Gratitude is a simple yet powerful feeling that can bring positive changes to our lives. It is the art of appreciating what we have...",
      date: "7 Apr 2026",
    },
    {
      id: "2",
      type: "Essay Writer",
      title: "hiii",
      preview:
        "Hiii: A Simple Greeting  In our daily lives, communication plays a vital role in connecting us with others. One of the most common greetings is hiii...",
      date: "7 Apr 2026",
    },
    {
      id: "3",
      type: "Story Writer",
      title: "Running a successful business requires a combination...",
      preview:
        "Keys to Running a Successful Business  Operating a thriving business hinges on a mix of hard work, dedication, and effective decision making...",
      date: "6 Apr 2026",
    },
    {
      id: "4",
      type: "Poem Writer",
      title: "hii",
      preview:
        "Not Found  It appears that you have searched for information on 'hii,' but unfortunately, the content you are looking for is not available right now...",
      date: "25 Mar 2026",
    },
  ];

  const filters = ["All", "Essay Writer", "Story Writer", "Poem Writer"];

  const filteredData =
    selectedTab === "All"
      ? historyData
      : historyData.filter((item) => item.type === selectedTab);

  const renderFilter = ({ item }) => {
    const active = selectedTab === item;

    return (
      <Pressable
        onPress={() => setSelectedTab(item)}
        style={[styles.filterChip, active && styles.activeFilterChip]}
      >
        <Text style={[styles.filterText, active && styles.activeFilterText]}>
          {item}
        </Text>
      </Pressable>
    );
  };

  const renderHistoryCard = ({ item }) => {
    return (
      <Pressable style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            Title: {item.title}
          </Text>

          <Pressable style={styles.menuBtn}>
            <Icon name="more-vertical" size={20} color="#E5E7EB" />
          </Pressable>
        </View>

        <Text style={styles.cardPreview} numberOfLines={3}>
          {item.preview}
        </Text>

        <Text style={styles.cardMeta}>
          {item.type} <Text style={styles.separator}>|</Text> {item.date}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B16" />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>History</Text>

          <Pressable style={styles.filterButton}>
            <Icon name="sliders" size={20} color="#F3F4F6" />
          </Pressable>
        </View>

        <View style={styles.filterListWrap}>
          <FlatList
            data={filters}
            horizontal
            keyExtractor={(item) => item}
            renderItem={renderFilter}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.bottomNavWrap}>
          <View style={styles.bottomNav}>
            <Pressable
              style={styles.navItem}
              onPress={() => navigation?.navigate("Home")}
            >
              <Icon name="home" size={22} color="#D1D5DB" />
              <Text style={styles.navText}>Home</Text>
            </Pressable>

            <Pressable style={[styles.navItem, styles.activeNavItem]}>
              <Icon name="file-text" size={22} color="#F97316" />
              <Text style={[styles.navText, styles.activeNavText]}>History</Text>
            </Pressable>

            <Pressable
              style={styles.navItem}
              onPress={() => navigation?.navigate("ContactUs")}
            >
              <Icon name="message-square" size={22} color="#D1D5DB" />
              <Text style={styles.navText}>Contact Us</Text>
            </Pressable>

            <Pressable
              style={styles.navItem}
              onPress={() => navigation?.navigate("Settings")}
            >
              <Icon name="settings" size={22} color="#D1D5DB" />
              <Text style={styles.navText}>Settings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0B16",
  },

  container: {
    flex: 1,
    backgroundColor: "#0B0B16",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  heading: {
    fontSize: 30,
    fontWeight: "600",
    color: "#F9FAFB",
    letterSpacing: 0.2,
  },

  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1B1B2C",
    alignItems: "center",
    justifyContent: "center",
  },

  filterListWrap: {
    marginBottom: 18,
  },

  filterContent: {
    paddingRight: 8,
  },

  filterChip: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: "#1A1A29",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },

  activeFilterChip: {
    backgroundColor: "transparent",
    borderColor: "#E5E7EB",
  },

  filterText: {
    fontSize: 16,
    color: "#D1D5DB",
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  listContent: {
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#232332",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#F3F4F6",
    fontWeight: "500",
    paddingRight: 12,
  },

  menuBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  cardPreview: {
    fontSize: 14,
    lineHeight: 24,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 18,
  },

  cardMeta: {
    fontSize: 15,
    color: "#F3F4F6",
    fontWeight: "500",
  },

  separator: {
    color: "rgba(255,255,255,0.55)",
  },

  bottomNavWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
  },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#161625",
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  navItem: {
    flex: 1,
    height: 86,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202033",
    marginHorizontal: 4,
  },

  activeNavItem: {
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.35)",
  },

  navText: {
    marginTop: 8,
    fontSize: 14,
    color: "#E5E7EB",
    fontWeight: "500",
  },

  activeNavText: {
    color: "#F97316",
    fontWeight: "600",
  },
});