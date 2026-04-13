import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(loaderAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('TOKEN');
        if (token) {
          navigation.replace("Home");   // token hai → Home
        } else {
          navigation.replace("Login");  // token nahi → Login
        }
      } catch (e) {
        navigation.replace("Login");    // koi error → Login
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const loaderWidth = loaderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const pills = [
    { label: "Email",  bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" },
    { label: "Essay",  bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc" },
    { label: "Poem",   bg: "#fdf4ff", color: "#a21caf", border: "#e879f9" },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Icon Box */}
        <View style={styles.iconWrap}>
          <Text style={styles.iconEmoji}>✍️</Text>
        </View>

        {/* Pills */}
        <View style={styles.pillRow}>
          {pills.map((p, i) => (
            <View key={i} style={[styles.pill, { backgroundColor: p.bg, borderColor: p.border }]}>
              <Text style={[styles.pillText, { color: p.color }]}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.title}>AI Writer</Text>
        <Text style={styles.subtitle}>Write smarter with AI</Text>

        {/* Loader */}
        <View style={styles.loaderBar}>
          <Animated.View style={[styles.loaderFill, { width: loaderWidth }]} />
        </View>
        <Text style={styles.tagline}>Loading your workspace…</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5ff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.15)",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  iconEmoji: { fontSize: 34 },
  pillRow: { flexDirection: "row", gap: 8, marginBottom: 22 },
  pill: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 44,
    fontWeight: "800",
    color: "#1e1b4b",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#6b7280",
    marginBottom: 46,
  },
  loaderBar: {
    width: 180,
    height: 3,
    backgroundColor: "#e5e7eb",
    borderRadius: 100,
    overflow: "hidden",
  },
  loaderFill: {
    height: "100%",
    backgroundColor: "#7c3aed",
    borderRadius: 100,
  },
  tagline: {
    marginTop: 12,
    fontSize: 11,
    color: "#9ca3af",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});