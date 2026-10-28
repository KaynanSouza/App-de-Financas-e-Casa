# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
**Fase 2 concluída. Próximo: Prompt 3A.**

## Última ação
- Fase 2 (Descoberta): entrevista dos Blocos 0, A–G com o Kaynan → **D-001..D-044** em `DECISIONS.md` (com índice e status dos 24 pontos de impacto da arquitetura).
- Gerados/atualizados: `BRD.md` (personas, métricas, escopo por release, ordem de corte, plano de sprints, regras por módulo, riscos), `TRD.md` (stack, arquitetura, portas, modelo de dados, STRIDE, alertas, desempenho, testes, builds, deploy/CSP/SW, versionamento), `UX.md` (42 telas, wireframes, design system com contraste calculado, microcopy, checklist de acessibilidade), `docs/matriz-paridade.md` FINAL, `CONTEXT.md`, `ARCH.md`.
- Checagem de consistência: todos os PBIs do MVP no BRD, TRD, UX/matriz; as 42 telas mapeadas a PBIs; lacuna encontrada (onboarding/ajuda sem PBI) → **novo PBI F-08** (D-044).
- Lições registradas nas skills (alerts, sqlite-web, backup, csv, a11y, backlog-pbi, pwa).

## Decisões que mais mudam o plano
- **C-01..C-06 serão reescritos** (o código dos Épicos 1 e 2 não existe mais; D-036). Escopo mantido, prazo maior.
- **iPhone:** sem notificações → faixa no app + `.ics` (D-001); instalação obrigatória + backup semanal (D-002).
- **Zero rede no MVP** (D-032); **custo zero** e **até 5 h/semana** (D-043): data do beta só após o Sprint 1.

## Próximo passo
Prompt 3A (Fase 3). O spike **E-02** precisa responder: criptografia do banco no web, KDF (backup/PIN), passkey PRF, `VALARM` do `.ics` no iOS, `expo-camera` web no Safari, `Intl` com fuso no Hermes, Web Share no modo standalone, Badging API.

## Bloqueios
- Nenhum.

## Decisões provisórias / em aberto
1. E-02 (Fase 3): D-004, D-033 (EAN no iPhone), D-038 (Intl/Hermes), D-039 (KDF), D-003 (passkey → R2).
2. Feriados no "dia útil" → R2 (D-031). Data do beta → após o Sprint 1 (D-043).
3. Antes da produção: Pages clássico × Workers (ADR-006).
4. Sprint 1: `allowBackup=false` e `cmake.dir` reproduzível (config plugins); teste de fronteira de imports.
5. Script local de anonimização de CSV + amostras dos 6 bancos (D-036).
6. Idioma das mensagens de commit (AGENTS diz inglês; os prompts ditam português).
7. Dependências extras do template e as 8 vulnerabilidades do `npm audit`.

## Não testado
- Nada de código de produto nesta fase. Afirmações sobre plataformas marcadas "?" na matriz dependem do E-02 e de aparelhos reais (iPhone 18 e 26, segundo fabricante Android).
