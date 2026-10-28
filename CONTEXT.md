# CONTEXT.md — Visão em uma página

## Visão
Uma única fonte de verdade, **privada**, para o dinheiro e a rotina da casa. O dado que entra por um módulo alimenta os outros: o CSV do banco revela assinaturas e contas recorrentes, que geram lembretes, e a lista de compras mostra quanto custa cada mercado.

**Quem usa:** o autor e alguns amigos. Cada pessoa instala no próprio celular e tem os próprios dados, isolados por natureza: não existe conta, lar nem servidor. Sem cobrança, sem planos, sem escala como meta.

## Escopo do MVP (fonte: backlog de 15/10/2026)
- **Fundação:** bloqueio por biometria/PIN (F-01), banco criptografado (F-03), exportar/apagar dados (F-04), log local de diagnóstico (F-05), backup criptografado e restauração (F-06), porte do núcleo existente (F-07).
- **Importação (já concluída em outra arquitetura, portar):** CSV com detecção de formato, perfis de banco, deduplicação, categorização por regras, correção com aprendizado, dashboard (C-01 a C-06).
- **Contas e alertas:** cadastro e recorrência (A-01), permissões e confiabilidade (A-03), motor de lembretes locais (A-04), ações rápidas (A-05).
- **Assinaturas:** cadastro (S-01), detecção no CSV (S-02), dashboard de custo (S-03), lembretes de renovação (S-04).
- **Compras:** listas (L-01), exportar CSV (L-02), catálogo (L-03), registro de preço (L-04), histórico/comparativo (L-05), importar e mesclar CSV (L-08).
- **R2:** A-02, C-07, S-05. **R3:** L-07 (cupom fiscal).

## Fora de escopo
Servidor de dados, login/conta/2FA, lar e convites, RLS, sincronização automática ou tempo real, Telegram/WhatsApp/e-mail/push remoto/feed ICS, Open Finance, LLM externo, analytics/telemetria, cobrança.

## Plataformas
- **Android:** app nativo Expo (development build / APK instalado direto, sem Play Store por enquanto). SQLite com SQLCipher, chave no Keystore, notificações locais agendadas.
- **iPhone:** **PWA estático** (`expo export -p web`) hospedado no Cloudflare Pages e instalado pelo Safari ("Adicionar à Tela de Início"). O Cloudflare só serve arquivos estáticos; **nenhum dado passa por ele**.
- Um único código: Expo + React Native + TypeScript + Expo Router.
- Capacidades que não existem no PWA (ex.: notificação local agendada) recebem **degradação explícita** registrada em `docs/matriz-paridade.md`.

## Princípios
1. **Offline total.** Nenhuma chamada de rede obrigatória; funciona em modo avião (o PWA, após a primeira carga).
2. **Dados só no aparelho.** Saem apenas por ação do usuário: backup (F-06), exportação (F-04), CSV da lista (L-02).
3. **Centavos inteiros**, nunca ponto flutuante.
4. **Fuso America/Sao_Paulo** para datas contábeis.
5. **Eventos internos em vez de chamadas diretas:** a importação publica `transaction.imported`; assinaturas e contas reagem sem a importação conhecê-las.
6. **Reagendar em vez de confiar em timers:** alertas são reconstruídos ao abrir o app, ao reiniciar o aparelho, ao mudar dados e ao restaurar backup; reagendar é idempotente.
7. **Portabilidade:** regra de negócio em `src/core` (TS puro); plataforma em `src/platform` atrás de interfaces.

## Documentos
`AGENTS.md` (regras) · `ARCH.md` (arquitetura) · `SESSION.md` (estado atual) · `BRD.md` · `TRD.md` · `UX.md` · `DECISIONS.md` · `docs/matriz-paridade.md` · `docs/backlog-local-first.pdf`.
