# DECISIONS.md — Registro de decisões

> Estado: **completo ao fim da Fase 2 (28/10/2026)**. Duas séries: **ADR-001..008** (Fase 1, arquitetura/ambiente) e **D-001..D-043** (Descoberta).
> Formato: título · data · status (proposta / aceita / provisória / substituída) · decisão · alternativas descartadas · motivo/consequências.
> Provisórias com revisão marcada: D-004, D-033 (EAN no iPhone), D-038 (Intl no Hermes), D-039 (KDF) → **Fase 3, spike E-02**; D-031 (feriados) → R2; D-043 (data do beta) → após o Sprint 1; ADR-006 (Pages × Workers) → antes da produção.

## Índice
| Tema | Decisões |
|---|---|
| Arquitetura e ambiente | ADR-001..ADR-008 |
| Plataformas e iPhone | D-001..D-008 |
| Produto e usuários | D-009..D-014 |
| Visual e navegação | D-015..D-026 |
| Acessibilidade | D-027, D-028 |
| Features por módulo | D-029..D-034 |
| Dados e privacidade | D-035 |
| Técnica | D-036..D-042 |
| Ritmo e restrições | D-043 |
| Lacunas da Fase 2 | D-044 |

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

### ADR-005 — Nome comercial e identidade do app
- Data: 28/10/2026 · Status: aceita (pelo Kaynan)
- Decisão: nome comercial **"Casa em Dia"** (`expo.name`), `slug` `casa-em-dia`, `scheme` `casaemdia`. O `android.package` continua **neutro**: `com.kaynansouza.financasecasa` (recomendação aceita: o nome pode mudar, o package não).
- Consequência: o package e a chave de assinatura formam a identidade do app; trocar depois da primeira distribuição obriga a reinstalar.

### ADR-006 — Deploy do PWA por Direct Upload (wrangler)
- Data: 28/10/2026 · Status: aceita (pelo Kaynan)
- Decisão proposta: Cloudflare Pages via `wrangler pages deploy` (sem integração Git). Nada publica sem comando explícito, e o build é local.
- Consequência: um projeto Direct Upload não migra para a integração Git depois.
- Atualização 28/10/2026: o wrangler 4.154 desvia a criação para "Pages dentro do Workers". O Kaynan escolheu o **Pages clássico com `--force`** para o preview. **Pendente antes da produção:** decidir se continuamos no Pages clássico ou migramos para Workers (assets estáticos).

### ADR-007 — Sem fallback SPA em `_redirects`
- Data: 28/10/2026 · Status: aceita (verificado)
- Contexto: o `/* /index.html 200` é ignorado pelo Pages ("Infinite loop detected"), e o Pages já faz fallback SPA quando não existe `404.html`.
- Decisão: `public/_redirects` sem regras; nunca gerar `404.html` sem rever esse comportamento.

### ADR-008 — Runner de testes
- Data: 28/10/2026 · Status: aceita e instalada (`jest-expo` ~58.0.12, `jest` ~30.5.2, `@types/jest` 30.0.0; licenças MIT; só dev). Comando: `npm test`.
- Decisão: `jest-expo` (Jest 30) como runner único, que é o único documentado pelo Expo SDK 58. Playwright para o e2e web, numa etapa posterior.

## Pontos do backlog que a nova arquitetura invalida ou muda
> **Status em 28/10/2026:** todos endereçados na Descoberta. Mapa: 1→ADR-001 · 2→D-005, D-012 · 3→D-003, D-029 · 4→D-004, D-039, TRD §8 (allowBackup) · 5→D-002, D-004 · 6→D-035 · 7→D-008, D-029, D-039 · 8→D-036, ADR-004 · 9→D-038, matriz C-01 · 10→TRD §10 · 11→D-041 · 12→D-001, UX tela 22 · 13→D-001 · 14→D-005, matriz A-05 · 15→D-001 · 16→D-032 · 17→TRD §9 (SW) · 18→TRD §2.1 (files) · 19→D-033 · 20→matriz L-07 (inviável no PWA) · 21→D-033, matriz L-08 · 22→BRD §7 · 23→D-012, BRD §4.5 · 24→D-006, ADR-006. Itens com "?" na matriz seguem para o E-02.

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

---

# Decisões da Descoberta (Fase 2)
> Formato: D-NNN · data · decisão · alternativas descartadas · motivo. "Provisória" = revisar no sprint indicado.

### D-001 — Alertas no iPhone: avisos no app + exportação `.ics`
- Data: 28/10/2026 · Status: aceita
- Decisão: no PWA, (1) faixa de vencimentos ao abrir o app + badge no ícone (se a Badging API funcionar no iOS); (2) botão "Enviar para o Calendário", que gera um **arquivo** `.ics` com `VALARM` para importar no Calendário do iPhone. Tudo local.
- Descartadas: só avisos no app (risco de perder vencimento); Web Push via Cloudflare Worker (exigiria servidor guardando assinatura e horários, o que viola o local-first).
- Motivo: único caminho 100% local que ainda toca alarme no iPhone.
- Observações: é diferente do "feed ICS" que o backlog tirou do escopo (assinatura online); aqui é um arquivo exportado manualmente. O `.ics` não é criptografado (avisar). Importação de alarmes pelo Calendário **não documentada**: testar no iPhone (E-02 ou sprint de alertas).

### D-002 — Persistência no iPhone: instalação obrigatória + backup semanal
- Data: 28/10/2026 · Status: aceita
- Decisão: no iPhone, o app só libera o uso após "Adicionar à Tela de Início" (detectar modo standalone); chama `navigator.storage.persist()`; lembrete de backup **a cada 7 dias** dentro do app. Android mantém o lembrete **mensal** (F-06).
- Descartadas: uso no Safari sem instalar; backup mensal no iPhone.
- Motivo: o WebKit pode despejar dados de origens inativas; estar instalado conta a favor da persistência, e o backup é a única proteção real.

### D-003 — Bloqueio no web: PIN no MVP, passkey avaliada
- Data: 28/10/2026 · Status: aceita
- Decisão: PIN de 6 dígitos com KDF lenta e espera crescente no MVP (web e fallback Android). Passkey/Face ID (WebAuthn com PRF) avaliada no spike E-02; se funcionar de forma confiável, entra na **R2**.
- Descartadas: passkey já no MVP (PRF só a partir do iOS 18.4, com bugs relatados); nunca ter passkey.
- Motivo: reduz o escopo e o risco do MVP sem fechar a porta ao Face ID.

### D-004 — Spike E-02: criptografia do banco no web
- Data: 28/10/2026 · Status: aceita (execução na **Fase 3**)
- Decisão: spike descartável comparando (1) banco em memória + snapshot cifrado (AES-GCM) no OPFS, (2) criptografia por coluna, (3) SQLite WASM com cifra por página. Critérios: segurança, carga < 2 s com cerca de 10 mil transações no iPhone, tamanho do bundle, complexidade/manutenção. Inclui testar passkey PRF (D-003) e alarmes do `.ics` (D-001).
- Descartadas: rodar o spike agora (atrasa a Descoberta); escolher sem spike.
- Consequência: o TRD sai com a criptografia web como **provisória, revisar na Fase 3 (E-02)**.

### D-005 — Paridade: Android só nativo; extras do nativo permitidos
- Data: 28/10/2026 · Status: aceita
- Decisão: usuários Android usam **apenas o APK**. O PWA é alvo do **iPhone (Safari)**; o Chrome desktop serve só para desenvolvimento. O nativo pode ter recursos exclusivos (notificações, ações, "Abrir com", biometria, bloqueio de print), desde que cada um tenha **degradação declarada** em `docs/matriz-paridade.md`.
- Descartadas: PWA também no Android (triplicaria os testes); paridade total (contradiz A-03/A-04 Must).
- Motivo: foco de teste em 2 alvos reais e melhor experiência em cada plataforma.

### D-006 — Site público em `*.pages.dev`
- Data: 28/10/2026 · Status: aceita
- Decisão: produção e previews públicos (previews com `noindex`), sem Cloudflare Access. O código do front é público; os dados nunca saem do aparelho.
- Descartadas: previews protegidos por Access; restringir tudo (exigiria login online, o que conflita com offline e "sem conta").
- Consequência: nada sensível no bundle (sem chaves, sem dados de teste reais); Cloudflare Web Analytics desligado.

### D-007 — Distribuição Android: APK direto, aviso de versão no app
- Data: 28/10/2026 · Status: aceita · revisar no beta (Sprint 6)
- Decisão: APK **release assinado** (keystore conforme `docs/ASSINATURA.md`) enviado pelo Kaynan; o app exibe a versão em Configurações/Diagnóstico; o Kaynan avisa os amigos. Sem chamada de rede para checar versão.
- Descartadas: checagem online de versão (exceção de rede e de CSP); Play Store agora (conta, taxa, revisão).

### D-008 — Backup em formato único entre plataformas
- Data: 28/10/2026 · Status: aceita
- Decisão: um formato só (dump lógico versionado + AES-256-GCM + KDF com parâmetros no cabeçalho), que restaura Android → iPhone e iPhone → Android. Nunca o `.db` cru.
- Descartadas: formato por plataforma (quem trocasse de plataforma perderia tudo).
- Consequência: KDF e cifra idênticas nos dois alvos; testes com vetores fixos (skill `backup-cross-platform`). A escolha da KDF fica para o Bloco F.

### D-009 — Público do beta
- Data: 28/10/2026 · Status: aceita
- Decisão: 3–5 pessoas, **maioria Android**; perfil **misto** (jovens + familiares mais velhos). Necessidades conhecidas: **fonte ampliada** e **daltonismo/baixa visão**.
- Consequências: onboarding guiado, linguagem sem jargão e tutorial de instalação (APK e "Adicionar à Tela de Início"); fonte escalável, contraste alto e **nunca informação só por cor** são **requisitos do MVP**, não desejáveis. Android continua sendo o alvo principal de teste, mas o iPhone não pode ser de segunda classe (D-005).

### D-010 — Promessa do produto
- Data: 28/10/2026 · Status: aceita
- Decisão: **"Seu dinheiro e sua rotina num só lugar, privado."** (onboarding, descrição do PWA/manifest e do APK).
- Descartadas: "Suas contas e sua casa em dia, sem sair do seu celular."; "Nunca mais esqueça uma conta — e saiba quanto custa sua casa."

### D-011 — Momentos de uso por módulo
- Data: 28/10/2026 · Status: aceita
- Decisão: Importação e Dashboard 1–2×/mês, com calma (guiar passo a passo); Contas no alerta (Android) ou ao abrir (iPhone), "Paguei" em 1 toque; Assinaturas em revisão mensal (total + maiores); Compras **dentro do mercado**: uma mão, offline, alvos grandes.
- Descartadas: dashboard de uso diário; Compras como tela inicial.

### D-012 — Critérios de sucesso e de saída do MVP
- Data: 28/10/2026 · Status: aceita
- Decisão: **produto**: os amigos usam sem a ajuda do Kaynan (instalam, importam, usam a lista). **Técnico** (backlog): ≥ 70% das transações categorizadas sem intervenção; lembretes no horário em teste de 14 dias em ≥ 2 fabricantes Android; backup restaurado em outro aparelho, **incluindo Android ↔ iPhone** (D-008); iPhone validado no PWA (instalação, offline, avisos/`.ics`).
- Descartada: só o critério de produto.

### D-013 — Ordem de corte do MVP
- Data: 28/10/2026 · Status: aceita
- Nunca cortar: F-01, F-03, **F-04**, F-06, F-07, C-01..C-06, A-01, A-03, A-04 (+ **F-08**, ver D-044).
- Ordem de corte (1 sai primeiro): 1. L-05 · 2. A-05 · 3. L-03 só a câmera/EAN (catálogo fica) · 4. S-02 · 5. F-05 (vira mínimo) · 6. L-04 · 7. L-02/L-08 · 7b. L-01 (só se o módulo Compras inteiro sair) · 8. S-01/S-03/S-04.
- Descartadas: Compras antes de Assinaturas; "nada sai, adia a data".

### D-014 — Ícone
- Data: 28/10/2026 · Status: aceita
- Decisão: silhueta de **casa com ✓** dentro; deve funcionar pequeno, como `maskable` (PWA), adaptive/monochrome (Android) e `apple-touch-icon`.
- Descartadas: casa + calendário; monograma "CD".

### D-015 — Estilo e tema
- Data: 28/10/2026 · Status: aceita
- Decisão: estilo **minimalista e calmo** (fundo neutro, uma cor de destaque, números grandes, bastante respiro). Tema **automático (segue o sistema) + escolha manual** em Configurações; os dois temas validados em contraste.
- Descartadas: sóbrio/denso; colorido por módulo; só claro; só automático.

### D-016 — Paleta segura para daltonismo (contraste calculado)
- Data: 28/10/2026 · Status: aceita
- Claro (fundo `#F7F8F9`, superfície `#FFFFFF`): primária `#0F5F73` (6,80:1) · receita `#1F5FAD` (5,99) · despesa `#B3471B` (5,15) · alerta `#8A5A00` (5,57) · sucesso `#116B5C` (6,02) · erro `#A1263A` (6,92) · texto `#1A1D21` (15,91) · texto secundário `#4A515A` (7,55). Branco sobre a primária: 7,23.
- Escuro (fundo `#121417`, superfície `#1C1F23`): primária `#6CC4D9` (9,26) · receita `#8AB4F8` (8,76) · despesa `#F2A07B` (8,87) · alerta `#E8C268` (10,85) · sucesso `#6FD1BC` (10,12) · erro `#F28B9B` (7,86) · texto `#E8EAED` (15,31) · texto secundário `#B4BAC2` (9,44).
- Regra: cor semântica **sempre com ícone + texto** (ex.: ↓ "saída", ⚠ "vence hoje", ✕ "vencida", ✓ "paga"). Sem par vermelho × verde.
- Descartadas: verde/vermelho clássicos (pior para daltonismo); roxo.

### D-017 — Tipografia do sistema
- Data: 28/10/2026 · Status: aceita
- Decisão: fonte do sistema (Roboto no Android, San Francisco no iPhone), sem fonte embutida nem remota; **algarismos tabulares** para valores (`fontVariant: ['tabular-nums']`; verificar o suporte no RN Web).
- Descartada: fonte própria embutida (peso e licença).

### D-018 — Navegação por 5 abas inferiores
- Data: 28/10/2026 · Status: aceita
- Decisão: **Início · Gastos · Contas · Compras · Mais** (Mais = Assinaturas, Backup, Configurações, Diagnóstico, Privacidade). Ícone + rótulo sempre.
- Descartadas: 4 abas com Assinaturas dentro de Contas; menu lateral.
- Risco: rótulos com fonte 200% → rótulos curtos e teste obrigatório (bloco C).

### D-019 — Tela inicial "O que precisa de atenção"
- Data: 28/10/2026 · Status: aceita
- Decisão: ordem: (1) atenção: vencidas, vencendo e renovações, com ações; no iPhone é a faixa de D-001; (2) resumo do mês (gastos, variação, assinaturas/mês); (3) atalhos (Importar CSV, Lista, Backup com "há N dias").
- Descartadas: resumo financeiro primeiro; grade de atalhos.

### D-020 — Densidade e layout web
- Data: 28/10/2026 · Status: aceita
- Decisão: lista de transações **confortável, 2 linhas** (descrição + valor; categoria · data · conta mascarada). No web em tela grande: **coluna centralizada** (~480 px), um único layout.
- Descartadas: lista compacta de 1 linha; responsivo de 2 colunas.

### D-021 — Gráficos próprios com react-native-svg
- Data: 28/10/2026 · Status: aceita (instalação da lib só quando a primeira tela com gráfico for implementada, com aviso)
- Decisão: barras horizontais, linha (preço/tempo) e anel (categorias) implementados no projeto sobre **react-native-svg** (doc do Expo: suporta Android, iOS e web). Toda visualização tem alternativa em texto/tabela e respeita o modo privacidade.
- Descartadas: lib de gráficos sobre SVG (dependência extra; reavaliar se os tipos crescerem); Victory Native XL/Skia (~2,9 MB gzip de CanvasKit no web, suporte web incerto).

### D-022 — Modo privacidade global
- Data: 28/10/2026 · Status: aceita
- Decisão: botão 👁 no topo oculta **todos** os valores do app (`R$ ••••`, gráficos sem números nos eixos); leitor de tela lê "valor oculto"; a escolha é lembrada. Independe da opção "ocultar valores na notificação" (A-03).
- Descartadas: ocultar só a tela inicial; sem modo privacidade.

### D-023 — Onboarding em 4 passos
- Data: 28/10/2026 · Status: aceita
- Decisão: (0, só iPhone) instalar na Tela de Início, com bloqueio até instalar (D-002) → (1) boas-vindas + promessa + "seus dados ficam só neste aparelho; sem conta" → (2) criar PIN (+ biometria no Android) → (3) backup: risco + escolha do lembrete → (4) primeiro passo: importar CSV / cadastrar conta / criar lista / depois.
- Descartadas: onboarding mínimo; tour completo por módulo.

### D-024 — Tom de voz, movimento e feedback
- Data: 28/10/2026 · Status: aceita
- Decisão: tom **próximo e direto** ("você", frases curtas, sem jargão); erros dizem o que aconteceu e o que fazer, sem culpar o usuário e **sem ecoar dados**. Transições ≤ 200 ms, desligadas com "reduzir movimento". Vibração leve **só no Android** em ações confirmadas. Sem sons próprios.
- Descartadas: tom formal sem movimento; tom descontraído com mais animações.

### D-025 — Mapa de telas
- Data: 28/10/2026 · Status: aceita
- Decisão: cerca de 38 telas em 6 grupos: Onboarding/Bloqueio, Início, Gastos, Contas, Compras, Mais. Lista completa no UX.md; cada tela aponta para um PBI. Telas específicas de plataforma: "Instalar" (só iPhone), "Meus alertas funcionam?" (Android, A-03), "Lembretes no iPhone" (`.ics`, D-001), Leitor EAN (as duas, com implementação diferente).

### D-026 — UI com StyleSheet + componentes próprios
- Data: 28/10/2026 · Status: aceita
- Decisão: sem biblioteca de UI ou de estilo. Tokens (D-016/D-017) em `src/ui/theme`; cerca de 15 componentes próprios (Button, IconButton, Card, MoneyText, ListItem, Banner, EmptyState, TextField, MoneyField, PinPad, Tabs, Sheet, Toast, ProgressBar, Chart*) com acessibilidade embutida.
- Descartadas: NativeWind (dependência + config de Babel/Metro/CSS); biblioteca de componentes (peso, visual de terceiros, a11y variável).
- Motivo: bundle mínimo nos dois alvos e controle total de acessibilidade (D-009).

### D-027 — Requisitos de acessibilidade do MVP
- Data: 28/10/2026 · Status: aceita
- Decisão:
  - **Leitor de tela**: TalkBack (Android) e VoiceOver (PWA no iPhone) são **requisito em todas as telas**.
  - **Fonte até 200%**, quebrando linha (nunca truncar texto nem valor); abas com rótulos curtos.
  - **Alvos ≥ 48×48** (dp/px) nos dois alvos, ≥ 12 de espaçamento entre ações.
  - **Ações reversíveis** (paga, comprado, excluir item): executam + toast "Desfazer" (10 s). **Irreversíveis** (apagar tudo, restaurar backup): confirmação explícita (PIN + palavra, F-04).
  - Já decididos: contraste WCAG 2.2 AA (D-016), nunca só cor, gráficos com alternativa em texto (D-021), "reduzir movimento" (D-024), "valor oculto" (D-022).
- Validação: checklist `a11y-expo` por PBI + roteiro manual TalkBack/VoiceOver por sprint + **axe-core** nos testes Playwright do web (dev-only, entra junto com o Playwright).
- Descartadas: leitor só nos fluxos principais / desejável; fonte até 150% ou sem limite; 44 + confirmação em tudo; sem ferramenta automática.

### D-028 — Idioma/formatos fixos e uso com uma mão
- Data: 28/10/2026 · Status: aceita
- Decisão: interface **pt-BR fixa**; moeda `R$ 1.234,56`; data `dd/mm/aaaa`, independentemente do idioma do sistema. Uso com uma mão: ações principais na metade inferior (botão principal fixo embaixo + abas); teclado numérico para valores, PIN e quantidades; no web, navegação completa por Tab/Enter/Esc, foco visível, Esc fecha modais.
- Descartadas: formatos seguindo o sistema; sem regra de posicionamento.

### D-029 — Fundação: bloqueio, captura, lembrete e destino do backup
- Data: 28/10/2026 · Status: aceita
- Bloqueio (F-01): PIN de **6 dígitos** + biometria (Android); trava **1 min** após ir para segundo plano (opções: imediato, 1, 5, 15 min). Biometria falhou → PIN. **PIN esquecido não tem recuperação** (sem servidor): só restaurar backup ou apagar tudo, avisado no onboarding. iPhone: só PIN (D-003).
- Captura/Recentes (Android): **bloqueado por padrão**, desligável em Configurações. iPhone: impossível; a alternativa é o modo privacidade (D-022).
- Lembrete de backup (Android): **mensal, dia 1 às 20h**, no canal "backup" (configurável: semanal/mensal/desligado). Em todas as plataformas: "Backup: há N dias" no Início e em Configurações; > 30 dias (Android) ou > 7 dias (iPhone) vira alerta âmbar; sem backup = aviso persistente, sem bloquear o uso.
- Destino: o seletor/Compartilhar do sistema escolhe; o texto sugere guardar **fora do celular** (Drive, Arquivos/iCloud Drive). Exportação F-04 avisa que não é criptografada. Compartilhar falhou no iPhone → oferecer download.
- Descartadas: PIN de 4 dígitos; travar imediatamente por padrão; captura liberada por padrão; lembrete no dia do onboarding; semanal no Android; destino específico.

### D-030 — Importação: bancos, amostras e casos especiais
- Data: 28/10/2026 · Status: aceita
- Bancos-alvo do MVP: **Nubank, C6, Santander, Banco do Brasil, Itaú, Bradesco** (conta e cartão quando o banco exportar ambos).
- Golden files: reaproveitar os do **Épico 2** como contrato do porte (F-07). Banco sem golden file: o Kaynan gera o CSV, anonimiza com **script local** (a escrever) e só o resultado entra em `tests/fixtures/`. Arquivo real nunca entra no git. *Pendente:* saber quais bancos o Épico 2 já cobre (Bloco F).
- Casos especiais (se o Épico 2 já resolver, porta como está):
  - **Transferência entre contas próprias**: categoria "Transferência", fora dos totais; sugere o par saída/entrada de mesmo valor em ≤ 3 dias, com confirmação.
  - **Parcela** ("LOJA X 03/10"): só a parcela do mês; agrupamento "3 de 10"; **nunca** vira assinatura (S-02).
  - **Estorno**: vinculado à compra original quando encontrada; abate do gasto da categoria original.
  - **Pagamento de fatura**: categoria própria, fora dos totais (evita contar 2×).
- Categorias padrão (editáveis: renomear/criar/arquivar): Mercado, Casa, Contas da casa, Transporte, Saúde, Educação, Lazer, Restaurantes, Assinaturas, Compras, Impostos/taxas, Renda, Transferência, Pagamento de fatura, Outros.
- Limite 10 MB / 50 mil linhas igual nas duas plataformas; se o iPhone não aguentar no teste, reduzir só lá, com mensagem clara.
- Descartadas: CSVs novos para todos; sintéticos do zero; tratar tudo como transação comum; categorias do Épico 2 sem revisão.

### D-031 — Contas a pagar e regras de lembrete
- Data: 28/10/2026 · Status: aceita · feriados: **provisória, revisar na R2**
- Recorrências (A-01): única, semanal, mensal (dia N; dia inexistente → último dia do mês), anual, último dia útil do mês, personalizada simples (a cada N semanas/meses). **Dia útil = seg–sex, sem feriados no MVP.**
- Lembretes padrão (A-04), editáveis por conta: **3 dias antes, 1 dia antes e no dia, às 9h**; silêncio 22h–7h; atraso 1×/dia por 3 dias; máx. 5 notificações/dia (o excedente vira resumo). Obs.: o "7, 3, 1 dia" do backlog era exemplo; o Kaynan escolheu 3/1/0 como padrão (7 dias continua disponível por conta). iPhone: as mesmas regras viram `VALARM` no `.ics` e destaque na faixa do app (D-001).
- Notificação/`.ics`: por padrão **só nome e data** ("Luz vence amanhã (sex 31/10)"); valor só se o usuário ligar.
- Boleto: **campo de texto** para a linha digitável (com validação dos dígitos verificadores) e Pix copia-e-cola, com botão **Copiar**; sem câmera.
- Descartadas: feriados no MVP; só única/mensal/anual; 7/3/1/0 por padrão; digest por padrão; valor na notificação por padrão; leitura do boleto pela câmera.

### D-032 — Assinaturas: moedas, catálogo e "minha parte"
- Data: 28/10/2026 · Status: aceita · cotação online: reavaliar na R2
- Moedas BRL/USD/EUR com **cotação manual** (ou valor em reais da fatura), registrada em cada cobrança. **Zero rede no MVP**: a CSP fica `connect-src 'self'` sem exceção. Isso remove do MVP a "única exceção opcional" de rede do backlog (S-01).
- Catálogo de cerca de 20 serviços populares no BR, **sem logos oficiais** (nome + categoria + ícone genérico próprio); valores são sugestão editável.
- "Minha parte" em **R$ ou %**; o dashboard mostra o total do plano e o custo líquido. Detector S-02 conservador (critérios do backlog; o catálogo permite 1 ocorrência); sugestão descartada não volta.
- Descartadas: botão "atualizar online" (abre a CSP, expõe o IP a terceiros, a API pode sair do ar); só BRL; logos de marcas; sem catálogo; "minha parte" só em R$.

### D-033 — Compras: unidades, corredores, preços, troca de CSV e EAN
- Data: 28/10/2026 · Status: aceita · EAN no iPhone: **provisória, revisar no spike da Fase 3**
- Unidades: un, kg, g, L, ml, pacote, caixa, dúzia. Corredores (ordem ajustável, editáveis): Hortifrúti, Padaria, Açougue/Peixaria, Frios e Laticínios, Mercearia, Bebidas, Congelados, Limpeza, Higiene, Pet, Bebê, Farmácia, Outros.
- Preço (L-04): **item a item, opcional**, um campo que sugere o último preço; mercado escolhido 1× por ida; ao encerrar, total estimado + oferta de vínculo com a transação do extrato. Offline, uma mão.
- Troca do CSV (L-02/L-08): Android = Compartilhar nativo + "Abrir com"; iPhone = Web Share/download para enviar e "Salvar em Arquivos" + Importar dentro do app para receber. Tela de ajuda por plataforma. Arquivo inválido = erro claro, nada muda.
- EAN (L-03): **Android pela câmera (`expo-camera`, EAN-13 documentado)**; **iPhone: digitar o EAN** (degradação). O spike da Fase 3 testa o `expo-camera` web no Safari (a doc não diz o mecanismo; provavelmente `BarcodeDetector`, ausente no Safari). Se funcionar, o iPhone ganha câmera sem lib extra.
- Descartadas: unidades/corredores mínimos; preços só no fim; os dois modos; copiar/colar como texto; lib JS de código de barras; sem câmera no MVP.

### D-034 — Features extras (fora do backlog original)
- Data: 28/10/2026 · Status: aceita como escopo futuro · releases **confirmadas pelo Kaynan** (X-01 R2; X-02 e X-03 R3)
- **X-01 Orçamento por categoria**: limite mensal por categoria, barra de progresso e aviso (lembrete no Android; faixa no iPhone). Proposta: **R2**.
- **X-02 Metas de economia**: guardar X até uma data, com acompanhamento. Proposta: **R3**.
- **X-03 Divisão de despesas da casa**: quem pagou o quê entre moradores e acerto; sem servidor, troca por **CSV versionado** como L-02/L-08. Proposta: **R3**.
- Verificação: as três respeitam o local-first (nada sai do aparelho sem ação do usuário). Nenhuma entra no MVP.

### D-035 — Dados e privacidade
- Data: 28/10/2026 · Status: aceita
- Calendário: **mês civil** (dia 1) e semana começando no **domingo** por padrão; Configurações permite "meu mês começa no dia N" e semana na segunda. Datas contábeis em America/Sao_Paulo; hora das notificações no fuso do aparelho.
- CSV original: **descartado imediatamente** por padrão (o Desfazer usa o lote no banco); opção de reter até 30 dias, privado e criptografado.
- "Apagar todos os dados" (F-04): PIN/biometria + digitar **APAGAR**. Android: banco, chave do Keystore, notificações agendadas, temporários, preferências. iPhone/web: OPFS, chaves/metadados, caches e registro do service worker, storage; volta ao onboarding. Backups já salvos fora do app **não** são apagados (aviso).
- Texto de privacidade: versão curta proposta, com **ajuste de honestidade** do agente: a Cloudflare recebe dados técnicos de acesso (IP/navegador) ao baixar/atualizar o PWA. O texto diz isso em vez de "o site não coleta nada".
- Já confirmados do backlog: centavos; mascaramento `****1234`; desfazer importação em 30 dias; mesclagem "mais recente vence, comprado prevalece no empate", com resumo antes de aplicar.
- Descartadas: mês a partir do salário por padrão; reter CSV 30 dias por padrão; manter preferências ao apagar; política longa estilo LGPD.

### D-036 — Épicos 1 e 2: reescrever (não há código para portar)
- Data: 28/10/2026 · Status: aceita · **muda o backlog**
- Contexto: o código antigo (TypeScript/Node) não está mais disponível; o Kaynan prefere reescrever.
- Decisão: **F-07 vira reescrita**: parsing, perfis, dedupe, categorização, correção com aprendizado e dashboard (C-01..C-06) são implementados do zero em `src/core` (TS puro), usando os critérios de aceite do backlog como contrato. Situação de C-01..C-06: "Concluído (portar)" → **"A fazer (reescrever)"**.
- Golden files (substitui parte de D-030): o Kaynan exporta CSVs reais dos seus bancos e **anonimiza com um script local** escrito pelo agente (preserva o layout; troca descrições, valores e contas; roda fora do git; o agente nunca vê o original). Bancos que o Kaynan não usa: mesmo processo com amigos. Só o resultado anonimizado entra em `tests/fixtures/`.
- Escopo: **mantido**, com prazo maior (+1 a 2 sprints estimados; replanejar no BRD/TRD). A ordem de corte D-013 continua valendo. O dicionário de estabelecimentos (C-04) é montado do zero.
- Descartadas: sintéticos a partir de documentação; só os bancos do Kaynan; reduzir a importação; antecipar cortes.
- Riscos: maior prazo do MVP; meta de 70% de categorização depende do dicionário novo.

### D-037 — Estado e acesso ao banco
- Data: 28/10/2026 · Status: aceita
- Estado: **sem biblioteca**; o SQLite é a fonte da verdade; as telas leem via repositórios e recarregam ao receber eventos do barramento (`src/core/events`); React Context só para sessão (bloqueio, tema, privacidade).
- Banco: **SQL puro + repositórios tipados** em `src/storage`, migrações próprias versionadas (skill `sqlite-native-sqlcipher`).
- Descartadas: Zustand; TanStack Query; Drizzle/ORM.

### D-038 — Datas, recorrência e CSV: implementação própria
- Data: 28/10/2026 · Status: aceita
- Datas contábeis como string `AAAA-MM-DD` (aritmética de calendário pura em `src/core`, sem fuso); instantes de notificação com `Date`/`Intl`. Recorrências do D-031 implementadas e testadas no core (sem lib RRULE). **Testar no spike** se o Hermes suporta `Intl` com `timeZone: 'America/Sao_Paulo'`; se não, o core não depende disso (São Paulo não tem horário de verão desde 2019; datas antigas de extrato são só datas).
- Parser de CSV próprio em `src/core` (bytes → codificação → delimitador → RFC 4180 → números BR em centavos → perfis), em blocos (Web Worker no web, fatias no nativo).
- Descartadas: date-fns + rrule; Papa Parse.

### D-039 — Criptografia: AES-GCM via expo-crypto; KDF decidida no spike
- Data: 28/10/2026 · Status: AES-GCM aceito · KDF **provisória, decidir na Fase 3 (E-02)**
- Fato verificado (doc do expo-crypto, SDK 58): `aesEncryptAsync`/`aesDecryptAsync` (AES-GCM), `getRandomValues`, `randomUUID` e `digest` em Android e web; **sem PBKDF2/HKDF/Argon2**.
- Decisão: AES-256-GCM via `expo-crypto` nos dois alvos (backup F-06 e criptografia web), atrás de `src/platform/crypto`. KDF (backup e PIN) escolhida no spike E-02 por medição: (a) PBKDF2-SHA-256 (WebCrypto no web + lib JS pura auditada no Android), (b) Argon2id em JS puro nos dois, (c) módulo nativo. Critério: ≈ 1–2 s no OPPO e no iPhone, saída idêntica nos dois alvos (vetores fixos), dependência mínima.
- Descartada: fechar PBKDF2 agora.

### D-040 — Versões mínimas e aparelhos de teste
- Data: 28/10/2026 · Status: aceita
- **Android 10+ (API 29)** e **iOS 18+** (PWA). Teste: OPPO CPH2699 (Android 16) + 1 Android de outro fabricante + iPhone com iOS 18 e com iOS 26 (dos amigos, quando possível).
- Descartadas: Android 7+ (mínimo do SDK 58); Android 12+ / iOS 26+.

### D-041 — Metas de desempenho
- Data: 28/10/2026 · Status: aceita
- Medidas no OPPO CPH2699 e num iPhone real, com dados sintéticos gerados: abrir até a tela de PIN ≤ 2 s (frio); Início/Dashboard com ~10 mil transações ≤ 2 s; importar 10 MB / 50 mil linhas sem travar a UI, com progresso, ≤ 60 s; backup/restauração de ~10 mil transações ≤ 10 s (KDF ≈ 1–2 s); marcar item comprado ≤ 100 ms (offline); PWA: 1ª carga em 4G ≤ 5 s e JS inicial ≤ 1,5 MB (hoje `entry` = 1,1 MB sem gzip).
- Descartada: só as metas do backlog.

### D-042 — CI e e2e
- Data: 28/10/2026 · Status: aceita
- **GitHub Actions** a cada push/PR: `npm ci`, `tsc --noEmit`, `jest`, `expo-doctor`, `expo export -p web` e checagem "sem URL externa no `dist/`". **Sem deploy no CI**: previews continuam manuais via wrangler com o login do Kaynan (nenhum token da Cloudflare no GitHub). Não fazer push sem pedido; o CI só roda quando o Kaynan fizer push.
- **Playwright + axe** entram no sprint do PWA/service worker.
- Descartadas: preview automático por branch (exigiria API token como secret); sem CI; Playwright no Sprint 1.

### D-043 — Restrições, ritmo e acompanhamento
- Data: 28/10/2026 · Status: aceita · data do beta: **provisória, estimar após o Sprint 1**
- Dedicação: **até 5 h/semana**. Orçamento: **custo zero** (Cloudflare free, build local, sem lojas, sem domínio).
- Beta: **sem data fixa**; medir a velocidade no Sprint 1 e propor uma data. Alerta do agente: com até 5 h/semana + reescrita (D-036) + paridade iPhone, o MVP tende a ultrapassar bastante os 6 sprints do backlog; usar a ordem de corte D-013 se necessário.
- Acompanhamento: a cada etapa, resumo curto (feito / testado / não testado por plataforma / próximo), **link de preview** quando houver tela e **APK de debug** quando houver mudança nativa; perguntas só quando bloquear ou houver decisão.
- Riscos prioritários para o Kaynan: **perda de dados** (celular perdido / iOS apagar) e **amigos não conseguirem instalar/usar** → reforçar F-06/D-002 e o onboarding guiado (D-023), com tutorial de APK/Tela de Início e teste com 1 familiar antes do beta.
- Descartadas: datas fixas (mar/2027, jun/2027); só resumos; pequenos custos.

### D-044 — Novo PBI F-08 "Onboarding e ajuda"
- Data: 28/10/2026 · Status: aceita
- Contexto: a checagem de consistência da Fase 2 achou telas sem PBI no backlog (Instalar no iPhone, Primeiro passo, Sobre/ajuda).
- Decisão: criar **F-08 — Onboarding e ajuda** (MVP, **Must**, **nunca cortar**): instalação obrigatória no iPhone (D-002), onboarding em 4 passos (D-023), ajuda para instalar o APK e para exportar o CSV de cada banco (D-030). Planejado no Sprint 2.
- Descartadas: distribuir em F-01/F-06/C-01 (o trabalho ficaria escondido na estimativa); F-08 como Should.
- Motivo: sustenta o critério de sucesso "amigos usam sem ajuda" (D-012) e o risco prioritário "não conseguir instalar/usar" (D-043).
