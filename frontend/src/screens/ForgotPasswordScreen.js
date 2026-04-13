import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function ForgotPasswordScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.42],
  });

  function validate() {
    const nextErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required";
    } else if (!trimmedEmail.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSendLink() {
    if (!validate()) return;

    try {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Check your email",
          "If an account exists for this email, you will receive a reset link.",
          [{ text: "Back to Login", onPress: () => navigation.replace("Login") }]
        );
      }, 1200);
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topWrap}>
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

            <LinearGradient
              colors={
                mode === "dark"
                  ? ["rgba(99,102,241,0.18)", "rgba(59,130,246,0.06)"]
                  : ["rgba(79,70,229,0.10)", "rgba(59,130,246,0.04)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.logoWrap}>
                  <Icon name="lock-closed-outline" size={22} color={colors.primary} />
                </View>

                <View style={styles.badge}>
                  <Icon name="mail-outline" size={14} color={colors.primary} />
                  <Text style={styles.badgeText}>Password Recovery</Text>
                </View>
              </View>

              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter your email and we’ll help you reset your password.
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Reset Password</Text>
            <Text style={styles.formSubtitle}>
              We will send a reset link to your registered email
            </Text>

            <View style={styles.inputWrap}>
              <AppInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
            </View>

            <View style={styles.buttonWrap}>
              <AppButton title="Send Reset Link" onPress={onSendLink} loading={loading} />
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Remember your password?</Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.bottomLink}> Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors, mode) {
  const isDark = mode === "dark";

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl * 2,
      flexGrow: 1,
      justifyContent: "center",
    },

    topWrap: {
      position: "relative",
      marginBottom: spacing.lg,
    },
    glow: {
      position: "absolute",
      top: -10,
      left: 24,
      right: 24,
      height: 120,
      borderRadius: 30,
      backgroundColor: colors.primary,
    },
    heroCard: {
      borderRadius: 28,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(79,70,229,0.10)",
      overflow: "hidden",
    },
    heroTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    logoWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.88)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    },
    badgeText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "700",
    },
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 8,
    },
    subtitle: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
    },

    formCard: {
      backgroundColor: colors.card,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    formTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "800",
    },
    formSubtitle: {
      marginTop: 6,
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    inputWrap: {
      marginBottom: spacing.md,
    },
    buttonWrap: {
      marginBottom: spacing.lg,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    },
    bottomText: {
      color: colors.mutedText,
      fontSize: 14,
    },
    bottomLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "800",
    },
  });
}