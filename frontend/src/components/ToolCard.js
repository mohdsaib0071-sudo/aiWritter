import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const toolConfig = {
  "Essay Writer": {
    emoji: "📝",
    accent: "#7c3aed",
    lightBg: "#f3e8ff",
    darkBg: "#2e1065",
    subtitle: "Write structured long-form content",
  },
  "Story Writer": {
    emoji: "📘",
    accent: "#6366f1",
    lightBg: "#e0e7ff",
    darkBg: "#312e81",
    subtitle: "Create engaging creative stories",
  },
  "Poem Writer": {
    emoji: "✍️",
    accent: "#8b5cf6",
    lightBg: "#f5e8ff",
    darkBg: "#581c87",
    subtitle: "Generate poetic and expressive lines",
  },
  "Email Writer": {
    emoji: "📧",
    accent: "#3b82f6",
    lightBg: "#dbeafe",
    darkBg: "#1e3a8a",
    subtitle: "Draft polished professional emails",
  },
  "Paragraph Writer": {
    emoji: "📄",
    accent: "#4f46e5",
    lightBg: "#e0e7ff",
    darkBg: "#312e81",
    subtitle: "Build concise and strong paragraphs",
  },
  Rewriter: {
    emoji: "♻️",
    accent: "#7c3aed",
    lightBg: "#ede9fe",
    darkBg: "#4c1d95",
    subtitle: "Rewrite text with better clarity",
  },
  "Ask Me Anything": {
    emoji: "🤖",
    accent: "#2563eb",
    lightBg: "#dbeafe",
    darkBg: "#1d4ed8",
    subtitle: "Chat with your AI assistant",
  },
};

export default function ToolCard({ title, onPress, darkMode }) {
  const config = toolConfig[title] || {
    emoji: "✨",
    accent: "#6366f1",
    lightBg: "#e0e7ff",
    darkBg: "#312e81",
    subtitle: "Open this writing tool",
  };

  const theme = darkMode
    ? {
        cardBg: "#0f172a",
        border: "rgba(96, 165, 250, 0.10)",
        title: "#f8fafc",
        subtitle: "#94a3b8",
        iconBg: config.darkBg,
        arrowBg: "rgba(255,255,255,0.05)",
      }
    : {
        cardBg: "#ffffff",
        border: "rgba(99, 102, 241, 0.10)",
        title: "#0f172a",
        subtitle: "#64748b",
        iconBg: config.lightBg,
        arrowBg: "#f8fafc",
      };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.wrapper}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.border,
            shadowColor: config.accent,
          },
        ]}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: theme.iconBg,
              borderColor: `${config.accent}30`,
            },
          ]}
        >
          <Text style={styles.emoji}>{config.emoji}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.title }]}
          >
            {title}
          </Text>

          <Text
            numberOfLines={2}
            style={[styles.subtitle, { color: theme.subtitle }]}
          >
            {config.subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.arrowBox,
            {
              backgroundColor: theme.arrowBg,
            },
          ]}
        >
          <Text style={[styles.arrow, { color: config.accent }]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  card: {
    width: "100%",
    minHeight: 86,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  emoji: {
    fontSize: 24,
  },

  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },

  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: -2,
  },
});