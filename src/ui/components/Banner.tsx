import { StyleSheet, View } from 'react-native';

import { radius, space, useTheme, type Palette } from '../theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type BannerTone = 'info' | 'warning' | 'success' | 'danger';

const toneIcon: Record<BannerTone, IconName> = { info: 'info', warning: 'warning', success: 'success', danger: 'danger' };
const toneColor: Record<BannerTone, keyof Palette> = { info: 'primary', warning: 'warning', success: 'success', danger: 'danger' };

type Props = { tone?: BannerTone; title: string; message?: string };

/** Status message: tone = icon + text + color, never color alone (D-016). */
export function Banner({ tone = 'info', title, message }: Props) {
  const { colors } = useTheme();
  const color = colors[toneColor[tone]];
  return (
    <View
      accessible
      aria-label={message ? `${title}. ${message}` : title}
      style={[styles.box, { backgroundColor: colors.surface, borderColor: color }]}
    >
      <Icon name={toneIcon[tone]} color={color} />
      <View style={styles.texts}>
        <AppText variant="bodyStrong">{title}</AppText>
        {message ? <AppText color="textMuted">{message}</AppText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  texts: { flex: 1, gap: space.xs },
});
