# SESSION.md — Estado da sessão

**Atualizado em:** 27/10/2026

## Fase atual
FASE 1 — SETUP · etapa "Criação do Projeto" + "Setup inicial do Ambiente" (Prompt 1A) — **concluída, aguardando aprovação**.

## Última ação
- Projeto Expo criado com o template oficial `default@sdk-58` (Expo SDK 58, React Native 0.88, React 19.3, TypeScript 6.0, Expo Router), exemplo removido via `reset-project`.
- `web.output` mudado para `"static"`; nome do app ajustado.
- `.gitignore` reforçado: segredos, `.env*`, `.wrangler/`, CSVs, dumps, backups, builds.
- Estrutura de pastas provisória criada (ADR-002) e arquivos de contexto escritos.
- Backlog movido para `docs/backlog-local-first.pdf` e versionado.

## Próximo passo
Prompt 1B (a definir pelo humano). Sugestões ainda sem execução: verificar `npx expo start --web` e o primeiro dev build Android; escolher o runner de testes; criar o lint de fronteiras de `src/core`/`src/platform`.

## Bloqueios
- Nenhum bloqueio técnico.
- A seção 0.5 original ("Estrutura de pastas alvo") não foi recebida; a estrutura atual é provisória.

## Decisões pendentes
1. iPhone/PWA entra no critério de saída do MVP? (DECISIONS.md, item 23)
2. Os 24 pontos de impacto da nova arquitetura (DECISIONS.md), principalmente: armazenamento e criptografia no PWA, notificações no PWA, formato de backup entre plataformas.
3. Local do código dos Épicos 1 e 2 (F-07), que será informado na Descoberta.
4. Dependências do template (`@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-image`, `expo-web-browser`, `expo-device` etc.) foram mantidas como vieram; avaliar remoção na Descoberta.
5. `npm audit` acusou 8 vulnerabilidades (5 low, 3 high) nas dependências do template; não analisadas.
6. `allowBackup=false` (F-03) ainda não configurado.

## Não testado
- `expo start` (web e Android), `expo export -p web`, build Android: **nada foi executado**.
- Checagem de tipos: ver o resultado no relatório da etapa.
