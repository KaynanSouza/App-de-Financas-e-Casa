import { Banner, EmptyState, Screen } from '@/ui';

export default function HomeScreen() {
  return (
    <Screen title="Início">
      <Banner
        tone="info"
        title="Versão em construção"
        message="As funções do Casa em Dia chegam aos poucos. Ainda não guarde dados reais aqui."
      />
      <EmptyState
        icon="success"
        title="Tudo em dia"
        message="Quando houver contas vencendo ou algo que precise de atenção, aparece aqui."
      />
    </Screen>
  );
}
