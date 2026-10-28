---
name: expo-app
description: Use ao criar telas/rotas, mexer em app.json, scripts do package.json, rodar o app (Android nativo ou web), gerar development build, rodar expo-doctor ou adicionar QUALQUER dependência.
---

# expo-app — Projeto Expo (SDK 58) do Casa em Dia

## Objetivo
Manter o app Expo (React Native + TypeScript + Expo Router) funcionando igual no **Android nativo** e no **PWA web**, sem Expo Go.

## Fatos do projeto (verificados na Fase 1)
- SDK 58, RN 0.88, React 19.3, TS 6.0. Template `default@sdk-58`.
- Rotas em **`src/app`** (Expo Router). Telas não têm regra de negócio.
- `app.json`: `name` "Casa em Dia", `slug` `casa-em-dia`, `scheme` `casaemdia`, `android.package` `com.kaynansouza.financasecasa` (**não mudar**: é a identidade do app), `web.output` **`"static"`**.
- Scripts: `npm run android` (= `expo run:android`), `npm run web`, `npm test` (jest-expo), `npm run lint`.
- Expo Go **não** é usado (Expo Go das lojas no SDK 57; SQLCipher não roda nele).

## Passo a passo
### Rodar no web
1. `npx expo start --web` (dev) → http://localhost:8081.
2. Build estático: `npx expo export --platform web` → `dist/`.
3. Servir como no Cloudflare: `npx wrangler pages dev dist --port 8788 --compatibility-date=<data>`.

### Rodar no Android (development build local)
1. `npx expo prebuild --platform android` (gera `android/`, que fica fora do git).
2. Garantir `android/local.properties` com **barras normais**:
   `sdk.dir=C:/Users/kayna/AppData/Local/Android/Sdk` e `cmake.dir=C:/Users/kayna/AppData/Local/Android/Sdk/cmake/4.1.2`.
3. `cd android; .\gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a` (o OPPO é arm64).
4. `adb install -r app\build\outputs\apk\debug\app-debug.apk`; `npx expo start`; `adb reverse tcp:8081 tcp:8081`.
5. Deep link para uma rota: `adb shell am start -a android.intent.action.VIEW -d "casaemdia://<rota>" com.kaynansouza.financasecasa`.
   (Alternativa: `npx expo run:android` faz tudo, mas compila todas as ABIs.)

### Adicionar dependência (obrigatório seguir)
1. Verificar a **documentação atual** da lib: suporte a **Android E web**, se exige config plugin, se roda sem rede.
2. Avisar o Kaynan com a justificativa: tamanho (bundle web + nativo), manutenção, licença (compatível com GPL-3.0), plataformas.
3. Instalar com `npx expo install <pkg>`. Para dev: no **PowerShell**, `npx expo install <pkg> "--" --dev`. No **bash** isso NÃO funciona; mover para `devDependencies` à mão e rodar `npm install`.
4. Rodar `npx expo-doctor@latest`, `npx tsc --noEmit` e `npm test`.
5. Se tiver config plugin, conferir `app.json` → `plugins` e rebuildar o nativo.

## Checklist de qualidade
- [ ] `npx expo-doctor@latest` 20/20.
- [ ] `npx tsc --noEmit` sem erros; `npm test` verde.
- [ ] `npx expo export --platform web` gera `dist/` sem URL externa (`grep -o 'https\?://' dist/*.html`).
- [ ] Nada de import nativo fora de `src/platform` (ver skill `platform-adapters`).
- [ ] Comportamento declarado em `docs/matriz-paridade.md`.

## Armadilhas reais (Fase 1)
- **MAX_PATH no Windows:** o CMake 3.22.1 (ninja 1.10.2) quebra o build com `ninja: error: mkdir(...): No such file or directory`, mesmo com `LongPathsEnabled=1`. Solução: CMake **4.1.2** + `cmake.dir`. `subst`, junction e cópia em caminho curto **não** resolvem.
- `local.properties` com `\` vira escape → "A sintaxe do nome do arquivo... está incorreta". Use `/`.
- `prebuild` exige `android.package`; ele também troca os scripts para `expo run:*`.
- O manifest gerado vem com `android:allowBackup="true"`: o F-03 exige `false` via config plugin.
- O template veio com `web.output: "server"`, que exige servidor. Manter `"static"`.
- O APK de debug **não** embute o JS: precisa do Metro e de `adb reverse`. Com a tela do celular bloqueada, o app não executa.
- Encerrar processos que você iniciou: `TaskStop` às vezes deixa o `node` (Metro) e o `workerd` vivos e segurando a porta. Matar pelo PID **conferindo a linha de comando**.
- O npm 12 bloqueia `postinstall` (ex.: `workerd`); avaliar antes de aprovar.

## Exemplo mínimo (nova rota)
```tsx
// src/app/settings.tsx — só UI; regras vêm de src/modules/src/core
import { Text, View } from 'react-native';
export default function Settings() {
  return (
    <View accessibilityRole="summary">
      <Text>Configurações</Text>
    </View>
  );
}
```
