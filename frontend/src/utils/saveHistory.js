import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToHistory = async (type, title, preview) => {
  try {
    const existing = await AsyncStorage.getItem('ai_history');
    const list = existing ? JSON.parse(existing) : [];

    const newItem = {
      id: Date.now().toString(),
      type,
      title: title?.slice(0, 80) || 'Untitled',
      preview: preview?.slice(0, 300) || '',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
    };

    const updated = [newItem, ...list].slice(0, 100);
    await AsyncStorage.setItem('ai_history', JSON.stringify(updated));
  } catch (e) {
    console.log('History save error:', e);
  }
};