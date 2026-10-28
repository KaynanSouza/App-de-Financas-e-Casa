import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Icon, maxContentWidth, minTarget, typography, useTheme, type IconName } from '@/ui';

// Five bottom tabs, icon + label always (D-018). Short labels so they survive 200% font size.
const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Início', icon: 'home' },
  { name: 'spending', title: 'Gastos', icon: 'spending' },
  { name: 'bills', title: 'Contas', icon: 'bills' },
  { name: 'shopping', title: 'Compras', icon: 'shopping' },
  { name: 'more', title: 'Mais', icon: 'more' },
];

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        // Label always under the icon, also on wide web screens (D-018).
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          width: '100%',
          maxWidth: maxContentWidth,
          alignSelf: 'center',
        },
        tabBarItemStyle: { minHeight: minTarget },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => (
              // Selected tab = color + indicator bar + bold label (not color alone).
              <View style={styles.iconWrap}>
                <View style={[styles.indicator, { backgroundColor: focused ? color : 'transparent' }]} />
                <Icon name={t.icon} color={color} />
              </View>
            ),
            tabBarLabel: ({ color, focused }) => (
              <Text style={[styles.label, { color, fontWeight: focused ? '700' : '400' }]}>{t.title}</Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 2 },
  indicator: { width: 24, height: 3, borderRadius: 2 },
  label: { fontSize: typography.caption.fontSize, lineHeight: typography.caption.lineHeight, textAlign: 'center' },
});
