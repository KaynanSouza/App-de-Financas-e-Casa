---
name: platform-adapters
description: Use sempre que uma feature precisar de algo que difere entre Android e web (banco, chave segura, notificações, arquivos/compartilhar, biometria, câmera, ciclo de vida) ou ao revisar imports de módulos nativos.
---

# platform-adapters — Portas e adaptadores em `src/platform`

## Objetivo
Manter a regra de negócio portátil: `src/core` e `src/modules` dependem de **interfaces**; só `src/platform` conhece Expo/RN nativo ou APIs web.

## Regras
1. **Nenhum import de módulo nativo/Expo de plataforma fora de `src/platform`.** (`react-native`, componentes e hooks de UI podem ficar em `src/app`/`src/ui`.)
2. `src/core` não importa `react`, `react-native`, `expo-*` nem `src/platform`.
3. Uma pasta por capacidade (`<cap>` em kebab-case):
   ```
   src/platform/<cap>/index.ts         # interface + tipos + re-export
   src/platform/<cap>/<cap>.native.ts  # Android (Metro resolve .native.ts)
   src/platform/<cap>/<cap>.web.ts     # PWA (Metro resolve .web.ts)
   src/platform/<cap>/<cap>.fake.ts    # fake determinístico para testes
   ```
4. Toda capacidade tem uma linha em `docs/matriz-paridade.md` e na tabela do `ARCH.md`.
5. Uma capacidade ausente em uma plataforma **não** é ignorada: o adaptador implementa a **degradação explícita** (ex.: retorna `{ supported: false, reason }`) e o Kaynan é avisado.

## Passo a passo
1. Escreva a interface em `index.ts` pensando no **caso de uso**, não na API da lib (ex.: `scheduleReminder(r)`, e não `Notifications.scheduleNotificationAsync`).
2. Inclua `capabilities()` quando o suporte variar: `{ exactAlarms: boolean, ... }`.
3. Verifique a **documentação atual** da lib/API de cada lado antes de implementar.
4. Implemente `.native.ts` e `.web.ts`. Os erros viram tipos do domínio (`PlatformError`), **sem dado financeiro na mensagem**.
5. Implemente o `.fake.ts` (estado em memória, relógio injetável).
6. Teste o **contrato**: a mesma suíte roda contra o fake. Nativo/web reais são testados no roteiro manual ou em testes de integração.
7. Atualize a matriz de paridade com: comportamento Android, comportamento iPhone/PWA, degradação, fonte verificada (link + data).

## Resolução de arquivo
- O Metro escolhe `x.native.ts` no Android e `x.web.ts` no web quando você importa `./x`.
- O TypeScript não entende as extensões de plataforma: o `index.ts` declara a interface, e os dois adaptadores devem satisfazê-la (`satisfies`). Rodar `npx tsc --noEmit`.
- O Jest (jest-expo) usa a plataforma do preset: verificar a documentação atual do jest-expo para testar web e nativo separadamente.

## Checklist de qualidade
- [ ] `grep -rn "from 'expo-\|from \"expo-" src --include=*.ts* | grep -v src/platform` não retorna imports de plataforma.
- [ ] `src/core` sem imports de react/expo (criar teste de fronteira automatizado; pendente no SESSION).
- [ ] Interface pequena e orientada a caso de uso.
- [ ] Fake + testes de contrato.
- [ ] Matriz de paridade atualizada; degradação comunicada.

## Armadilhas
- Vazar tipos da lib na interface (ex.: `NotificationRequest` do Expo) acopla o core à plataforma.
- `Platform.OS === 'web'` espalhado pelo código: concentre isso no adaptador.
- No web, APIs como OPFS e `SharedArrayBuffer` exigem contexto seguro (HTTPS ou localhost) e COOP/COEP (ver `sqlite-web-encrypted`).
- Esquecer que o PWA no iPhone **não** agenda notificação local sem servidor (confirmado na doc do WebKit).

## Exemplo mínimo
```ts
// src/platform/clock/index.ts
export interface Clock { now(): Date }
export { clock } from './clock';

// src/platform/clock/clock.native.ts  (idem .web.ts)
import type { Clock } from './index';
export const clock = { now: () => new Date() } satisfies Clock;

// src/platform/clock/clock.fake.ts
import type { Clock } from './index';
export function fakeClock(start: Date) {
  let t = start.getTime();
  return { now: () => new Date(t), advance: (ms: number) => { t += ms; } } satisfies Clock & { advance(ms: number): void };
}
```
