import { AppText, Card, ChoiceGroup, Screen, useTheme, type ThemePreference } from '@/ui';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export default function MoreScreen() {
  const { preference, setPreference } = useTheme();
  return (
    <Screen title="Mais">
      <Card>
        <AppText variant="title" role="heading">
          Aparência
        </AppText>
        <AppText color="textMuted">Automático segue o tema do seu celular.</AppText>
        <ChoiceGroup label="Tema" options={themeOptions} value={preference} onChange={setPreference} />
      </Card>
      <Card>
        <AppText variant="title" role="heading">
          Em breve
        </AppText>
        <AppText color="textMuted">Assinaturas, backup, configurações, diagnóstico e privacidade ficam aqui.</AppText>
      </Card>
    </Screen>
  );
}
