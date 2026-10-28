# SESSION.md — Estado da sessão

**Atualizado em:** 28/10/2026

## Fase atual
**Fase 1 concluída. Próximo passo: Fase 2 — Descoberta (Prompt 2).**

## Última ação
- Etapas "Setup das Skills" e "Gestão das Skills": 13 skills em `/skills` (+ `skills/README.md` com índice e regras de gestão); `AGENTS.md` referencia `/skills`.
- Fase 1, em resumo (detalhes em `docs/PROVA-DE-VIDA.md`):
  - Estrutura Expo SDK 58; ambiente verificado (Node 24.16.0, JDK 17, Android SDK, **CMake 4.1.2**, `expo-doctor` 20/20, wrangler 4.154.0).
  - APK de debug no **OPPO CPH2699 (Android 16)** com SQLite nativo OK; SQLite web (OPFS) OK.
  - Preview publicado: https://preview.casa-em-dia-44l.pages.dev (projeto Pages clássico `casa-em-dia`, criado com `--force`). Teste manual do Kaynan: "está tudo correto". Produção NÃO publicada.
  - Nome comercial **Casa em Dia** (package neutro `com.kaynansouza.financasecasa`); `jest-expo` instalado.

## Próximo passo
Fase 2 — Descoberta (Prompt 2): o Kaynan informa o local do código dos Épicos 1 e 2 (F-07); preencher BRD/TRD/UX/DECISIONS.

## Bloqueios
- Nenhum.

## Decisões pendentes (levar para a Descoberta)
1. **Criptografia do banco no PWA** (SQLCipher não existe no web; OPFS com `persisted() = false`): spike entre criptografia por campo, snapshot cifrado ou VFS cifrado (skill `sqlite-web-encrypted`).
2. **Alertas no iPhone** (sem notificação local no PWA): avisos dentro do app, exportação `.ics` ou ambos (skill `alerts-android-and-ios`). O `.ics` precisa de confirmação, porque o feed ICS saiu do escopo.
3. **KDF do backup e do PIN:** PBKDF2 (WebCrypto) ou Argon2id (dependência) (skill `backup-cross-platform`).
4. Antes da produção: Pages clássico ou migrar para Workers (ADR-006).
5. iPhone/PWA no critério de saída do MVP; os 24 pontos de impacto (DECISIONS.md).
6. Manifest e service worker do PWA; CSP restritiva.
7. `allowBackup=false` (F-03); `cmake.dir` reproduzível, já que `android/` é gerado.
8. Teste de fronteira (`src/core` sem react/expo; módulos nativos só em `src/platform`).
9. Dependências extras do template e as 8 vulnerabilidades do `npm audit`.
10. Idioma das mensagens de commit: o AGENTS.md diz inglês, mas os prompts ditam mensagens em português. Hoje vale a mensagem ditada; confirmar a regra.
11. Local do código dos Épicos 1 e 2 (F-07).

## Não testado
- OPFS / SharedArrayBuffer / `persist()` no **Safari do iOS** com banco (o preview atual não usa SQLite).
- Build **release** assinado; SQLCipher; lembretes em aparelho real.
- As skills foram escritas, mas nenhuma foi exercitada ainda numa tarefa real.
