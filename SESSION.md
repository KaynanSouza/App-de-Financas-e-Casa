# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
**Fase 3 (Codificação) — plano de etapas gerado (`PLAN.md`), aguardando aprovação.**
**Próxima: E-01, aguardando Start (3B).**

## Última ação
- Passo "Divisão em Etapas": `PLAN.md` com **40 etapas** (E-01..E-40) em 11 sprints, marcos de aparelho real (M-0..M-4), matriz PBI × Etapa (todo o MVP coberto), riscos de sequência e ordem de corte D-013 mapeada para etapas.
- Desvios propostos (PLAN §0.1, a aprovar): E-06 = reescrita da base do núcleo (D-036), não porte; service worker/offline no Sprint 2 (E-07); Playwright já na E-03; bancada descartável em preview `spike/*` na E-02; rota `/dev/selftest` em builds de debug/preview; perguntas restantes do spike distribuídas pelas etapas que dependem delas.
- Nenhum código de produto escrito.

## Próximo passo
Aprovação do `PLAN.md` pelo Kaynan → "Start" da **E-01** (esqueleto, design system mínimo, navegação, tema, APK de debug + preview no iPhone).

## Bloqueios
- Nenhum para a E-01. Perguntas que impedem etapas futuras: `PLAN.md` §17 (critérios antigos de C-01..C-06, CSVs anonimizados, iPhone e 2º Android disponíveis, curva da espera do PIN, aprovação dos desvios).

## Decisões provisórias / em aberto
1. E-02: D-004 (cifra web), D-039 (KDF) → viram D-045/D-046. D-038 (Intl/Hermes) → E-06. D-033 (EAN no iPhone) → E-33. `.ics`/Badging → E-22. D-003 (passkey) → R2.
2. Feriados no "dia útil" → R2 (D-031). Data do beta → **M-0** (fim da E-11) (D-043).
3. Antes da produção: Pages clássico × Workers (ADR-006) → E-39.
4. E-01: `cmake.dir` reproduzível, teste de fronteira de imports, ícones das abas (`react-native-svg` antecipado × glifos), dependências extras do template e as 8 vulnerabilidades do `npm audit` (propor; remover só com OK). `allowBackup=false` → E-03.
5. Script local de anonimização de CSV → E-12.
6. Idioma das mensagens de commit: descrição em inglês (AGENTS §1), exceto mensagem ditada literalmente pelo Kaynan (skill `git-versionamento`).

## Não testado
- Nada de código de produto nesta fase. Afirmações "?" da matriz dependem do E-02 e de aparelhos reais (iPhone com iOS 18 e 26, segundo fabricante Android).
