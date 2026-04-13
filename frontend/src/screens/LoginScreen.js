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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { loginApi } from "../config/api";

const DARK_BG = "#0D0D12";
const CARD_BG = "#18181F";
const BORDER = "#232330";
const TEXT_MAIN = "#F2F2F7";
const TEXT_SUB = "#7B7B8E";
const ORANGE = "#FF6B35";

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validate() {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const e = email.trim();
    const p = password.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!e) {
      setEmailError("Please enter your email");
      valid = false;
    } else if (!re.test(e)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }

    if (!p) {
      setPasswordError("Please enter your password");
      valid = false;
    } else if (p.length < 6) {
      setPasswordError("Minimum 6 characters");
      valid = false;
    }

    return valid;
  }

  async function handleLogin() {
    if (loading || !validate()) return;

    try {
      setLoading(true);
      setPasswordError("");

      const data = await loginApi({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!data || !data.token || !data.user) {
        throw new Error(data?.message || "Invalid login response");
      }

      await AsyncStorage.setItem("TOKEN", data.token);
      await AsyncStorage.setItem("USER", JSON.stringify(data.user));

      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e) {
      setPasswordError(e?.message || "Login failed. Check internet or server.");
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
          <View style={s.content}>
            {/* Top branding area */}
            <View style={s.topSection}>
              <View style={s.appIconWrap}>
                <Text style={s.appIconEmoji}>🤖</Text>
              </View>

              <Text style={s.brandName}>AI Writer</Text>

              <View style={s.pillRow}>
                {["Essay", "Poem", "Email", "Story"].map((p) => (
                  <View key={p} style={s.pill}>
                    <Text style={s.pillText}>{p}</Text>
                  </View>
                ))}
              </View>

              <Text style={s.heading}>Welcome back</Text>
              <Text style={s.subheading}>
                Sign in to continue creating premium AI content.
              </Text>
            </View>

            {/* Login Card */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Login</Text>
              <Text style={s.cardSub}>
                Enter your details to access your account
              </Text>

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
              {passwordError ? (
                <Text style={s.errorText}>{passwordError}</Text>
              ) : null}

              <TouchableOpacity
                style={s.forgotWrap}
                onPress={() => navigation.navigate("ForgotPassword")}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={s.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.loginBtn, loading && s.loginBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={s.loginBtnText}>
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              <View style={s.dividerRow}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>or</Text>
                <View style={s.dividerLine} />
              </View>

              <TouchableOpacity
                style={s.secondaryBtn}
                onPress={() => navigation.navigate("Signup")}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Icon name="person-add-outline" size={18} color={TEXT_MAIN} />
                <Text style={s.secondaryBtnText}>Create New Account</Text>
              </TouchableOpacity>

              <View style={s.bottomRow}>
                <Text style={s.bottomLabel}>New here? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup")}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={s.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={s.footer}>SECURE · ENCRYPTED · AI WRITER</Text>
          </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT + 16,
    paddingBottom: 24,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
  },

  topSection: {
    alignItems: "center",
    marginBottom: 22,
    paddingTop: 8,
  },

  appIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#2A1A12",
    borderWidth: 2,
    borderColor: ORANGE + "66",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  appIconEmoji: {
    fontSize: 34,
  },

  brandName: {
    fontSize: 13,
    fontWeight: "800",
    color: ORANGE,
    letterSpacing: 3,
    marginBottom: 14,
  },

  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: ORANGE + "15",
    borderWidth: 1,
    borderColor: ORANGE + "40",
  },

  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: ORANGE,
    letterSpacing: 0.8,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: TEXT_MAIN,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subheading: {
    marginTop: 8,
    fontSize: 14,
    color: TEXT_SUB,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_MAIN,
    textAlign: "center",
    letterSpacing: -0.2,
  },

  cardSub: {
    fontSize: 13,
    color: TEXT_SUB,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 22,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_SUB,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },

  inputWrap: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#13131A",
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 10,
  },

  inputError: {
    borderColor: "#FF5252",
  },

  inputIcon: {
    marginRight: 0,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    paddingVertical: 0,
  },

  eyeBtn: {
    padding: 4,
  },

  errorText: {
    fontSize: 12,
    color: "#FF5252",
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 2,
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -4,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: ORANGE,
  },

  loginBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },

  loginBtnDisabled: {
    opacity: 0.6,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SUB,
  },

  secondaryBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: "#13131A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  secondaryBtnText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  bottomLabel: {
    color: TEXT_SUB,
    fontSize: 14,
  },

  signupLink: {
    color: ORANGE,
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: TEXT_SUB + "66",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
});