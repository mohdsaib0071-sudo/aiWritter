import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  Platform, ActivityIndicator, Alert,
} from 'react-native';
import { activateSubscription } from '../utils/subscriptionService';

const ORANGE = '#FF6B35';

const PLANS = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '₹99',
    duration: '/ week',
    desc: '7 days full access',
    badge: null,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹299',
    duration: '/ month',
    desc: 'Most Popular',
    badge: '🔥 Popular',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '₹1,999',
    duration: '/ year',
    desc: 'Save 44%',
    badge: '💰 Best Value',
  },
];

const FEATURES = [
  '✍️  Unlimited Essay Writing',
  '📖  Long & Medium Length Content',
  '🎭  All Story Genres & Styles',
  '📧  Email & Paragraph Writer',
  '🎵  All Poem Types',
  '🧠  Academic References',
  '✨  Humanize AI Feature',
  '🚫  No Ads',
];

export default function SubscriptionModal({ visible, onClose, onSubscribed, featureName }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // ───────────────────────────────────────────────────────────
      // TODO: Yahan apna actual payment gateway lagao
      // e.g. RevenueCat, Razorpay, Stripe, etc.
      //
      // RevenueCat example:
      // import Purchases from 'react-native-purchases';
      // const offerings = await Purchases.getOfferings();
      // const pkg = offerings.current.availablePackages.find(p => p.identifier === selectedPlan);
      // await Purchases.purchasePackage(pkg);
      //
      // Razorpay example:
      // RazorpayCheckout.open(options).then(async (data) => {
      //   await activateSubscription(selectedPlan);
      //   onSubscribed?.();
      // });
      // ───────────────────────────────────────────────────────────

      // DEMO: Abhi ke liye directly activate karta hai (real payment ke baad hatao)
      await activateSubscription(selectedPlan);
      setLoading(false);

      Alert.alert(
        '🎉 Subscription Activated!',
        `${PLANS.find(p => p.id === selectedPlan)?.label} plan successfully activated!`,
        [{ text: 'Start Using', onPress: () => { onSubscribed?.(); onClose?.(); } }]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Payment Failed', error?.message || 'Kuch galat ho gaya. Dobara try karo.');
    }
  };

  const handleRestore = () => {
    Alert.alert('Restore Purchase', 'Koi existing purchase nahi mili. Support se contact karo.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Crown */}
          <View style={styles.crownWrap}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>

          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>
            {featureName
              ? `"${featureName}" is a Premium feature`
              : 'Get full access to all features'}
          </Text>

          {/* Features List */}
          <View style={styles.featuresBox}>
            {FEATURES.map((f, i) => (
              <Text key={i} style={styles.featureItem}>{f}</Text>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansRow}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.85}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardActive,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <Text style={[styles.planLabel, selectedPlan === plan.id && styles.planLabelActive]}>
                  {plan.label}
                </Text>
                <Text style={[styles.planPrice, selectedPlan === plan.id && styles.planPriceActive]}>
                  {plan.price}
                </Text>
                <Text style={[styles.planDuration, selectedPlan === plan.id && styles.planDurationActive]}>
                  {plan.duration}
                </Text>
                {selectedPlan === plan.id && (
                  <View style={styles.planCheck}>
                    <Text style={styles.planCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeBtn, loading && { opacity: 0.8 }]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeBtnText}>
                Subscribe — {PLANS.find(p => p.id === selectedPlan)?.price}
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore */}
          <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
            <Text style={styles.restoreBtnText}>Restore Purchase</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Auto-renews. Cancel anytime. By subscribing you agree to our Terms & Privacy Policy.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#12121A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#2A2A38',
  },
  handle: {
    alignSelf: 'center',
    width: 42, height: 4, borderRadius: 2,
    backgroundColor: '#333344', marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute', top: 20, right: 20,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#2A2A38',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#F2F2F7', fontSize: 13, fontWeight: '700' },

  crownWrap: {
    alignSelf: 'center',
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: '#261D00',
    borderWidth: 1.5, borderColor: ORANGE + '55',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  crownEmoji: { fontSize: 30 },

  title: {
    fontSize: 24, fontWeight: '800', color: '#F2F2F7',
    textAlign: 'center', marginBottom: 6,
  },
  subtitle: {
    fontSize: 13, color: '#7B7B8E',
    textAlign: 'center', marginBottom: 16,
  },

  featuresBox: {
    backgroundColor: '#1A1A26',
    borderRadius: 16, borderWidth: 1, borderColor: '#2A2A38',
    paddingHorizontal: 16, paddingVertical: 12,
    marginBottom: 18,
  },
  featureItem: {
    color: '#D1D5DB', fontSize: 13,
    lineHeight: 26, fontWeight: '500',
  },

  plansRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#1A1A26',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2A2A38',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
    minHeight: 110,
    justifyContent: 'center',
  },
  planCardActive: {
    borderColor: ORANGE,
    backgroundColor: '#1F1208',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: ORANGE,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  planBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  planLabel: { color: '#7B7B8E', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  planLabelActive: { color: ORANGE },
  planPrice: { color: '#F2F2F7', fontSize: 18, fontWeight: '800' },
  planPriceActive: { color: ORANGE },
  planDuration: { color: '#7B7B8E', fontSize: 10, marginTop: 2 },
  planDurationActive: { color: ORANGE + 'AA' },
  planCheck: {
    position: 'absolute', bottom: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
  },
  planCheckText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  subscribeBtn: {
    height: 56, borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  subscribeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  restoreBtn: { alignItems: 'center', paddingVertical: 8 },
  restoreBtnText: { color: '#7B7B8E', fontSize: 13, fontWeight: '600' },

  disclaimer: {
    color: '#4A4A5A', fontSize: 10,
    textAlign: 'center', lineHeight: 16, marginTop: 4,
  },
});