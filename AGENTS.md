# AGENTS.md — Regras para agentes neste repositório

Projeto pessoal **App de Finanças e Casa (local-first)**. Autor: Kaynan Macedo de Souza. O humano está sempre no controle.

## 1. Idioma
- Responder e documentar em **português do Brasil**.
- Código, nomes de variáveis, arquivos de código, commits, tabelas e colunas do banco em **inglês**.

## 2. Fluxo de trabalho
- **Antes de agir:** ler `SESSION.md`, `CONTEXT.md` e o PBI/etapa relacionados (backlog em `docs/backlog-local-first.pdf`; arquitetura atual em `ARCH.md`).
- **Ao terminar:** atualizar `SESSION.md` (fase, última ação, próximo passo, bloqueios, decisões pendentes).
- **Uma etapa por vez.** Só avançar quando a etapa atual passar nos testes e o humano aprovar.
- **Ao terminar uma tarefa, reportar:** o que foi feito; o que foi testado; o que **não** foi testado (e em qual plataforma: Android / iPhone-PWA); próximo passo.
- Decisões de arquitetura ou de escopo vão para `DECISIONS.md` (formato ADR curto), com data.

## 3. Requisitos
- Nunca inventar requisito. Quando faltar informação, **perguntar**.
- Apontar contradições entre backlog, `CONTEXT.md`, `ARCH.md` e a mensagem do humano. O backlog é a fonte de verdade do **escopo funcional**; a arquitetura vigente é a de `ARCH.md`/`DECISIONS.md` (Expo, não Capacitor).

## 4. Portabilidade (regra de arquitetura)
- Lógica de negócio **só** em `src/core`: TypeScript puro, sem `react`, `react-native`, `expo-*` nem `src/platform`.
- Código dependente de plataforma **só** em `src/platform`, atrás de uma interface (`index.ts`), com adaptadores `<cap>.native.ts` e `<cap>.web.ts`.
- **Nenhum import de módulo nativo fora de `src/platform`.**
- Módulos de produto (`src/modules/*`) conversam por eventos internos (`src/core/events`), não por chamadas diretas entre si.
- Rotas/telas ficam em `src/app` (Expo Router). Telas não contêm regra de negócio.

## 5. Paridade de plataforma
- Toda feature declara seu comportamento no **Android** e no **iPhone/PWA** em `docs/matriz-paridade.md`.
- Se uma capacidade não existir em uma plataforma, **propor uma degradação explícita e avisar o humano**. Nunca ignorar em silêncio.

## 6. Dados e privacidade
- **Nunca** colocar dado financeiro real em log, teste, fixture, commit, issue ou mensagem de erro. Usar dados sintéticos/anonimizados (`tests/fixtures/`).
- Números de conta/cartão sempre mascarados (4 últimos dígitos) em UI e logs.
- Dinheiro sempre em **centavos inteiros**, nunca float.
- Datas contábeis no fuso **America/Sao_Paulo**.

## 7. Rede
- Nenhuma chamada de rede obrigatória em runtime. O app funciona em modo avião.
- Proibido: analytics, telemetria, crash reporting remoto, CDN de terceiros, fontes remotas.
- O PWA deve funcionar em modo avião depois da primeira carga.
- Exceção opcional já prevista no backlog: atualizar cotação de moeda (S-01), sempre com valor manual como alternativa.

## 8. Deploy, publicação e segredos
- **Nunca** fazer deploy de produção no Cloudflare Pages nem publicar APK sem comando explícito do humano.
- Deploys de preview só quando a etapa pedir e depois de avisar o humano.
- **Nunca** pedir, ler, imprimir ou gravar tokens, senhas ou chaves (Cloudflare, EAS, keystore de assinatura). Login em Cloudflare/EAS é feito pelo humano.
- Nunca versionar keystores, `credentials.json`, `.env*`, `.wrangler/`, CSVs reais, dumps, backups, `dist/` ou builds (ver `.gitignore`).

## 9. Dependências
- Não adicionar dependência sem justificar e sem avisar: tamanho no bundle web e nativo, manutenção, licença (compatível com GPL-3.0), suporte a **web E Android**.
- Instalar libs do Expo com `npx expo install` para casar com a versão do SDK.
- Verificar a **documentação atual** de cada biblioteca do Expo/React Native e de cada API web antes de usá-la. Não confiar em memória, especialmente para suporte por plataforma.

## 10. Git
- Commits pequenos, **Conventional Commits**, citando o PBI (ex.: `feat(bills): recurrence rules (A-01)`).
- Branch principal: `main`.
