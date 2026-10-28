import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { ThemeProvider, useTheme } from '@/ui';

function RootStack() {
  const { scheme, colors } = useTheme();
  // Navigation containers (tab bar, scene backgrounds) read their own theme: derive it from our tokens.
  const navTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.bg,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    };
  }, [scheme, colors]);

  return (
    <NavigationThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  // Web static export: React Native Web does not apply the first style update to elements that came
  // from the prerendered HTML (verified in E-01: the theme switch left hydrated screens stale).
  // Remount once after hydration so every element is client-rendered. Native has no prerender.
  const [hydrated, setHydrated] = useState(Platform.OS !== 'web');
  useEffect(() => setHydrated(true), []);

  return (
    <ThemeProvider key={hydrated ? 'client' : 'prerender'}>
      <RootStack />
    </ThemeProvider>
  );
}
