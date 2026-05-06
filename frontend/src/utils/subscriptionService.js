import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_KEY = 'user_subscription';

// Check karo kya user subscribed hai
export const isSubscribed = async () => {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    if (!data) return false;
    const { active, expiryDate } = JSON.parse(data);
    if (!active) return false;
    // Expiry check
    if (expiryDate && new Date(expiryDate) < new Date()) {
      await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Subscription save karo (payment success ke baad call karo)
export const activateSubscription = async (plan = 'monthly') => {
  try {
    const now = new Date();
    const expiry = new Date(now);
    if (plan === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
    if (plan === 'yearly')  expiry.setFullYear(expiry.getFullYear() + 1);
    if (plan === 'weekly')  expiry.setDate(expiry.getDate() + 7);

    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({
      active: true,
      plan,
      activatedAt: now.toISOString(),
      expiryDate: expiry.toISOString(),
    }));
    return true;
  } catch {
    return false;
  }
};

// Subscription cancel / remove
export const cancelSubscription = async () => {
  await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
};

// Subscription details lao
export const getSubscriptionDetails = async () => {
  try {
    const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};