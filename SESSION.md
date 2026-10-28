# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
FASE 1 — SETUP · etapa "Verificação do Ambiente" (Prompt 1B) — **concluída e APROVADA pelo Kaynan em 28/10/2026**.

## Última ação
- Ambiente verificado executando comandos (detalhes em `docs/PROVA-DE-VIDA.md`): Node 24.16.0, npm 12.0.2, JDK 17 (Temurin), Android SDK (platforms 36/37, build-tools 36, NDK 27, **CMake 4.1.2** instalado pelo Kaynan), `expo-doctor` 20/20, wrangler 4.154.0 (devDependency).
- Aparelho de teste registrado no TRD: **OPPO CPH2699, Android 16, ColorOS 16**. iPhones: iOS 26.x e 18.x.
- Prova de vida:
  - **Web dev:** OK. **Export estático:** OK, servido com `wrangler pages dev`; SQLite no web OK (OPFS, precisa de COOP/COEP e de `.wasm` no Metro).
  - **APK de debug:** gerado e instalado no OPPO; o app abre. **SQLite nativo:** OK, com persistência.
  - **Preview no Cloudflare:** publicado em 28/10/2026 → https://preview.casa-em-dia-44l.pages.dev (commit `102c83f`; produção NÃO publicada).
- `public/_headers` (COOP/COEP, nosniff, referrer, cache) e `public/_redirects` (sem regras, explicado) criados.
- Docs: `docs/PROVA-DE-VIDA.md`, `docs/ASSINATURA.md`, `docs/DEPLOY-CLOUDFLARE.md`; ADR-004 a ADR-008 em `DECISIONS.md`.
- Pós-aprovação (28/10/2026): nome comercial **Casa em Dia** (package neutro mantido); `jest-expo` instalado (`npm test` passa); projeto `casa-em-dia` criado no Pages clássico (`--force`, porque o wrangler 4.154 desvia para o Workers).
- Código descartável removido: rota `proto-sqlite`, `metro.config.js`, dependência `expo-sqlite`, `android/`, `dist/`, app de prova desinstalado do OPPO.

## Próximo passo
Kaynan testa o preview no iPhone (iOS 26/18) e no Android: abrir, adicionar à Tela de Início, modo avião (esperado: não abre offline). Depois, aguardar o prompt da próxima etapa.

## Bloqueios
- Nenhum.

## Decisões pendentes
1. Antes da produção: Pages clássico ou migrar para Workers (ADR-006).
2. Escrever o teste de fronteira (`src/core` sem react/expo; módulos nativos só em `src/platform`).
3. Dependências do template que ninguém usa (avaliar remoção).
4. Tornar o `cmake.dir` (CMake 4.1.2) reproduzível, já que `android/` é gerado.
5. iPhone/PWA no critério de saída do MVP; 24 pontos de impacto da arquitetura (DECISIONS.md).
6. Criptografia do banco no PWA (SQLCipher não existe no web) e despejo do OPFS (`persisted() = false`).
7. Manifest e service worker do PWA (sem eles, não abre offline nem instala direito).
8. `allowBackup` vem `true` no prebuild; F-03 exige `false`.
9. Local do código dos Épicos 1 e 2 (F-07).
10. Dependências extras do template e as 8 vulnerabilidades do `npm audit` (não analisadas).

## Não testado
- Preview aberto no **iPhone** e no **Android via navegador** (só verificado por `curl`); instalação na Tela de Início; modo avião.
- OPFS / SharedArrayBuffer no **Safari do iOS** (o web só foi testado no Chrome 156 do Windows).
- Build **release** assinado; SQLCipher; emulador Android.
