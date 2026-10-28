import { View, type ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Own 24×24 stroke icons (no icon font: keeps the PWA light, D-021/D-026).
// Icons are decorative: the label always comes from the surrounding text or control.

export type IconName = 'home' | 'spending' | 'bills' | 'shopping' | 'more' | 'info' | 'warning' | 'success' | 'danger' | 'check';

type Props = { name: IconName; color: ColorValue; size?: number };

export function Icon({ name, color, size = 24 }: Props) {
  const stroke = { stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {name === 'home' && <Path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...stroke} />}
        {name === 'spending' && (
          <>
            <Circle cx={12} cy={12} r={8.5} {...stroke} />
            <Path d="M12 3.5V12h8.5" {...stroke} />
          </>
        )}
        {name === 'bills' && (
          <>
            <Rect x={3} y={5} width={18} height={16} rx={2} {...stroke} />
            <Path d="M3 10h18M8 3v4M16 3v4" {...stroke} />
          </>
        )}
        {name === 'shopping' && (
          <>
            <Path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" {...stroke} />
            <Circle cx={9} cy={19.5} r={1.5} {...stroke} />
            <Circle cx={17} cy={19.5} r={1.5} {...stroke} />
          </>
        )}
        {name === 'more' && (
          <>
            <Circle cx={5} cy={12} r={1.75} fill={color} />
            <Circle cx={12} cy={12} r={1.75} fill={color} />
            <Circle cx={19} cy={12} r={1.75} fill={color} />
          </>
        )}
        {name === 'info' && (
          <>
            <Circle cx={12} cy={12} r={9} {...stroke} />
            <Path d="M12 11v5M12 8h.01" {...stroke} />
          </>
        )}
        {name === 'warning' && <Path d="M12 3 2 20h20zM12 10v4M12 17h.01" {...stroke} />}
        {name === 'success' && (
          <>
            <Circle cx={12} cy={12} r={9} {...stroke} />
            <Path d="m8 12 3 3 5-6" {...stroke} />
          </>
        )}
        {name === 'danger' && (
          <>
            <Circle cx={12} cy={12} r={9} {...stroke} />
            <Path d="m9 9 6 6m0-6-6 6" {...stroke} />
          </>
        )}
        {name === 'check' && <Path d="m5 12 5 5 9-10" {...stroke} />}
      </Svg>
    </View>
  );
}
