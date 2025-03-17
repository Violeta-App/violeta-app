import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export const theme = {
  colors: {
    primaryPurple: "#a97adb",
    darkPurple: "#553D6E",
    lightPurple: "#CFB7EA",
    softPurple: "#E2D6F2",
    white: "#F4F4F9",
    lightGray: "#B8DBD9",
    beige: "#CFD2B2",
    darkGray: "#545454",
    darkerGray: "#2A2A2A",
    black: "#000000",
    green: "#04724D",
    orange: "#CF5C36",
  },
  fonts: {
    spaceMono: "SpaceMono-Regular",
    ibmPlexSans: "IBMPlexSans-Regular",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    IBMPlexSans: require('../assets/fonts/IBMPlexSans-VariableFont_wdth,wght.ttf'),
  });

  useEffect(() => { 
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
