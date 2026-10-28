import { StyleSheet, View } from 'react-native';

import { space, useTheme } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type Props = {
  icon: IconName;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ icon, title, message, action }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.box}>
      <Icon name={icon} color={colors.textMuted} size={48} />
      <AppText variant="title" style={styles.center}>
        {title}
      </AppText>
      <AppText color="textMuted" style={styles.center}>
        {message}
      </AppText>
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg },
  center: { textAlign: 'center' },
});
