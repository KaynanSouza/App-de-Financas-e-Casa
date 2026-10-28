# Assinatura do APK Android — gerar e guardar a keystore

> **AVISO CRÍTICO:** o Android só aceita uma atualização de app se ela for assinada com a **mesma chave** do APK já instalado.
> **Perder a keystore (ou a senha) = nunca mais conseguir atualizar o app instalado no seu celular e no dos amigos.** A única saída é desinstalar (o que **apaga os dados locais**, se não houver backup F-06) e instalar um app novo.
> Como o app é distribuído por APK direto (sem Play Store), **não existe** o "reset de upload key" do Google Play.

Fonte: <https://reactnative.dev/docs/signed-apk-android> (consultado em 27/10/2026).

## Regras
- A keystore, as senhas e o alias **nunca** entram no repositório. O `.gitignore` bloqueia `*.jks`, `*.keystore`, `*.p12`, `*.key`, `credentials.json` e `.env*`.
- O agente (IA) **não** gera, lê, guarda nem recebe a keystore ou as senhas. Quem executa os passos abaixo é o Kaynan.
- O build de debug usa a `debug.keystore` automática do Android, que **não** serve para distribuir.
- O `package` Android (`com.kaynansouza.financasecasa`, ainda **provisório**) precisa estar decidido antes da primeira distribuição, porque ele e a chave formam a identidade do app.

## 1. Gerar (uma única vez)
Faça isso em uma pasta **fora** do repositório (ex.: `%USERPROFILE%\keys\financas-casa\`):

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\keys\financas-casa"
cd "$env:USERPROFILE\keys\financas-casa"
& "$env:JAVA_HOME\bin\keytool.exe" -genkeypair -v -storetype PKCS12 `
  -keystore financas-casa-release.keystore -alias financas-casa `
  -keyalg RSA -keysize 2048 -validity 10000
```

- O `keytool` pede a senha da keystore e os dados do certificado (nome etc.). Use uma senha forte, gerada pelo seu gerenciador de senhas.
- `-validity 10000` dá cerca de 27 anos de validade.
- No PKCS12, a senha da chave é igual à da keystore.

## 2. Usar no build (sem expor a senha)
Como a pasta `android/` é gerada pelo `expo prebuild` (e fica fora do git), a configuração de assinatura será definida no PBI de distribuição (F-07). A recomendação da doc do React Native é guardar as variáveis no arquivo **global** `%USERPROFILE%\.gradle\gradle.properties`, que nunca entra no git:

```properties
MYAPP_UPLOAD_STORE_FILE=C:\\Users\\<voce>\\keys\\financas-casa\\financas-casa-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=financas-casa
MYAPP_UPLOAD_STORE_PASSWORD=<digitada por você, não pelo agente>
MYAPP_UPLOAD_KEY_PASSWORD=<igual à acima, em PKCS12>
```

> Esse arquivo guarda a senha em texto claro no seu PC. Uma alternativa melhor (a decidir) é ler a senha de variável de ambiente só na hora do build.

## 3. Cópia segura (faça logo depois de gerar)
Guarde pelo menos **2 cópias em lugares diferentes**, sempre criptografadas:

1. **Gerenciador de senhas** (Bitwarden, 1Password, KeePassXC etc.): anexe o arquivo `.keystore` e guarde junto a senha e o alias.
2. **Mídia offline**: um pendrive com um contêiner criptografado (VeraCrypt ou um `.7z` com AES-256 e senha), guardado fora de casa ou em outro lugar físico.
3. (Opcional) Nuvem pessoal, **só dentro de um arquivo criptografado** (nunca o `.keystore` solto junto da senha).

Anote também, no gerenciador de senhas: alias, data de criação, `package` do app e a impressão digital SHA-256:

```powershell
& "$env:JAVA_HOME\bin\keytool.exe" -list -v -keystore financas-casa-release.keystore -alias financas-casa
```

## 4. Testar a cópia
Uma vez por ano, ou ao trocar de PC: restaure a keystore a partir da cópia, rode `keytool -list` e confira se a SHA-256 bate com a anotada.

## 5. Se a keystore vazar
Alguém poderia assinar um APK falso como "atualização". Nesse caso: gere uma nova chave, troque o `package` (vira outro app), avise os amigos, e cada um faz backup (F-06), desinstala o app antigo, instala o novo e restaura.
