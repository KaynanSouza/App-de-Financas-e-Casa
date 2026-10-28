# Prova de vida — Fase 1, etapa "Verificação do Ambiente"

> Data: 27/10/2026 · Máquina: notebook Windows do Kaynan · Tudo abaixo foi **executado**, não suposto, salvo onde estiver marcado "não testado".
> O código descartável (rota `proto-sqlite`, `metro.config.js`, dependência `expo-sqlite`, pasta `android/`) foi **removido** ao final. Os comandos estão aqui para reproduzir.

## 1. Checklist do ambiente

| # | Item | Comando | Resultado | Status |
|---|---|---|---|---|
| 1a | SO / arquitetura | `Get-CimInstance Win32_OperatingSystem` | Windows 11 Home Single Language 10.0.26200, 64 bits; i5-13450HX (16 threads) | OK |
| 1b | RAM | idem | 15,7 GB total; ~3,3 GB livres no momento do teste | OK (apertado com emulador + Gradle juntos) |
| 1c | Disco | `Get-PSDrive` / `df -h /c` | C: **10,4 GB livres** no início; **57 GB livres** ao final da etapa (espaço liberado durante a sessão) | OK agora (era crítico) |
| 2a | Node.js | `node -v` | v24.16.0 (SDK 58 exige ≥ 22.13.x) | OK |
| 2b | Gerenciador | `npm -v` | 12.0.2 (yarn/pnpm/bun ausentes; não são necessários) | OK |
| 3 | Git | `git --version`; `git config user.name/email` | 2.54.0.windows.1; `KaynanSouza` / e-mail configurado | OK |
| 4 | expo-doctor | `npx expo-doctor@latest` | 20/20 checks passaram, nenhum problema | OK |
| 5a | JDK | `java -version`; `JAVA_HOME` | Temurin 17.0.20.1 (React Native recomenda JDK 17). Também existem JDK 27 (`C:\Program Files\Java`) e o JBR 25 do Android Studio, que não são usados | OK |
| 5b | ANDROID_HOME | `$env:ANDROID_HOME` | `C:\Users\kayna\AppData\Local\Android\Sdk` | OK |
| 5c | platform-tools/adb | `adb version` | 1.0.41 (37.0.1); **adb não está no PATH** (usado pelo caminho completo) | OK, mas falta o PATH |
| 5d | build-tools | `ls Sdk/build-tools` | 35.0.0, 36.0.0 | OK |
| 5e | Platforms | `ls Sdk/platforms` | android-36, android-37.0 (SDK 58: compileSdk 37, targetSdk 36) | OK |
| 5f | NDK / CMake | `ls Sdk/ndk`, `Sdk/cmake` | NDK 27.0.12077973 e 27.1.12297006; CMake 3.22.1 (ninja 1.10.2, **quebra por MAX_PATH**) e **CMake 4.1.2 (ninja 1.12.1)**, instalado pelo Kaynan durante a etapa | OK com o 4.1.2 |
| 5g | cmdline-tools | `ls Sdk/cmdline-tools` | ausente no início; versão `latest` instalada pelo Kaynan durante a etapa | OK |
| 5h | Aparelho | `adb devices -l` | `286d3e7d device`: **OPPO CPH2699**, Android 16 (API 36), ColorOS V16.0.0, arm64-v8a | OK |
| 5i | Emulador | `emulator -list-avds` | `Medium_Phone_API_37.0` (x86_64) | OK |
| 7 | wrangler | `npm i -D wrangler`; `npx wrangler --version` | 4.154.0 (licença MIT OR Apache-2.0; só dev, não vai para o bundle) | OK |
| 9 | Runner de testes | — | não instalado nesta etapa (ver §9) | Decisão pendente |

**Ações sugeridas ao Kaynan (não executadas):**
- Manter ≥ 25 GB livres no C: para builds nativos (o `~/.gradle` ocupa ~5,6 GB).
- Adicionar `%LOCALAPPDATA%\Android\Sdk\platform-tools` ao PATH do usuário (a doc do Expo pede isso).

## 2. Web local (dev server)
```powershell
npx expo start --web --port 8081
```
- **Sem configuração extra, o `expo-sqlite` falha no web:** `Unable to resolve "./wa-sqlite/wa-sqlite.wasm" from "node_modules\expo-sqlite\web\worker.ts"`.
- **Solução:** criar `metro.config.js` que (1) adiciona `wasm` a `resolver.assetExts` e (2) injeta os headers `Cross-Origin-Embedder-Policy: credentialless` e `Cross-Origin-Opener-Policy: same-origin` no dev server.
  - O snippet **não aparece** na página da doc (nem em `sqlite.md`); a fonte usada foi `node_modules/expo-sqlite/skills/expo-sqlite/references/web-and-config.md` (expo-sqlite ~58.0.14).
- Resultado no Chrome 156: `crossOriginIsolated = true`, `SharedArrayBuffer` disponível e protótipo **OK**: `sqlite=3.53.3`, tabela criada, insert e select funcionaram.
- **Persistência:** após recarregar a página, os dados continuaram lá (2 linhas). O armazenamento é **OPFS** (`navigator.storage.getDirectory()` mostra a pasta `expo-sqlite`; VFS `AccessHandlePoolVFS` num Web Worker).
- `navigator.storage.persisted()` = **false**: o navegador pode despejar os dados. Ver risco R-WEB-1.

## 3. Build estático web
```powershell
npx expo export --platform web      # gera dist/
npx wrangler pages dev dist --port 8788 --compatibility-date=2026-10-23
```
- `web.output = "static"`: gera um HTML por rota (`index.html`, `proto-sqlite.html`, `+not-found.html`, `_sitemap.html`).
- O `.wasm` vai para `dist/assets/node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.<hash>.wasm`; o worker vira `_expo/static/js/web/worker-<hash>.js` (143 KB). O bundle `entry` tem 1,1 MB.
- Servido pelo **emulador local do Pages** (`wrangler pages dev`): o protótipo de SQLite funcionou no build estático, com os headers reais vindos de `_headers`.
- Nenhuma URL externa nos HTML gerados.
- **Sem `manifest` e sem service worker**: o export padrão do Expo não gera nenhum dos dois. Portanto, hoje o PWA **NÃO abre em modo avião** e a instalação no iPhone vira um atalho sem manifest. **Isso é tarefa de uma etapa futura.**

## 4. `_headers` e `_redirects` no Cloudflare Pages
Os arquivos ficam em `public/` e o `expo export` os copia para a raiz de `dist/`.

| Teste (wrangler 4.154.0) | Resultado |
|---|---|
| `_headers` | "Parsed 2 valid header rules"; COOP, COEP, nosniff e referrer aparecem em `/`; `Cache-Control: immutable` em `/_expo/static/*` |
| `_redirects` com `/* /index.html 200` | **IGNORADO**: "Infinite loop detected in this rule… a redirect to strip `.html` or `/index`" |
| `/rota/inexistente` | 200 servindo `index.html` (o Pages faz SPA por padrão quando não existe `404.html`) |
| `/proto-sqlite.html` | 308 → `/proto-sqlite` |

**Conclusão:** o fallback de SPA **não deve** ficar no `_redirects`. O `public/_redirects` foi mantido sem regras, só com um comentário explicando. Atenção: se um dia existir `404.html` no output, o comportamento SPA deixa de valer.

## 5. Preview no Cloudflare Pages
**Publicado em 28/10/2026** (autorizado pelo Kaynan; login feito por ele): **https://preview.casa-em-dia-44l.pages.dev** (ambiente Preview, commit `102c83f`). Produção **não** publicada.
- Verificado por `curl`: `/` 200 com o placeholder "Casa em Dia — em construção"; headers de `_headers` aplicados; `x-robots-tag: noindex`; SPA fallback 200; `/index.html` 308 → `/`.
- O wrangler 4.154 desvia `pages project create` para o Workers e falha; foi preciso usar `--force` uma vez (ver `docs/DEPLOY-CLOUDFLARE.md`).
- **Pendente (teste manual do Kaynan):** abrir no iPhone (iOS 26 e 18) e no Android; adicionar à Tela de Início; modo avião. Esperado: **não abre offline** (sem service worker) e a instalação vira atalho sem manifest; isso é tarefa futura.

## 6. Estratégia de build Android
| Opção | Como | Custo / requisitos | Prós | Contras |
|---|---|---|---|---|
| **Local: `expo prebuild` + Gradle** | `npx expo prebuild -p android` e `cd android; .\gradlew assembleDebug` (ou `npx expo run:android`) | R$ 0; sem conta Expo; usa CPU, RAM e **disco** do PC | Funciona no Windows; offline; keystore e código nunca saem da máquina | Builds pesados no PC; o ambiente é responsabilidade sua |
| `eas build --local` | CLI do EAS rodando o pipeline na sua máquina | Exige conta Expo e `eas login`; **Windows não é suportado** (só macOS/Linux; WSL sem suporte oficial) | Mesmo pipeline da nuvem | Não serve para esta máquina |
| EAS Build (nuvem) | `eas build -p android` | Plano Free: até 15 builds Android, fila de baixa prioridade, timeout de 45 min; exige conta e envia o código para a Expo | Não usa o PC | Depende de conta e de terceiros; código e credenciais vão para a nuvem da Expo |

**Recomendação: build local (prebuild + Gradle).** É o único caminho de custo zero que funciona no Windows sem conta, combina com o princípio de privacidade (nada sai da máquina) e mantém a keystore sob seu controle (`docs/ASSINATURA.md`). O EAS na nuvem fica como plano B se o PC ficar sem espaço.
**Expo Go não serve:** SQLCipher (`useSQLCipher`) "is not supported on Expo Go", e o Expo Go das lojas ainda está no SDK 57.

## 7. Build Android (debug) e SQLite nativo
**Aparelho:** OPPO CPH2699, Android 16 (API 36), ColorOS V16.0.0, arm64-v8a (via USB, `adb devices` → `286d3e7d device`).

```powershell
# app.json: android.package = "com.kaynansouza.financasecasa" (PROVISÓRIO, exigido pelo prebuild)
npx expo prebuild --platform android --no-install
# android/local.properties (gerado, fora do git):
#   sdk.dir=C:/Users/kayna/AppData/Local/Android/Sdk
#   cmake.dir=C:/Users/kayna/AppData/Local/Android/Sdk/cmake/4.1.2
cd android; .\gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a,x86_64
adb install -r app\build\outputs\apk\debug\app-debug.apk
npx expo start            # o APK de debug carrega o JS do Metro
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d "appfinancascasa://proto-sqlite" com.kaynansouza.financasecasa
```

| Tentativa | Resultado | Causa / ação |
|---|---|---|
| 1. Gradle 9.4.1 + CMake 3.22.1, caminho original | **FALHOU** (4 min 15 s) | `ninja: error: mkdir(...worklets...): No such file or directory`: o caminho do objeto C++ repete o caminho do projeto e passa de 260 caracteres (MAX_PATH). O ninja 1.10.2 do CMake 3.22.1 ignora o `LongPathsEnabled=1`, que **já estava ativo** no Windows. |
| 2. `subst W:` | **FALHOU** | O autolinking do Expo não encontra o `package.json` na raiz da unidade (`Couldn't find "package.json" up from path "W:\android"`). |
| 3. Junction `C:\fc` | **FALHOU** | O Node/CMake resolvem o caminho real, então o erro de MAX_PATH continua. |
| 4. Cópia em `C:\dev\fc` | **FALHOU** | Passou do worklets, mas o codegen do `react-native-gesture-handler` ainda estoura o limite. |
| 5. **CMake 4.1.2 (ninja 1.12.1)** instalado pelo Kaynan no SDK Manager + `cmake.dir` no `local.properties`, caminho original | **BUILD SUCCESSFUL** em 4 min 59 s | Solução definitiva. Atenção: no `.properties`, use `/` nos caminhos (`\` vira escape e quebra o build). |

- APK de debug: **150 MB** (2 ABIs, símbolos de debug, sem o JS embutido).
- Instalado no OPPO com `adb install`: **Success**, sem pedir confirmação na tela.
- **O app abre** (tela capturada por `adb exec-out screencap`).
- **SQLite nativo OK:** `PROTO_SQLITE_OK platform=android sqlite=3.53.3`. Depois de `am force-stop` e reabrir, os dados persistiram (2 linhas).
- Não testado: build **release** (com o JS embutido e assinatura própria, ver `docs/ASSINATURA.md`), SQLCipher (`useSQLCipher`), emulador (não foi necessário com o aparelho real).
- Pendências para o projeto: (a) o `cmake.dir` precisa virar configuração reproduzível (config plugin ou variável de ambiente), já que `android/` é gerado; (b) a doc sugere `npx expo run:android`, que faz prebuild + build + install, mas aqui o build foi pelo Gradle direto para controlar as ABIs.
- Limpeza: app desinstalado do OPPO, `android/`, `dist/`, `.cxx` e a cópia em `C:\dev\fc` apagados; `adb reverse` removido; Metro e daemons do Gradle encerrados.

## 8. iPhone (PWA)
- **Não precisa de Mac nem de conta Apple** para o PWA. O "iOS 16.4+ / Xcode 26.4+" do SDK 58 vale só para app nativo, que não faz parte do plano.
- **O que é preciso:** um iPhone com Safari e o site servido por **HTTPS** (`*.pages.dev` já é HTTPS). Para instalar: Compartilhar → "Adicionar à Tela de Início". No iOS 26, todo site adicionado abre como web app por padrão.
- **Versões informadas:** iOS 26.x e iOS 18.x.
- **Limitações confirmadas na doc do WebKit:**
  - Notificações em web apps (iOS 16.4+) existem **só via Web Push**, que passa pelo Apple Push Notification service. Isso exige um servidor que envie o push. **Não há notificação local agendada sem servidor**, o que confirma a degradação de A-03, A-04, A-05 e S-04 no iPhone.
  - Armazenamento (política do Safari 17+): web apps da Tela de Início têm as mesmas cotas do navegador. O despejo é por origem, do menos usado recentemente, e acontece por pressão de disco ou inatividade. Origens em "modo persistente" ficam fora do despejo, e estar instalado na Tela de Início conta a favor ao pedir `navigator.storage.persist()`. Web apps da Tela de Início têm armazenamento **separado** do Safari.
  - **Não testado:** OPFS e `SharedArrayBuffer`/COOP-COEP no Safari do iOS 18 e 26 (o protótipo só rodou no Chrome do Windows).

## 9. Ferramentas de teste
- **Unitário:** a doc do Expo (SDK 58) documenta só **Jest com o preset `jest-expo`**: no SDK 58 ele exige Jest 30 (`npx expo install jest-expo jest @types/jest "--" --dev`). Vitest não é mencionado.
  - **Recomendação:** `jest-expo` como runner único. Os testes de `src/core` rodam nele sem React; os de UI, com `@testing-library/react-native`. **Não instalado:** precisa da sua aprovação (AGENTS.md §9).
- **E2E web:** Playwright faz sentido para o PWA (OPFS, headers, offline com service worker). Recomendo adiar: ele baixa navegadores (centenas de MB) e o disco está no limite.

## 10. Riscos novos encontrados
- **R-WEB-1:** dados do PWA em OPFS podem ser despejados (`persisted() = false` no Chrome; heurística no Safari). Mitigar com `navigator.storage.persist()` e backup F-06. Testar no iPhone.
- **R-WEB-2:** SQLCipher **não existe no web** (doc do expo-sqlite: "unavailable in Expo Go and on web"). A criptografia do banco no PWA precisa de outro desenho (F-03).
- **R-WEB-3:** COEP `credentialless` bloqueia recursos cross-origin sem CORP/CORS. Hoje não afeta nada, porque não há recursos externos.
- **R-AND-1:** o `AndroidManifest` gerado pelo prebuild vem com `android:allowBackup="true"`. O F-03 exige `false` (via config plugin, no PBI F-03).
- **R-ENV-1:** builds nativos no Windows exigem o CMake ≥ 4.1.2 (ninja com suporte a caminhos longos) e `cmake.dir` configurado; sem isso, o build quebra por MAX_PATH.
- **R-ENV-2:** o npm 12 bloqueia scripts de `postinstall` por padrão (`workerd`). O `wrangler pages dev` funcionou mesmo assim, porque o binário vem num pacote opcional.
