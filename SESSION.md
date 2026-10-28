# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
**Fase 3 (Codificação) — plano de etapas gerado (`PLAN.md`), aguardando aprovação.**
**Próxima: E-01, aguardando Start (3B).**

## Última ação
- Passo "Divisão em Etapas": `PLAN.md` v1.1 com **40 etapas** (E-01..E-40) em 11 sprints, marcos de aparelho real (M-0..M-4), matriz PBI × Etapa (todo o MVP coberto), riscos de sequência e ordem de corte D-013 mapeada para etapas.
- **Código antigo encontrado** em `../dia-a-dia` (Expo SDK 57, TS, ~11,2 mil linhas, Épicos 1–2 e parte do 3, sem testes). O Kaynan delegou a escolha → **D-045: porte com triagem** (substitui D-036): lógica pura → `src/core` com testes de caracterização; plataforma → adaptadores; telas só referência; backup antigo (`.db` cru) e ML ficam de fora; bancos do D-030 + Caixa/Inter extras; `dia-a-dia` congelado e só leitura (`e59f1a1` + árvore de trabalho de 28/10). BRD, CONTEXT, TRD, matriz e skills atualizados; ADRs do spike renumerados para D-046/D-047.
- Desvios propostos (PLAN §0.1, a aprovar): E-06 = inventário e porte (D-045); service worker/offline no Sprint 2 (E-07); Playwright já na E-03; bancada descartável em preview `spike/*` na E-02; rota `/dev/selftest` em builds de debug/preview; perguntas restantes do spike distribuídas pelas etapas que dependem delas.
- Nenhum código de produto escrito.

## Próximo passo
Aprovação do `PLAN.md` pelo Kaynan → "Start" da **E-01** (esqueleto, design system mínimo, navegação, tema, APK de debug + preview no iPhone).

## Bloqueios
- Nenhum para a E-01. Perguntas que impedem etapas futuras: `PLAN.md` §17 (CSVs anonimizados e origem dos perfis antigos, iPhone e 2º Android disponíveis, curva da espera do PIN, aprovação dos desvios).

## Decisões provisórias / em aberto
1. E-02: D-004 (cifra web), D-039 (KDF) → viram D-046/D-047 (`@noble/hashes` do código antigo é candidata forte). D-038 (Intl/Hermes) → E-06. D-033 (EAN no iPhone) → E-33. `.ics`/Badging → E-22. D-003 (passkey) → R2.
2. Feriados no "dia útil" → R2 (D-031). Data do beta → **M-0** (fim da E-11) (D-043).
3. Antes da produção: Pages clássico × Workers (ADR-006) → E-39.
4. E-01: `cmake.dir` reproduzível, teste de fronteira de imports, ícones das abas (`react-native-svg` antecipado × glifos), dependências extras do template e as 8 vulnerabilidades do `npm audit` (propor; remover só com OK). `allowBackup=false` → E-03.
5. Script local de anonimização de CSV → E-12.
6. Idioma das mensagens de commit: descrição em inglês (AGENTS §1), exceto mensagem ditada literalmente pelo Kaynan (skill `git-versionamento`).

## Não testado
- Nada de código de produto nesta fase. Afirmações "?" da matriz dependem do E-02 e de aparelhos reais (iPhone com iOS 18 e 26, segundo fabricante Android).
