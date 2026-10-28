import { Pressable, StyleSheet, View } from 'react-native';

import { minTarget, radius, space, useTheme } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  /** Read by screen readers as the group name. */
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Single choice (segmented control). Selected = filled + check mark, not color alone. Wraps at large font sizes. */
export function ChoiceGroup<T extends string>({ label, options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View role="radiogroup" aria-label={label} style={styles.group}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            role="radio"
            aria-label={o.label}
            aria-checked={selected}
            onPress={() => onChange(o.value)}
            style={[
              styles.option,
              {
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            {selected ? <Icon name="check" color={colors.onPrimary} size={20} /> : null}
            <AppText variant="bodyStrong" style={{ color: selected ? colors.onPrimary : colors.text }}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  option: {
    minHeight: minTarget,
    paddingHorizontal: space.lg,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
});
