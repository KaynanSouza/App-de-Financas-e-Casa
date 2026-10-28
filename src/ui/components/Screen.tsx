import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { maxContentWidth, space, useTheme } from '../theme';
import { AppText } from './AppText';

type Props = { title: string; children: ReactNode };

/** Tab screen: safe area, title as heading, single centered column on large screens (D-020). */
export function Screen({ title, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[styles.outer, { paddingTop: insets.top + space.lg }]}
    >
      <View style={styles.column}>
        <AppText variant="headline" role="heading">
          {title}
        </AppText>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: { flexGrow: 1, alignItems: 'center', paddingHorizontal: space.lg, paddingBottom: space.xl },
  column: { width: '100%', maxWidth: maxContentWidth, gap: space.lg },
});
