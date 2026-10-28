---
name: testing-strategy
description: Use ao planejar ou escrever testes de qualquer PBI, ao decidir o nível certo (unit, golden, integração, e2e, manual) e ao montar o roteiro manual em aparelhos reais.
---

# testing-strategy — Pirâmide de testes do Casa em Dia

## Objetivo
Confiança alta com testes rápidos na base e poucos testes caros no topo, cobrindo **Android e iPhone/PWA**.

## Ferramentas (estado atual)
- **Jest 30 + `jest-expo`** (instalado; `npm test`). É o único runner documentado pelo Expo SDK 58.
- `@testing-library/react-native`: **não instalado**; adicionar quando houver UI de produto (avisar).
- **Playwright** (e2e web): **não instalado**; adicionar na etapa do PWA (baixa navegadores; avisar).
- Fixtures **somente sintéticas** em `tests/fixtures/`.

## Pirâmide
1. **Unit — `src/core` (a maioria):** dinheiro em centavos, datas/fusos, recorrência (RRULE, dia 31, último dia útil), dedupe, categorização, detecção de assinaturas (meta ≥ 80% de precisão em conjunto rotulado), mesclagem de lista, CSV injection. Sem React, sem plataforma, rápidos e determinísticos.
2. **Golden files:** perfis de banco (`csv-bancos-br`), entrada `.csv` → `.expected.json`. São o contrato do porte F-07.
3. **Contrato de portas:** a mesma suíte roda contra o fake de cada `src/platform/<cap>`.
4. **Integração com SQLite:**
   - Migrações do zero e incrementais, transação de importação (tudo ou nada), `UNIQUE` de dedupe, desfazer importação.
   - Nativo: roda no aparelho/emulador (development build). Definir o harness na Descoberta (ex.: rota de teste só em debug, ou test runner nativo; verificar opções atuais).
   - Web: Playwright contra `npx expo export` + `wrangler pages dev` (COOP/COEP reais).
5. **Backup ida e volta:** `parse(serialize(x)) ≡ x`; vetores fixos por `formatVer`; restauração cruzada web ↔ Android (`backup-cross-platform`).
6. **Relógio simulado e fusos:** fake `Clock`; rodar cenários de lembretes com `TZ=America/Sao_Paulo` e outro fuso (`TZ=UTC`); virada de mês/ano; horário de verão histórico.
7. **E2E web (Playwright):** abrir, PIN, importar CSV sintético, offline (DevTools offline), atualização do SW, headers (`crossOriginIsolated`).
8. **Manual em aparelhos reais** (roteiro versionado em `docs/`, resultado registrado):
   - **Android, 2 fabricantes** (OPPO CPH2699/ColorOS 16 + outro): lembretes por 14 dias com o app fechado, após reboot, economia de bateria, ações na notificação, TalkBack.
   - **iPhone via PWA** (iOS 26 e 18): instalar, modo avião, persistência após dias sem abrir, VoiceOver, backup/restauração.
   - Backup restaurado em **outro aparelho** antes do beta.

## Passo a passo por PBI
1. Liste os critérios de aceite → um teste (ou item de roteiro manual) por critério.
2. Escreva primeiro o teste do core (falhando), depois o código.
3. Teste de regressão para todo bug corrigido.
4. Rode `npm test` + `npx tsc --noEmit` antes do commit.
5. No relatório: o que foi testado, o que **não** foi e em qual plataforma.

## Checklist de qualidade
- [ ] Nenhum dado real em teste, fixture ou snapshot.
- [ ] Sem `Date.now()`/`new Date()` direto na lógica: relógio injetado.
- [ ] Sem dependência de rede nos testes.
- [ ] Teste de soma do dashboard (S-03): o total exibido = soma dos itens ativos e em teste.
- [ ] Testes estáveis (sem sleep; sem ordem implícita).

## Armadilhas
- Testar só no Chrome do Windows: o Safari/iOS tem comportamento próprio (OPFS, persistência, SW).
- O emulador não substitui o aparelho real para alarmes (fabricantes matam processos).
- O `jest-expo` roda numa plataforma por vez; verificar a doc atual para separar web e nativo.

## Exemplo mínimo
```ts
// tests/runner.test.ts já existe como sanidade. Exemplo de core:
import { brlToCents } from '../src/core/money/brl'; // (quando existir)
it('parses Brazilian amounts to integer cents', () => {
  expect(brlToCents('1.234,56')).toBe(123456);
  expect(brlToCents('-0,5')).toBe(-50);
});
```
