import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { radius, space, useTheme } from '../theme';

type Props = ViewProps & { children: ReactNode };

export function Card({ children, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      // Decorative outline: cards are not controls, so the 3:1 rule does not apply.
      style={[styles.card, { backgroundColor: colors.surface, borderColor: `${colors.border}55` }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, borderWidth: 1, padding: space.lg, gap: space.sm },
});
