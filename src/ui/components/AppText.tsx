import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type Palette, type TypographyVariant } from '../theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: keyof Palette;
};

/** Text that follows the type scale and scales with the system font size (never truncates by default). */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const { colors } = useTheme();
  return <Text {...rest} style={[typography[variant], { color: colors[color] }, style]} />;
}
