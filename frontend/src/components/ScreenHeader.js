import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";

export default function ScreenHeader({
  title = "",
  showBack = true,
  onBack,
  rightIcon,
  onRightPress,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.bg,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* LEFT */}
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={onBack} style={styles.iconBtn}>
            <Icon name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        )}
      </View>

      {/* CENTER */}
      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      </View>

      {/* RIGHT
      <View style={styles.right}>
        {rightIcon && (
          <Pressable onPress={onRightPress} style={styles.iconBtn}>
            <Icon name={rightIcon} size={20} color={colors.text} />
          </Pressable>
        )}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },

  left: {
    width: 40,
    justifyContent: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  right: {
    width: 40,
    alignItems: "flex-end",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
});