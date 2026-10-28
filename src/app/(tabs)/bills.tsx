import { EmptyState, Screen } from '@/ui';

export default function BillsScreen() {
  return (
    <Screen title="Contas">
      <EmptyState
        icon="bills"
        title="Nenhuma conta cadastrada"
        message="Em breve você vai cadastrar contas como luz e aluguel e receber lembretes antes do vencimento."
      />
    </Screen>
  );
}
