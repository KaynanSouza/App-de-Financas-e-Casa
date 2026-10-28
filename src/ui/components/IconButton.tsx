import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { minTarget, radius, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  icon: IconName;
  /** Required: an icon-only button has no visible text. */
  label: string;
  onPress: () => void;
};

export function IconButton({ icon, label, onPress }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      role="button"
      aria-label={label}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.base,
        pressed && { opacity: 0.7 },
        focused && { outlineColor: colors.text, outlineWidth: 2, outlineStyle: 'solid' },
      ]}
    >
      <Icon name={icon} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: minTarget,
    height: minTarget,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
