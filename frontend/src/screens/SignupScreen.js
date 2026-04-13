import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { registerApi } from "../config/api";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const BORDER = "#232330";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#7B7B8E";
const ORANGE = "#FF6B35";

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  function validate() {
    let valid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      setNameError("Please enter your full name");
      valid = false;
    }

    if (!trimmedEmail) {
      setEmailError("Please enter your email");
      valid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      valid = false;
    } else if (password.trim().length < 6) {
      setPasswordError("Minimum 6 characters");
      valid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }

    return valid;
  }

  async function handleSignup() {
    if (loading || !validate()) return;

    try {
      setLoading(true);

      await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      Alert.alert("Success", "Account created successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (e) {
      Alert.alert("Failed", e?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={s.topSection}>
            <View style={s.appIconWrap}>
              <Text style={s.appIconEmoji}>🤖</Text>
            </View>

            <Text style={s.brandName}>AI Writer</Text>

            <View style={s.pillRow}>
              {["Essay", "Poem", "Email"].map((p) => (
                <View key={p} style={s.pill}>
                  <Text style={s.pillText}>{p}</Text>
                </View>
              ))}
            </View>

            <Text style={s.heading}>Create account</Text>
            <Text style={s.subheading}>
              Join AI Writer and start creating premium AI content.
            </Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>Sign Up</Text>
            <Text style={s.cardSub}>Create your account to continue</Text>

            <Text style={s.fieldLabel}>Full Name</Text>
            <View style={[s.inputWrap, nameError && s.inputError]}>
              <Icon
                name="person-outline"
                size={18}
                color={TEXT_SUB}
                style={s.inputIcon}
              />
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setNameError("");
                }}
                placeholder="Enter your full name"
                placeholderTextColor={TEXT_SUB}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!loading}
                style={s.input}
                selectionColor={ORANGE}
                cursorColor={ORANGE}
              />
            </View>
            {nameError ? <Text style={s.errorText}>{nameError}</Text> : null}

            <Text style={s.fieldLabel}>Email</Text>
            <View style={[s.inputWrap, emailError && s.inputError]}>
              <Icon
                name="mail-outline"
                size={18}
                color={TEXT_SUB}
                style={s.inputIcon}
              />
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setEmailError("");
                }}
                placeholder="you@example.com"
                placeholderTextColor={TEXT_SUB}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={s.input}
                selectionColor={ORANGE}
                cursorColor={ORANGE}
              />
            </View>
            {emailError ? <Text style={s.errorText}>{emailError}</Text> : null}

            <Text style={s.fieldLabel}>Password</Text>
            <View style={[s.inputWrap, passwordError && s.inputError]}>
              <Icon
                name="lock-closed-outline"
                size={18}
                color={TEXT_SUB}
                style={s.inputIcon}
              />
              <TextInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setPasswordError("");
                }}
                placeholder="••••••••"
                placeholderTextColor={TEXT_SUB}
                secureTextEntry={securePassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={s.input}
                selectionColor={ORANGE}
                cursorColor={ORANGE}
              />
              <TouchableOpacity
                onPress={() => setSecurePassword(!securePassword)}
                disabled={loading}
                style={s.eyeBtn}
                activeOpacity={0.8}
              >
                <Icon
                  name={securePassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={TEXT_SUB}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={s.errorText}>{passwordError}</Text> : null}

            <Text style={s.fieldLabel}>Confirm Password</Text>
            <View style={[s.inputWrap, confirmPasswordError && s.inputError]}>
              <Icon
                name="shield-checkmark-outline"
                size={18}
                color={TEXT_SUB}
                style={s.inputIcon}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  setConfirmPasswordError("");
                }}
                placeholder="••••••••"
                placeholderTextColor={TEXT_SUB}
                secureTextEntry={secureConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={s.input}
                selectionColor={ORANGE}
                cursorColor={ORANGE}
              />
              <TouchableOpacity
                onPress={() =>
                  setSecureConfirmPassword(!secureConfirmPassword)
                }
                disabled={loading}
                style={s.eyeBtn}
                activeOpacity={0.8}
              >
                <Icon
                  name={
                    secureConfirmPassword ? "eye-off-outline" : "eye-outline"
                  }
                  size={18}
                  color={TEXT_SUB}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={s.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <TouchableOpacity
              style={[s.signupBtn, loading && s.signupBtnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={s.signupBtnText}>
                {loading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={s.bottomRow}>
              <Text style={s.bottomLabel}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={s.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.footer}>SECURE · ENCRYPTED · AI WRITER</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },

  root: {
    flex: 1,
    backgroundColor: DARK_BG,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingBottom: 24,
  },

  topSection: {
    alignItems: "center",
    marginBottom: 14,
  },

  appIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#2A1A12",
    borderWidth: 1.5,
    borderColor: ORANGE + "66",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },

  appIconEmoji: {
    fontSize: 32,
  },

  brandName: {
    fontSize: 12,
    fontWeight: "800",
    color: ORANGE,
    letterSpacing: 2.8,
    marginBottom: 12,
  },

  pillRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: ORANGE + "14",
    borderWidth: 1,
    borderColor: ORANGE + "38",
  },

  pillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: ORANGE,
    letterSpacing: 0.7,
  },

  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_MAIN,
    textAlign: "center",
    letterSpacing: -0.5,
  },

  subheading: {
    marginTop: 7,
    fontSize: 13.5,
    color: TEXT_SUB,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 18,
  },

  card: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    backgroundColor: CARD_BG,
    borderRadius: 22,
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: TEXT_MAIN,
    textAlign: "center",
    letterSpacing: -0.2,
  },

  cardSub: {
    fontSize: 12.5,
    color: TEXT_SUB,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_SUB,
    marginBottom: 6,
    marginLeft: 2,
  },

  inputWrap: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#13131A",
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  inputError: {
    borderColor: "#FF5252",
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    paddingVertical: 0,
  },

  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
  },

  errorText: {
    fontSize: 11.5,
    color: "#FF5252",
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 2,
  },

  signupBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 9,
  },

  signupBtnDisabled: {
    opacity: 0.6,
  },

  signupBtnText: {
    color: "#fff",
    fontSize: 15.5,
    fontWeight: "800",
    letterSpacing: 0.25,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  bottomLabel: {
    color: TEXT_SUB,
    fontSize: 13.5,
  },

  loginLink: {
    color: ORANGE,
    fontSize: 13.5,
    fontWeight: "800",
  },

  footer: {
    marginTop: 18,
    marginBottom: 4,
    textAlign: "center",
    color: TEXT_SUB + "66",
    fontSize: 9.5,
    fontWeight: "600",
    letterSpacing: 1.8,
  },
});