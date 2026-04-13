import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function AppButton({ title, onPress, loading }) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});