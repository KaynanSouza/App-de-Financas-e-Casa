# CONTEXT.md — Visão em uma página · Casa em Dia

## Visão
**"Seu dinheiro e sua rotina num só lugar, privado."** (D-010)
Uma única fonte de verdade, **privada**, para o dinheiro e a rotina da casa. O dado que entra por um módulo alimenta os outros: o CSV do banco revela assinaturas e contas recorrentes, que geram lembretes, e a lista de compras mostra quanto custa cada mercado.

**Quem usa:** o autor e 3–5 amigos/familiares, maioria Android, perfil misto (jovens e familiares mais velhos), com necessidades de **fonte ampliada** e **daltonismo/baixa visão** (D-009). Cada pessoa instala no próprio celular e tem os próprios dados: não existe conta, lar nem servidor. Sem cobrança, custo zero (D-043).

## Escopo do MVP (BRD §4)
- **Fundação:** bloqueio PIN/biometria (F-01), banco criptografado (F-03), exportar/apagar (F-04), log local (F-05), backup em formato único Android ↔ iPhone (F-06), núcleo local **reescrito** (F-07, D-036).
- **Importação (reescrita, D-036):** CSV de Nubank, C6, Santander, BB, Itaú e Bradesco; perfis; dedupe; categorização; correção com aprendizado; dashboard (C-01..C-06).
- **Contas e alertas:** A-01, A-03, A-04, A-05 (Android); faixa no app + `.ics` no iPhone (D-001).
- **Assinaturas:** S-01..S-04, cotação manual (D-032).
- **Compras:** L-01..L-05, L-08.
- **R2:** A-02, C-07, S-05, X-01 Orçamento, passkey no iPhone (se o E-02 aprovar), feriados. **R3:** L-07 (só Android), X-02 Metas, X-03 Divisão de despesas.
- Ordem de corte: D-013. Sucesso: amigos usam sem ajuda + critérios técnicos (D-012).

## Fora de escopo
Servidor de dados, login/conta/2FA, lar e convites, sincronização, Web Push/servidor de notificações, Telegram/WhatsApp/e-mail, feed ICS online, Open Finance, LLM externo, analytics/telemetria, CDN/fontes de terceiros, cotação online no MVP, checagem online de versão, lojas de apps, domínio próprio, PWA no Android, cobrança.

## Plataformas
- **Android:** app nativo Expo (development build / APK assinado enviado pelo Kaynan, Android 10+). SQLite + SQLCipher, chave no Keystore, notificações locais, biometria. Recursos exclusivos permitidos, com degradação declarada no iPhone (D-005).
- **iPhone:** **PWA estático** no Cloudflare Pages (`casa-em-dia-44l.pages.dev`), **instalação na Tela de Início obrigatória**, iOS 18+. Sem notificação local: faixa no app + `.ics` para o Calendário; backup lembrado semanalmente (D-001, D-002). O Cloudflare só serve arquivos; o código do front é público, os dados não (D-006).
- Um único código: Expo SDK 58 + React Native + TypeScript + Expo Router.

## Princípios
1. **Offline total e zero rede** em runtime no MVP; o PWA funciona em modo avião após a 1ª carga.
2. **Dados só no aparelho.** Saem apenas por ação do usuário: backup, exportação, CSV da lista, `.ics`, sempre com aviso quando não criptografado.
3. **Centavos inteiros**, nunca ponto flutuante.
4. **Fuso America/Sao_Paulo** para datas contábeis; pt-BR fixo (`R$ 1.234,56`, `dd/mm/aaaa`).
5. **Eventos internos em vez de chamadas diretas** (`transaction.imported`).
6. **Reagendar em vez de confiar em timers** (Android); reagendar é idempotente.
7. **Portabilidade:** regra de negócio em `src/core`; plataforma em `src/platform` atrás de interfaces.
8. **Acessível por requisito:** TalkBack/VoiceOver, fonte 200%, AA, nunca só cor, alvos ≥ 48 (D-027).

## Estado atual
Fase 3 (Codificação): `PLAN.md` com 40 etapas aguardando aprovação. Próxima: **E-01** (esqueleto + pipeline); depois o spike **E-02** (criptografia web + KDF).

## Documentos
`AGENTS.md` (regras) · `/skills` · `ARCH.md` · `PLAN.md` · `SESSION.md` · `BRD.md` · `TRD.md` · `UX.md` · `DECISIONS.md` · `docs/matriz-paridade.md` · `docs/backlog-local-first.pdf` · `docs/PROVA-DE-VIDA.md` · `docs/DEPLOY-CLOUDFLARE.md` · `docs/ASSINATURA.md`.
