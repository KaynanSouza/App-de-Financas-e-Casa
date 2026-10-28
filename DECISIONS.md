# DECISIONS.md — Registro de decisões

> **A PREENCHER NA DESCOBERTA** (decisões formais em formato ADR).
> Formato: `ADR-NNN — Título` · Data · Status (proposta / aceita / substituída) · Contexto · Decisão · Consequências.

## Decisões já tomadas pelo humano (a formalizar como ADR)

### ADR-001 — Expo em vez de Capacitor
- Data: 27/10/2026 · Status: aceita (pelo humano), a formalizar
- Decisão: Expo (React Native + TypeScript + Expo Router), um código. Android nativo; iPhone via PWA estático no Cloudflare Pages. Local-first mantido; nenhum servidor de dados.
- Consequência: o backlog cita Capacitor; essas menções viram "intenção a reinterpretar" (lista abaixo).

### ADR-002 — Estrutura de pastas provisória
- Data: 27/10/2026 · Status: aceita como provisória
- Contexto: a "Estrutura de pastas alvo (seção 0.5)" não foi fornecida; o humano aprovou a estrutura proposta pelo agente.
- Decisão: `src/{app,core,modules,platform,storage,ui}`, `docs/`, `tests/fixtures/`. Diferença da proposta: as rotas ficam em **`src/app`** (padrão do template `default@sdk-58`), e não em `app/` na raiz.
- Pendente: confirmar contra a seção 0.5 original, se existir.

### ADR-003 — Saída web estática
- Data: 27/10/2026 · Status: aceita
- Decisão: `expo.web.output = "static"` (o template vem com `"server"`, que exige servidor). Exportação: `npx expo export --platform web` → `dist/`.

### ADR-004 — Development build local, sem Expo Go
- Data: 28/10/2026 · Status: aceita (pelo humano)
- Contexto: o humano queria testar no Expo Go, mas o Expo Go das lojas está no SDK 57 (o projeto é SDK 58) e o SQLCipher não roda no Expo Go.
- Decisão: development build no SDK 58, gerado **localmente** (`expo prebuild` + Gradle). EAS na nuvem fica como plano B. O `eas build --local` não suporta Windows.
- Consequência: exige o CMake ≥ 4.1.2 no SDK e `cmake.dir` configurado (MAX_PATH; ver `docs/PROVA-DE-VIDA.md` §7). Isso precisa virar configuração reproduzível.

### ADR-005 — `android.package` provisório
- Data: 28/10/2026 · Status: **proposta (pendente de confirmação)**
- Decisão provisória: `com.kaynansouza.financasecasa`, exigido pelo `prebuild`.
- Pendente: confirmar antes da primeira distribuição. O package e a chave de assinatura formam a identidade do app; trocar depois obriga a reinstalar.

### ADR-006 — Deploy do PWA por Direct Upload (wrangler)
- Data: 28/10/2026 · Status: **proposta (recomendação do agente)**
- Decisão proposta: Cloudflare Pages via `wrangler pages deploy` (sem integração Git). Nada publica sem comando explícito, e o build é local.
- Consequência: um projeto Direct Upload não migra para a integração Git depois.

### ADR-007 — Sem fallback SPA em `_redirects`
- Data: 28/10/2026 · Status: aceita (verificado)
- Contexto: o `/* /index.html 200` é ignorado pelo Pages ("Infinite loop detected"), e o Pages já faz fallback SPA quando não existe `404.html`.
- Decisão: `public/_redirects` sem regras; nunca gerar `404.html` sem rever esse comportamento.

### ADR-008 — Runner de testes
- Data: 28/10/2026 · Status: **proposta (pendente de aprovação para instalar)**
- Proposta: `jest-expo` (Jest 30) como runner único, que é o único documentado pelo Expo SDK 58. Playwright para o e2e web, numa etapa posterior.

## Pontos do backlog que a nova arquitetura invalida ou muda (NÃO resolvidos)

| # | Ponto do backlog | O que muda |
|---|---|---|
| 1 | Escopo/Decisões: "App nativo via Capacitor", "Plugins nativos do Capacitor" | Vira Expo; cada plugin precisa de equivalente Expo/RN **e** web. |
| 2 | Decisão em aberto "iPhone" (conta paga, app expira em 7 dias) e "versão iOS" na R3 | iPhone passa a ser PWA. Entra no MVP? O critério de saída do MVP cita só Android. |
| 3 | F-01 biometria/PIN, chave liberada após autenticação | PWA sem Keystore; biometria só via WebAuthn (incerto). Ocultar em recentes e bloquear print não existem na web. |
| 4 | F-03 SQLCipher, chave no Keystore, `allowBackup` | Sem SQLCipher nem Keystore no PWA; criptografia teria de ser feita na aplicação. `allowBackup` só vale no Android. |
| 5 | Arquitetura: "não usar IndexedDB/localStorage da WebView" | No Android nativo não há WebView. No PWA, o armazenamento do navegador é a única opção, e o risco de o Safari limpar dados volta. |
| 6 | F-04 exportar (seletor de compartilhamento) e apagar (notificações e chave) | Compartilhar no PWA via Web Share/download; no PWA não há notificações agendadas para apagar. |
| 7 | F-06 backup: Argon2id/AES-GCM, restaurar em outro aparelho | O formato precisa ser idêntico nas duas plataformas (Android ↔ iPhone). WebCrypto não tem Argon2id. O lembrete mensal por notificação não funciona no PWA. |
| 8 | F-07 "APK de teste cedo", porte do Épico 1 e 2 | Build via Expo (dev build/EAS/local) **e** build web; o porte mira `src/core` puro. |
| 9 | C-01 parsing em Web Worker; aviso por notificação em segundo plano | React Native não tem Web Worker; no PWA não há execução em segundo plano nem notificação local. |
| 10 | C-02 "perfis chegam com atualização do APK" | No PWA, a atualização vem por deploy e cache do service worker. Versionar perfis. |
| 11 | C-06 meta < 2 s com 10 mil transações | Meta precisa ser validada também no armazenamento do PWA. |
| 12 | A-03 alarmes exatos, bateria, canais, "Meus alertas estão funcionando?" | Android puro; no PWA quase tudo é N/A. |
| 13 | A-04 motor de lembretes; reagendar após reboot; nota "iOS limite 64" | No PWA, provavelmente não há notificação local agendada sem servidor de push. O limite de 64 era do app iOS nativo e deixa de se aplicar. |
| 14 | A-05 ações na notificação | Depende de 13; provável ausência no PWA. |
| 15 | S-04 lembretes de renovação/teste | Mesmo problema de 13 no PWA. |
| 16 | S-01 cotação por API gratuita (opcional) | No PWA, sujeito a CORS e CSP; manter manual como padrão. |
| 17 | L-01 "funciona totalmente offline no mercado" | O PWA precisa de service worker, que o Expo não gera por padrão. |
| 18 | L-02 "plugins de Arquivos e Compartilhar do Capacitor" | Equivalentes Expo (native) e Web Share/download (web). |
| 19 | L-03 EAN pela câmera | No PWA, câmera via getUserMedia mais decodificador JS; suporte do Safari a verificar. |
| 20 | L-07 (R3) QR da NFC-e e consulta SEFAZ | No PWA, CORS bloqueia a SEFAZ sem um servidor/proxy, o que contraria o local-first. |
| 21 | L-08 "Abrir com" (WhatsApp/e-mail/Drive) | Intent filter no Android; o PWA no iOS provavelmente não recebe arquivos (só o seletor dentro do app). |
| 22 | Riscos: "correções chegam via nova versão do APK"; "perda da chave de assinatura do APK"; "limite de 64 no iOS" | Novos riscos: limpeza de armazenamento no Safari, PWA preso em cache antigo e dependência da conta Cloudflare para servir o app. |
| 23 | Roadmap/Sprints e critério de saída do MVP (só Android) | Precisa incluir (ou excluir explicitamente) a validação no iPhone/PWA. |
| 24 | Princípio "sem hospedagem" | O Cloudflare Pages passa a hospedar os arquivos estáticos (sem dados). É uma dependência nova para a primeira carga e as atualizações. |

Todos os itens marcados "provável" ainda precisam ser confirmados na documentação atual.
