import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { minTarget, radius, space, useTheme } from '../theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** Only when the result of the action is not obvious from the label. */
  hint?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, hint }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const filled = variant !== 'secondary';
  const tone = variant === 'danger' ? colors.danger : colors.primary;
  const textColor = filled ? (variant === 'danger' ? colors.surface : colors.onPrimary) : colors.primary;

  return (
    <Pressable
      role="button"
      aria-label={label}
      accessibilityHint={hint}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: filled ? tone : colors.surface, borderColor: filled ? tone : colors.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        focused && { outlineColor: colors.text, outlineWidth: 2, outlineStyle: 'solid', outlineOffset: 2 },
      ]}
    >
      <AppText variant="bodyStrong" style={{ color: textColor, textAlign: 'center' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTarget,
    minWidth: minTarget,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
