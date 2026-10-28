import { EmptyState, Screen } from '@/ui';

export default function SpendingScreen() {
  return (
    <Screen title="Gastos">
      <EmptyState
        icon="spending"
        title="Nenhum gasto ainda"
        message="Em breve você vai importar o extrato do seu banco e ver quanto gastou em cada categoria."
      />
    </Screen>
  );
}
