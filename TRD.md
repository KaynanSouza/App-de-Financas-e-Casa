# TRD — Technical Requirements Document

> **A PREENCHER NA DESCOBERTA**

## 0. Ambiente e aparelhos de teste (registrado em 27/10/2026, Fase 1 — Verificação)

### Aparelhos
| Plataforma | Aparelho | Versão do SO | Observação |
|---|---|---|---|
| Android (real, principal) | **OPPO CPH2699** (lido via `adb shell getprop`), ABI arm64-v8a | **Android 16 (API 36)**, ColorOS V16.0.0, build CPH2699_16.0.5.1200(EX01) | ColorOS é conhecida por matar processos em segundo plano: aparelho prioritário para testar A-03/A-04. Não tem a opção "Instalar via USB"; a instalação por `adb` pode pedir confirmação na tela. |
| Android (outros) | aparelhos dos amigos, a informar | — | Necessário para A-03/A-04 (outros fabricantes) e para F-06 (restaurar em outro aparelho). |
| Android (emulador) | AVD `Medium_Phone_API_37.0` (x86_64) | Android API 37 | Só para a prova de vida; não substitui o aparelho real. |
| iPhone (teste e amigos) | modelos a informar | **iOS 26.x e iOS 18.x** | PWA pelo Safari. O "iOS 16.4+" do SDK 58 vale só para app nativo; para o PWA vale o WebKit de cada versão. |

### Máquina de desenvolvimento
Ver `docs/PROVA-DE-VIDA.md` (versões de Node, JDK, Android SDK, Gradle e wrangler).

### Estratégia de build Android
Build **local** (`npx expo prebuild -p android` + `gradlew`), sem conta Expo. Justificativa em `docs/PROVA-DE-VIDA.md` §6.
**Expo Go não é usado**: SQLCipher e outros módulos nativos exigem development build, e o Expo Go das lojas ainda está no SDK 57.

## 1. Stack
> **A PREENCHER NA DESCOBERTA**

## 2. Arquitetura
> **A PREENCHER NA DESCOBERTA** (resumo atual em `ARCH.md`)

## 3. Modelo de dados
> **A PREENCHER NA DESCOBERTA**

## 4. Segurança e ameaças
> **A PREENCHER NA DESCOBERTA** (inclui STRIDE pedido em F-03)

## 5. Notificações
### 5.1 Android
> **A PREENCHER NA DESCOBERTA**
### 5.2 iOS (PWA)
> **A PREENCHER NA DESCOBERTA**

## 6. Desempenho
> **A PREENCHER NA DESCOBERTA**

## 7. Testes
> **A PREENCHER NA DESCOBERTA**

## 8. Build Android
> **A PREENCHER NA DESCOBERTA**

## 9. Build web e deploy no Cloudflare Pages
> **A PREENCHER NA DESCOBERTA**

## 10. Versionamento de esquema e de formatos
> **A PREENCHER NA DESCOBERTA** (esquema SQLite, backup F-06, CSV da lista L-02)
