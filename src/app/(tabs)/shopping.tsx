import { EmptyState, Screen } from '@/ui';

export default function ShoppingScreen() {
  return (
    <Screen title="Compras">
      <EmptyState
        icon="shopping"
        title="Nenhuma lista ainda"
        message="Em breve você vai criar listas de compras e acompanhar os preços de cada mercado."
      />
    </Screen>
  );
}
