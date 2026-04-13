import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../src/screens/SplashScreen";
import LoginScreen from "../src/screens/LoginScreen";
import SignupScreen from "../src/screens/SignupScreen";
import EssayWriterScreen from "../src/screens/EssayWriterScreen";
import HomeScreen from "../src/screens/HomeScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import StoryWriterScreen from "../src/screens/StoryWriterScreen";
import PoemWriterScreen from "../src/screens/PoemWriterScreen";
import ParagraphWriterScreen from "../src/screens/ParagraphWriterScreen";
import EmailWriterScreen from "../src/screens/EmailWriterScreen";
import HistoryScreen from "../src/screens/HistoryScreen";
import LanguageScreen from '../src/screens/LanguageScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ userToken }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {/* Splash hamesha pehle */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Login/Signup hamesha available */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Logged in screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EssayWriter" component={EssayWriterScreen} />
        <Stack.Screen name="StoryWriter" component={StoryWriterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PoemWriter" component={PoemWriterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailWriter" component={EmailWriterScreen} />
        <Stack.Screen name="ParagraphWriter" component={ParagraphWriterScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="language" component={LanguageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}