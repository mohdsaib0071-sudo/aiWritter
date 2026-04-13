// src/services/aiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://10.0.2.2:4000/api/ai/generate"; // Physical device hai to IP change karein

export async function generateAIPoem(prompt) {
  try {
    const token = await AsyncStorage.getItem('user_token');

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}