# Casa em Dia

"Seu dinheiro e sua rotina num só lugar, privado." App local-first (Expo SDK 58): Android nativo (APK) e PWA para iPhone. Sem conta, sem servidor de dados.

Documentos: `AGENTS.md` (regras) · `CONTEXT.md` · `ARCH.md` · `PLAN.md` (etapas) · `SESSION.md` · `BRD.md` · `TRD.md` · `UX.md` · `DECISIONS.md` · `docs/`.

## Pré-requisitos (Windows)
Node ≥ 22.13 (testado 24), JDK 17, Android SDK com **CMake ≥ 4.1** (o 3.22 quebra por MAX_PATH) e `ANDROID_HOME` definido. Detalhes: `docs/PROVA-DE-VIDA.md`.

## Comandos
```powershell
npm install
npm test                 # Jest (jest-expo): unit, contraste dos tokens, fronteiras de arquitetura
npm run typecheck        # tsc --noEmit

# Web (PWA)
npm run build:web        # expo export -p web → dist/
npm run check:urls       # falha se o dist/ citar host externo
npm run serve:web        # wrangler pages dev em http://localhost:8788 (headers reais do _headers)

# Android (APK de debug, arm64-v8a)
npm run android:debug -- --install   # prebuild + Gradle + adb install
npx expo start                       # o APK de debug carrega o JS do Metro
adb reverse tcp:8081 tcp:8081
```
O `prebuild` escreve `android/local.properties` (sdk.dir e cmake.dir) pelo config plugin `plugins/with-android-local-properties.js`; para outro CMake, defina `CASA_CMAKE_DIR`. A pasta `android/` é gerada e não vai para o git.

Deploy de preview e de produção: `docs/DEPLOY-CLOUDFLARE.md` (produção só com ordem explícita do Kaynan).

## Licença
GPL-3.0 (`LICENSE`).
