# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
**Fase 3 (Codificação) — `PLAN.md` v1.3 aprovado em 28/10/2026.**
**E-01 implementada (branch `feat/e-01-skeleton`), aguardando aprovação do Kaynan.**

## Última ação (E-01 — esqueleto, design system mínimo, navegação, tema, pipeline)
- Tokens (`src/ui/theme`: cores D-016 + borda `#7D858F`/`#737B85` ≥ 3:1, tipografia, espaçamento, alvo 48), tema automático + manual (em memória até a E-10), componentes `AppText`, `Button`, `IconButton`, `Card`, `Banner`, `EmptyState`, `ChoiceGroup`, `Screen`, `Icon` (SVG próprio).
- 5 abas (Início · Gastos · Contas · Compras · Mais) com ícone + rótulo + indicador; coluna de 480 px no web; tema de navegação derivado dos tokens.
- Pipeline: config plugin `with-android-local-properties` (sdk.dir/cmake.dir reproduzíveis), `npm run android:debug`, `build:web`, `check:urls`, `serve:web`, `typecheck`; README com o passo a passo.
- Testes: contraste WCAG dos tokens nos 2 temas, fronteiras de arquitetura (core puro; pacotes de plataforma só em `src/platform`; módulos sem import cruzado).
- Dependência nova: `react-native-svg` 15.16.0 (MIT; já prevista no D-021, antecipada para os ícones em vez da fonte de 972 KB do `expo-symbols`).
- Correções achadas no teste real: tema ficava pela metade após a hidratação do HTML estático (remontagem única no web); `aria-checked` ausente no web (migração para `role`/`aria-*`); barra de abas escondida pela barra de gestos no Android (`height: 'auto'` removido). Lições em `skills/expo-app` e `skills/a11y-expo`.
- Kaynan (28/10): sem iPhone → validação adiada, PWA experimental no beta (D-049); lançamento manual incluído (C-08, D-050).

## Testado
- `npm test` (27 testes, verde), `tsc --noEmit` (0 erros), `expo-doctor` 20/20, `expo export -p web` + `check:urls` OK.
- Web (Chrome desktop, `wrangler pages dev`): 5 abas com nome e `aria-selected`; grupo "Tema" com `aria-checked`; troca de tema no 1º toque; coluna centralizada.
- Android (OPPO CPH2699, Android 16): APK de debug compilado do zero pelo script (3 min 38 s, 90 MB), instalado e aberto; tema escuro automático; barra de abas visível acima da barra de gestos.

## Não testado
- **Android:** TalkBack; fonte do sistema em 200% (configuração do aparelho: fica para o Kaynan); tema claro no aparelho.
- **iPhone/PWA:** nada em iPhone real (fila `docs/testes/fila-iphone.md`, itens 1–4). Playwright/WebKit entra na E-03.

## Próximo passo
Aprovação da E-01 pelo Kaynan → merge na `main` → E-02 (spike de criptografia web + KDF).

## Bloqueios
- Nenhum para a E-02. CSVs anonimizados dos 6 bancos necessários antes do Sprint 3.

## Decisões provisórias / em aberto
1. E-02: D-004 (cifra web), D-039 (KDF) → viram D-046/D-047 (`@noble/hashes` do código antigo é candidata forte). D-038 (Intl/Hermes) → E-06. D-033 (EAN no iPhone) → E-33. `.ics`/Badging → E-22. D-003 (passkey) → R2.
2. Feriados no "dia útil" → R2 (D-031). Data do beta → **M-0** (fim da E-11) (D-043).
3. Antes da produção: Pages clássico × Workers (ADR-006) → E-39.
4. **Proposta a decidir:** remover dependências do template sem uso no código (`@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-image`, `expo-device`, `expo-web-browser`, `expo-constants`, `expo-font`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`); `npm audit --omit=dev`: 8 vulnerabilidades (5 baixas, 3 altas) a analisar. Só com OK do Kaynan.
5. Script local de anonimização de CSV → E-12.
6. Idioma das mensagens de commit: descrição em inglês (AGENTS §1), exceto mensagem ditada literalmente pelo Kaynan.
