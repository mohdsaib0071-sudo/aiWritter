import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#8B8B9A";
const ORANGE = "#FF6B35";
const BORDER = "#2A2A35";

const DATA = [
  {
    id: "1",
    title: "AI Writer",
    desc: "Generate essays, stories, poems instantly with AI.",
    emoji: "🤖",
  },
  {
    id: "2",
    title: "Multiple Tools",
    desc: "Email, Paragraph, Thesis and more in one place.",
    emoji: "✨",
  },
  {
    id: "3",
    title: "Fast & Smart",
    desc: "Get high-quality content in seconds.",
    emoji: "⚡",
  },
];

export default function OnboardingScreen({ navigation }) {
  const flatRef = useRef();
  const [index, setIndex] = useState(0);

  const finish = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    navigation.replace("Login");
  };

  const next = () => {
    if (index < DATA.length - 1) {
      flatRef.current.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <FlatList
        ref={flatRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.card}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        <View style={styles.dots}>
          {DATA.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                index === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={next}>
          <Text style={styles.btnText}>
            {index === DATA.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={finish}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },

  page: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },

  emoji: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginBottom: 10,
  },

  desc: {
    fontSize: 14,
    color: TEXT_SUB,
    textAlign: "center",
    lineHeight: 22,
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: ORANGE,
    width: 18,
  },

  btn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  skip: {
    textAlign: "center",
    marginTop: 12,
    color: TEXT_SUB,
    fontSize: 13,
  },
});