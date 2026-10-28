# PLAN.md — Plano de etapas · Casa em Dia

> Versão 1.2 · 28/10/2026 · Fase 3 (Codificação), passo "Divisão em Etapas". v1.1: código antigo → porte com triagem (D-045). v1.2: bancos (D-048), curva do PIN (D-029), só OPPO para testes (D-049, proposta), lançamento manual (D-050, proposta), Assinaturas não versionadas no inventário. **Aguardando aprovação do Kaynan.**
> Fontes: `docs/backlog-local-first.pdf` (escopo funcional), `BRD.md` §4–5 (escopo vigente, D-044/D-045), `TRD.md`, `UX.md`, `ARCH.md`, `DECISIONS.md` (ADR-001..008, D-001..D-045), código antigo `dia-a-dia` (§0.4), `docs/matriz-paridade.md`, skills `backlog-pbi`, `git-versionamento`, `testing-strategy`.
> Regra: **uma etapa por vez**; só avança com testes verdes + aprovação. Cada etapa = 1 sessão de 1–3 h (com até 5 h/semana, D-043, ≈ 2 etapas/semana).

## 0. Como ler este plano

### 0.1 Desvios em relação ao pedido (justificados; confirmar nas perguntas §17)
1. **Código antigo encontrado (D-045, substitui D-036)**: a E-06 é **inventário e porte** do núcleo, como pedido. O porte é **com triagem** (§0.4): lógica pura vai para `src/core` com testes escritos durante o porte; código de plataforma vira adaptador; telas são só referência. Como o código antigo **não tem testes nem golden files**, os golden files **de banco** (CSV anonimizado) continuam na Importação (E-12/E-13).
2. **Service worker/offline sobe para o Sprint 2 (E-07)**, logo depois da fundação, e não fica perto do fim. Motivos da Descoberta: (a) no iPhone o app da Tela de Início tem **armazenamento separado** do Safari, então a trava "instale primeiro" (D-002) precisa existir antes de qualquer dado real no iPhone; (b) o BRD §4.5 põe manifest + SW no Sprint 2; (c) PWA preso em cache antigo é caro de corrigir depois; (d) L-01 ("offline no mercado") e todas as demonstrações no iPhone dependem disso.
3. **Playwright sobe para a E-03** (D-042 previa no sprint do PWA). O contrato da porta `db` precisa rodar no adaptador web real (OPFS/WASM), e isso não roda no Jest/Node.
4. **E-02 tem uma página de benchmark descartável** (não é UI de produto), publicada num preview de branch `spike/*`, para medir no Chrome do OPPO e, na J-1, no Safari de um iPhone emprestado (D-049).
5. **Ordem "F-07 antes de tudo"**: E-03..E-05 não usam regra de negócio; só usam utilitários mínimos (UUID pela porta `crypto`, relógio). Por isso a ordem pedida (E-03 → E-06) não viola a dependência.
6. **Outras perguntas do spike** (D-004/SESSION) foram distribuídas pelas etapas que precisam delas: `Intl`/Hermes → E-06; Web Share no standalone → E-05; `.ics` `VALARM` e Badging API → E-22; `expo-camera` no Safari → E-33; passkey PRF → **R2** (D-003), fora do MVP.

### 0.2 Padrões que valem para **toda** etapa (não repetidos abaixo)
- **Branch** `feat/<pbi>-<slug>` (ou `spike/`, `chore/`, `docs/`); commits pequenos, Conventional Commits em inglês, `Refs: <PBI>`; merge na `main` só após aprovação.
- **Portões automáticos:** `npx tsc --noEmit`, `npm test` (inclui o **teste de fronteira de imports** da E-01), `npx expo-doctor`, `npx expo export -p web` + "sem URL externa no `dist/`" (script da E-01). Na E-06 tudo isso vira CI (GitHub Actions), que roda quando o Kaynan fizer push.
- **Autoteste no aparelho** (proposto na E-03): rota `/dev/selftest`, só presente em builds de debug e de preview (`EXPO_PUBLIC_SELFTEST=1`), que roda as suítes de contrato/golden **nos adaptadores reais** com banco **separado e sintético**. Android: `scripts/selftest-android.ps1` (deep link + `adb logcat`); web: Playwright. A CI verifica que o build de **produção** não contém a rota.
- **A11y:** checklist `UX.md` §9.2 (14 itens) + skill `a11y-expo` em toda tela nova; roteiro manual **TalkBack no OPPO** e **VoiceOver no iPhone (PWA)**.
- **Sem iPhone (D-049, proposta):** o único aparelho é o OPPO. Todo item "iPhone real" de uma etapa é verificado agora no **Playwright WebKit** (e no Chrome do OPPO quando fizer sentido) e entra em `docs/testes/fila-iphone.md` para a próxima **janela de iPhone emprestado** (J-1..J-3, §1.1). A etapa fecha com o item marcado "pendente de iPhone", nunca como "testado".
- **Segurança:** skill `security-review` quando tocar dados/arquivos/logs/auth/headers; nunca dado real; valores em centavos; contas `****1234`.
- **Paridade:** linha atualizada em `docs/matriz-paridade.md` no mesmo commit; "?" resolvido vira fato com fonte e data.
- **Demonstração:** APK de debug (`arm64-v8a`) instalado no OPPO + preview `https://<branch>.casa-em-dia-44l.pages.dev` (deploy de preview **só depois de avisar**; produção **só com comando explícito**).
- **Fechamento:** `SESSION.md` + lição na skill; relatório "feito / testado / **não testado** (Android | iPhone-PWA) / próximo".

### 0.3 Legenda
Plataforma: **=** igual · **≈** degradado · **✕** ausente (alternativa descrita). Testes: **U** unit core · **G** golden · **C** contrato de porta (fake no Jest) · **I** integração SQLite nos adaptadores reais (autoteste/Playwright) · **E** e2e web (Playwright + axe) · **M** manual em aparelho real (**só manual** quando marcado ⓜ).

### 0.4 Porte do código antigo (D-045)
- **Fonte congelada, só leitura:** `C:\Users\kayna\Documents\Projetos\dia-a-dia` @ `e59f1a1` + árvore de trabalho de 28/10/2026 (20 arquivos sem commit). Expo SDK 57, TypeScript, só Android, **sem testes**. Nada é alterado lá.
- **Receita por arquivo:** (1) ler o original e anotar o comportamento; (2) escrever os testes primeiro (caracterização + critério do backlog/BRD); (3) copiar para o destino; (4) adaptar: imports de plataforma → portas, `expo-sqlite` → porta `db`, convenções do TRD §3 (UUID, centavos, `AAAA-MM-DD`), mensagens e logs sem dados; (5) conferir a API do **SDK 58** na doc atual; (6) commit `feat(<scope>): port <módulo> (<PBI>)` com rodapé `Ported-from: dia-a-dia@e59f1a1+wt src/<caminho>`.
- **Nunca trazer:** `android/`, `.expo/`, assets e ícones antigos, `com.diaadia.app`, o snapshot `sqlcipher_export` do backup, o modelo `ml/*` (C-07, R2), qualquer dado.
- **Dependências do código antigo** (`@noble/hashes`, `@noble/ciphers`, `@react-native-community/datetimepicker`, `expo-intent-launcher`, `expo-linear-gradient`…): cada uma só entra quando a etapa precisar, com justificativa e aviso (AGENTS §9).

| Módulo antigo (`src/…`) | Decisão | Etapa |
|---|---|---|
| `lib/{bytes,text,time}`, `events/*`, `core/parsing/values`, `security/privacy/mask`, `logging/sanitize`, `categorization/normalize` | Portar (puro) | E-06 |
| `db/migrations/runner`, `db/transaction`, `db/client`, `db/schema/*` | Adaptar (runner) · referência (esquema) | E-03 |
| `security/lock/{lock-machine,lock-store}`, `pin/pin-hash`, `keystore/*`, `biometrics/*` | Portar (puro) · adaptar (plataforma) | E-04 |
| `backup/{format,kdf,errors}` · `backup/{export,restore}-backup` | Portar envelope/KDF · **reescrever conteúdo** (D-008) | E-05 |
| `data-rights/*` | Referência (nativo) · web novo | E-09 |
| `security/privacy/PrivacyShield` | Adaptar → `screen-security` | E-10 |
| `logging/{logger,rotation}`, `services/diagnostics` | Adaptar | E-11 |
| `import/stream/*`, `import/{sniff,limits}` | Portar · `reader` → porta `files` | E-12 |
| `import/profiles/*`, `import/row-mapper` | Portar os 6 perfis (D-048) | E-13 |
| `core/dedup/fingerprint`, `import/{commit,undo,csv-retention}` | Portar | E-14 |
| `import/{scheduler,analyze,job,progress-store,session,steps}` | Portar (nativo) · Web Worker novo | E-15 |
| `categorization/{engine,dictionary,fuzzy,factory,seed}`, `builtin/*` | Portar; categorias → D-030 | E-16 |
| `categorization/learn` | Portar | E-17 |
| `categorization/ml/*` | **Fora do MVP** (C-07, R2) | — |
| `dashboard/*` · `components/charts` | Portar SQL · gráficos novos (D-021) | E-18 |
| `services/recurrence/*`, `bills/*` | Portar; conferir D-031 | E-20 |
| `services/notifications/{native}`, `services/diagnostics/alerts` | Adaptar → `notifications.native.ts` | E-22 |
| `services/notifications/{plan,reminders,scheduler,backup-reminder}` | Portar (plano/ids) + adaptar | E-23 |
| `services/notifications/actions` | Adaptar | E-25 |
| `transactions/manual` + tela `transactions/manual` | Portar **se aprovado** (C-08, D-050 proposta) | E-17b |
| `maintenance.ts` | Avaliar no inventário | E-06 |
| `subscriptions/{catalog,money,draft,repo,service}` + `0005_subscriptions` (não versionados) | Portar; **remover cotação por API** (D-032) | E-26, E-27 |
| `subscriptions/detect` | Portar; medir a precisão ≥ 80% | E-29 |
| `components/{RatesPanel,ServiceAvatar}`, telas `subscriptions/*` | Só referência (sem logos, D-032) | E-26..E-29 |
| `app/**`, `components/**`, `theme/*` | Só referência de fluxo; UI nova (D-015..D-028) | E-01 em diante |

---

## 1. Visão geral

| Sprint | Etapas | Foco | PBIs |
|---|---|---|---|
| 0 — Base e spike | E-01, E-02 | Esqueleto + pipeline; decisão de cripto web e KDF | F-07 (APK cedo), F-03 (decisão) |
| 1 — Fundação segura | E-03..E-06 | Banco cifrado, bloqueio, backup, núcleo | F-03, F-01, F-06, F-07 |
| 2 — PWA e fundação de uso | E-07..E-11 | Instalação/offline no iPhone, onboarding, exportar/apagar, configurações, log, 1º APK release | F-08, F-06 (UI), F-04, F-01 (opções), F-05 |
| 3 — Importação I | E-12..E-15 | Ler CSV, perfis, ledger sem duplicata, arquivos grandes | C-01, C-02, C-03 |
| 4 — Importação II | E-16..E-19 | Categorização, correção, dashboard, demais bancos | C-04, C-05, C-06, C-02 |
| 5 — Contas | E-20..E-22 | Contas e recorrência, confiabilidade dos alertas, estratégia iPhone | A-01, A-03 |
| 6 — Lembretes | E-23..E-25 | Motor Android, faixa + `.ics` no iPhone, ações | A-04, A-05 |
| 7 — Assinaturas | E-26..E-29 | Cadastro, custo, renovação, detecção | S-01..S-04 |
| 8 — Compras I | E-30..E-34 | Listas, catálogo, EAN, preços | L-01, L-03, L-04 |
| 9 — Compras II | E-35..E-37 | Lista por CSV, histórico de preços | L-02, L-08, L-05 |
| 10 — Polimento e beta | E-38..E-40 | A11y/desempenho, segurança, pré-beta | — (critérios D-012) |

**Estimativa grosseira:** 40 etapas × 1–3 h; com o porte (D-045), Importação e Contas/Lembretes tendem ao limite inferior ⇒ ≈ 65–95 h + marcos manuais ⇒ **4–6 meses** a 5 h/semana. Se o porte render mais que o esperado, etapas vizinhas podem ser juntadas (ex.: E-16+E-17, E-20+E-21), sempre com aprovação. A data do beta é proposta no **M-0** (fim da E-11), com a velocidade medida (D-043).

### 1.1 Marcos de teste em aparelho real
| Marco | Quando | O quê | Critério |
|---|---|---|---|
| **M-0** Velocidade | Fim da E-11 | Medir horas reais por etapa (Sprints 0–2) e propor a data do beta | Data proposta registrada em `DECISIONS.md` (revisão de D-043) |
| **M-1a** Lembretes Android 14 dias | Começa no fim da E-23; OPPO antes do beta; 2º fabricante nas 2 primeiras semanas do beta (D-049) | OPPO (ColorOS 16): app fechado, reboot, economia de bateria, restauração de backup; depois um amigo Android de outro fabricante, com roteiro | 100% no horário (± tolerância do modo inexato); resultados em `docs/testes/` |
| **M-1b** Estratégia de alertas do iPhone | E-22/E-24 no WebKit; validação real na **J-2** | `.ics` importado no Calendário do iOS, com `VALARM` tocando; faixa ao abrir; badge (se houver) | Alarme toca; reexportar não duplica (ou degradação documentada) |
| **M-2** Backup cruzado | Prévia na E-05 (OPPO ↔ web no Chrome/WebKit); completo na **J-3** (E-40) | Backup OPPO → PWA no iPhone e o inverso, com dados de todos os módulos | Restauração equivalente (contagens + somas iguais) nos dois sentidos, **antes do beta** |
| **M-3** PWA offline e atualização | E-07 no WebKit/Chrome; real na **J-1**; revalidado na **J-3** | iPhone: instalar, modo avião, reabrir após dias, deploy A → B com faixa "Nova versão" | Abre em modo avião; dados persistem; atualização só com toque do usuário |
| **M-4** Beta 30 dias | Depois da E-40 | Amigos usando sem ajuda (D-012) | Critérios D-012 + BRD §3.2 |
| **J-1** Janela iPhone 1 | Logo depois da E-07 | Instalação, offline, OPFS/`persist()`, confirmação da medição da E-02, itens da fila | Fila zerada até a E-07 |
| **J-2** Janela iPhone 2 | Logo depois da E-24 | `.ics` com alarme (M-1b), faixa, badge, Web Share no modo instalado, itens da fila | Fila zerada até a E-24 |
| **J-3** Janela iPhone 3 | Na E-40 | M-2, M-3, VoiceOver nas telas principais, itens da fila | Fila zerada; sem J-3 → iPhone "experimental" no beta (D-049) |

---

## 2. Sprint 0 — Base e spike

### E-01 — Esqueleto do app, design system mínimo e pipeline
- **Sprint:** 0 · **PBIs:** F-07 (critério "APK de teste cedo"); base de D-015..D-018, D-026, D-028.
- **Objetivo:** o app abre nas 5 abas, com tema claro/escuro e componentes base, como APK de debug no OPPO e como preview no iPhone.
- **Porte (D-045):** `theme/index.ts` e `components/{ui,form,PinPad,Icon}.tsx` só como referência de fluxo; tokens novos do D-016.
- **Escopo:** limpar as rotas de exemplo do template; tokens em `src/ui/theme` (cores D-016, tipografia D-017, espaçamento/raio UX §5.3); tema automático + escolha manual (em memória até a E-10); componentes `AppText` (escala tipográfica), `Button`, `IconButton`, `Card`, `Banner`, `EmptyState`; layout de abas (Início · Gastos · Contas · Compras · Mais) com `EmptyState` em cada uma; coluna centralizada ~480 px no web (D-020); safe areas; `cmake.dir` reproduzível (config plugin ou variável de ambiente); scripts npm (`build:web`, `serve:web`, `android:debug`); teste de fronteira de imports; script "sem URL externa no `dist/`".
- **Fora de escopo:** persistência de preferências (E-10), ícone final (E-07/E-38), PWA/manifest (E-07), qualquer dado.
- **Dependências:** nenhuma (Fase 1 aprovada).
- **Plataformas:** Android = abas nativas, tema do sistema · iPhone/PWA = mesmas abas no Safari (ainda sem instalação/offline; declarado). Portas tocadas: nenhuma.
- **Tarefas:**
  - [ ] Decidir ícones das abas: **propor** `react-native-svg` antecipado (já previsto no D-021) para ícones próprios; plano B: glifos Unicode. Avisar antes de instalar.
  - [ ] Levantar dependências do template sem uso (`@expo/ui`, `expo-glass-effect`, `expo-symbols`…) e as 8 vulnerabilidades do `npm audit`; **propor** remoção (só com OK).
  - [ ] Tokens + `ThemeProvider` + componentes base com `accessibilityRole/Label` e alvos ≥ 48.
  - [ ] `src/app/(tabs)/_layout.tsx` + 5 telas vazias; título e rótulos curtos.
  - [ ] Config plugin `cmake.dir` (ou variável documentada) e build `npx expo prebuild -p android` + `gradlew assembleDebug` do zero.
  - [ ] `tests/architecture/boundaries.test.ts` (core sem react/expo/platform; nada importa `expo-*` fora de `src/platform`).
  - [ ] `scripts/check-no-external-urls` sobre `dist/`.
- **Critérios de aceite:** (1) APK de debug instala e abre no OPPO nas 5 abas; (2) preview abre no Chrome do OPPO e no Playwright WebKit nas 5 abas (Safari do iPhone vai para a fila da J-1); (3) tema segue o sistema e pode ser trocado em Mais; (4) contraste dos tokens ≥ 4,5:1 (texto) e ≥ 3:1 (componentes) nos dois temas, **calculado em teste**; (5) build Android reproduzível em clone limpo seguindo o README; (6) fronteira de imports e "sem URL externa" verdes.
- **Testes:** U (contraste WCAG calculado dos tokens; fronteira) · E: não (Playwright entra na E-03) · M: navegação das abas com TalkBack/VoiceOver; fonte do sistema em 200% (rótulos das abas) ⓜ.
- **UX/a11y/segurança:** abas com ícone + rótulo; rótulos a 200% (D-018, risco conhecido); foco visível no web; nenhuma URL externa; `noindex` no preview.
- **Demonstração:** APK: 5 abas, tema claro/escuro seguindo o sistema, troca manual em Mais. URL: as mesmas 5 abas no iPhone, coluna centralizada no desktop.
- **Riscos / plano B:** MAX_PATH/CMake no Windows → script com caminho curto + doc em `PROVA-DE-VIDA.md`; abas a 200% não cabem → só ícone visível + rótulo acessível (testado).
- **Status:** [ ] pendente

### E-02 — SPIKE: criptografia do banco no web e KDF
- **Sprint:** 0 · **PBIs:** F-03 (estratégia web), F-01/F-06 (KDF). Decisões D-004, D-039.
- **Objetivo:** escolher, por medição (WebKit, Chrome desktop e Chrome do OPPO agora; iPhone na J-1, D-049), a estratégia de cifra do banco no web e a KDF única (PIN e backup), registrando ADRs.
- **Porte (D-045):** `backup/kdf.ts` e `security/pin/pin-hash.ts` (`@noble/hashes`: Argon2id e PBKDF2) entram como candidata forte da KDF; `@noble/ciphers` como plano B de AES-GCM.
- **Escopo:** branch `spike/web-encryption` (código **descartável**, não vai para a `main`); gerador de dados sintéticos (~10 mil transações, reaproveitável em `tests/fixtures/generators/`, este sim vai para a `main`); bancada comparando as 3 opções do D-004: (1) banco em memória + snapshot AES-GCM no OPFS, (2) cifra por coluna na aplicação, (3) SQLite WASM com cifra por página (verificar a documentação atual de builds como SQLite3 Multiple Ciphers / SQLCipher WASM e o encaixe com o `expo-sqlite` web); KDF: (a) PBKDF2-SHA-256 (WebCrypto no web; lib JS ou WebCrypto do runtime no Android, **verificar** o que o Hermes/SDK 58 oferece), (b) Argon2id JS/WASM nos dois, (c) módulo nativo. Modelo de chaves a decidir: **DEK aleatória envolvida por KEK derivada do PIN** (proposta) × chave derivada direto do PIN.
- **Fora de escopo:** UI de produto, porta `db` definitiva (E-03), passkey (R2, D-003).
- **Dependências:** E-01 (pipeline de preview e APK).
- **Plataformas:** iPhone/PWA = **sem iPhone (D-049)**: bancada web medida no Playwright WebKit, no Chrome desktop e no Chrome do OPPO (aproximação de navegador móvel); confirmação no Safari do iPhone na **J-1** · Android = bancada de KDF numa tela de debug do APK (a mesma KDF precisa dar **saída idêntica** nos dois). Portas exploradas: `db`, `crypto`, `kdf`.
- **Tarefas:**
  - [ ] Gerador sintético determinístico (semente fixa): contas, ~10 mil `txn`, categorias.
  - [ ] Bancada web: para cada opção, medir abrir/carregar, inserir 1 transação (custo de persistir), consulta do dashboard, pico de memória (o que der para medir no Safari; registrar o método), tamanho extra no bundle.
  - [ ] Bancada KDF: tempo no OPPO e no iPhone para parâmetros candidatos (alvo ≈ 1–2 s, D-041); vetor de teste com saída igual nos dois.
  - [ ] Verificar recomendações atuais (OWASP) para PBKDF2/Argon2id e registrar a fonte e a data.
  - [ ] ADR **D-046** (cifra do banco web) e **D-047** (KDF + parâmetros + modelo de chaves); atualizar D-004/D-039, TRD §1/§2.1/§10.1, matriz (F-03), skills `sqlite-web-encrypted` e `backup-cross-platform`.
- **Critérios de aceite:** (1) tabela de medições por opção no WebKit, no Chrome desktop e no Chrome do OPPO, com método descrito; (2) a opção escolhida carrega ~10 mil transações em **≤ 1 s nos aproximadores** (margem para os ≤ 2 s no iPhone), e o ADR fica **provisório até a J-1**; (3) KDF escolhida em ≈ 1–2 s no OPPO e no WebKit, com vetor de teste idêntico; (4) dependência nova (se houver) justificada: bundle web/nativo, manutenção, licença GPL-3.0-compatível, suporte web **e** Android; (5) nenhuma linha do spike na `main` além de ADR/docs e do gerador.
- **Testes:** U (gerador determinístico; vetor KDF) · M: medições no iPhone e no OPPO ⓜ.
- **UX/a11y/segurança:** STRIDE da opção escolhida (I: aparelho perdido; força bruta do PIN de 10⁶ combinações → KDF + espera crescente); chave não-extraível e só em memória no web.
- **Demonstração:** URL do preview do spike mostrando a tabela de tempos no iPhone; tela de debug no APK com o tempo da KDF. (Não é UI de produto.)
- **Riscos / plano B:** nenhuma opção cumpre 2 s → cifra por coluna só nos campos sensíveis (descrição, valor, nome) + índices em claro, documentado no STRIDE; Argon2id lento no Hermes → PBKDF2 com iterações altas; medição real na J-1 pior que o esperado → trocar para o plano B antes de haver dados reais no iPhone (o beta ainda não começou).
- **Status:** [ ] pendente

---

## 3. Sprint 1 — Fundação segura

### E-03 — Porta de banco, migrações e testes de contrato
- **Sprint:** 1 · **PBIs:** F-03; F-07 ("esquema SQLite com migrações versionadas"); L-01 (convenção UUID desde o início).
- **Objetivo:** `src/platform/db` com adaptador nativo (SQLCipher) e web (decisão da E-02), migrações compartilhadas e a mesma suíte de contrato passando nos dois.
- **Porte (D-045):** `db/migrations/runner.ts` (append-only, checksum) e `db/transaction.ts` → `src/storage`; `db/client.ts` (SQLCipher) → base do `db.native.ts`; `schema/0000..0004` como referência, reescritos no modelo do TRD §3 (UUID, centavos, `deleted_at`).
- **Escopo:** interface orientada a caso de uso (`open(key)`, `exec`, `query`, `transaction`, `close`, `destroy`, `capabilities()`); `db.native.ts` (`expo-sqlite` + `useSQLCipher`, `PRAGMA key`, checagem de `cipher_version`; verificar a doc atual); `db.web.ts` (estratégia D-046; `.wasm` no Metro + COOP/COEP no dev); `db.fake.ts`; `src/storage/migrations` com runner transacional e `schema_migrations`; migração 001: `app_settings`, `event_log`, `lock_state`; convenções do TRD §3 (UUID TEXT via porta `crypto`, centavos INTEGER, `created_at/updated_at`, `deleted_at`, `foreign_keys=ON`); config plugin `allowBackup=false`; rota `/dev/selftest` + script Android; **Playwright** (Chromium + WebKit) contra `wrangler pages dev`; tela **Diagnóstico** mínima (estado do banco, versão do esquema).
- **Fora de escopo:** chave real do usuário (provedor de chave **de desenvolvimento**, marcado e substituído na E-04; só dados sintéticos até lá); tabelas de módulos.
- **Dependências:** E-02 (D-046).
- **Plataformas:** Android = SQLCipher, arquivo cifrado · iPhone/PWA = estratégia D-046 sobre OPFS (≈, declarado na matriz). Portas: `db`, `crypto` (UUID/random).
- **Tarefas:**
  - [ ] `npx expo install expo-sqlite` (+ `expo-crypto` se ainda não houver), com aviso.
  - [ ] Interface + 3 adaptadores (`satisfies`).
  - [ ] Runner de migrações + 001 + teste "do zero" e "incremental" (002 fictícia só no teste).
  - [ ] Suíte de contrato única (`src/storage/__contract__`) rodando no fake (Jest), no web (Playwright) e no Android (autoteste).
  - [ ] Config plugins `useSQLCipher` e `allowBackup=false`; conferir o `AndroidManifest` gerado.
  - [ ] Playwright: instalação (avisar: baixa navegadores), `playwright.config`, job `e2e:web`.
- **Critérios de aceite:** (1) contrato verde nos 3 adaptadores (transação tudo-ou-nada, rollback, `UNIQUE`, `foreign_keys`); (2) arquivo do banco no Android **não** abre sem a chave e não começa com `SQLite format 3`; (3) no web, os bytes no OPFS não contêm um marcador sintético gravado em claro; (4) `allowBackup="false"` no manifest gerado; (5) migração aplicada duas vezes não muda nada; (6) Diagnóstico mostra "Banco cifrado · esquema v1" nas duas plataformas; (7) `crossOriginIsolated === true` no preview.
- **Testes:** C (fake) · I (Android pelo autoteste; web por Playwright Chromium/WebKit) · M: autoteste no Safari do iPhone e no OPPO.
- **UX/a11y/segurança:** chave nunca em log/erro; erros de banco viram `PlatformError` sem dados; STRIDE (I: aparelho perdido) atualizado.
- **Demonstração:** APK e URL: Mais → Diagnóstico com "Banco cifrado · esquema v1" e o resultado do autoteste (verde).
- **Riscos / plano B:** `useSQLCipher` conflita com algo do SDK 58 → seguir a doc/issue e, se preciso, `op-sqlcipher` (nova dependência, avisar); WebKit do Playwright ≠ Safari iOS → o teste manual no iPhone continua obrigatório.
- **Status:** [ ] pendente

### E-04 — Bloqueio: PIN, KDF, espera crescente, biometria e guarda da chave
- **Sprint:** 1 · **PBIs:** F-01 (e chave de F-03).
- **Objetivo:** o app só mostra dados depois do PIN (ou da biometria no Android), e a chave do banco nunca fica exposta.
- **Porte (D-045):** `security/lock/lock-machine.ts` e `lock-store.ts` → `src/core/lock`; `pin/pin-hash.ts` (depois da D-047); `keystore/db-key.ts`, `secure-kv.ts`, `biometrics.ts` → base dos adaptadores `.native.ts`; `AppLockProvider.tsx` como referência.
- **Escopo:** portas `local-auth` (Android: biometria; web: `supported:false`), `secure-key` (Android: chave aleatória guardada no Keystore, liberada após autenticação; web: DEK envolvida pela KEK do PIN, só em memória, conforme D-047), `kdf` (D-047), `lifecycle` (2º plano); core puro: política de bloqueio (espera crescente, contador persistido em `lock_state`); telas **Criar PIN** e **Bloqueio** (`PinPad`, UX §4.2); trava 1 min após ir para o 2º plano (padrão fixo; opções na E-10); "Esqueci o PIN" mostra o texto de UX §7 (o fluxo de apagar vem na E-09).
- **Fora de escopo:** passkey/Face ID (R2, D-003); opções de tempo e bloqueio de print (E-10); onboarding completo (E-08).
- **Dependências:** E-03.
- **Plataformas:** Android = PIN 6 + biometria (falhou → PIN) · iPhone/PWA = só PIN (≈, D-003). Portas: `local-auth`, `secure-key`, `kdf`, `lifecycle`, `db`.
- **Tarefas:**
  - [ ] Verificar a doc atual e instalar (`npx expo install`, com aviso) a lib de biometria e a de armazenamento seguro do Expo SDK 58; confirmar o suporte web (adaptador web não as importa).
  - [ ] Core `src/core/lock`: estados, tentativas, cálculo da espera (relógio injetado).
  - [ ] Adaptadores + fakes + contrato.
  - [ ] Telas Criar PIN / Bloqueio; anúncio "N de 6 dígitos".
  - [ ] Trocar o provedor de chave de desenvolvimento da E-03 pela chave real; dados sintéticos antigos descartados.
- **Critérios de aceite (F-01):** (1) primeira abertura cria PIN de 6 dígitos e, no Android, oferece biometria; (2) app trava após 1 min em 2º plano; (3) após 5 PINs errados, espera crescente que **sobrevive a fechar/recarregar** o app; (4) PIN nunca em claro: só verificador/derivação com sal e parâmetros versionados; (5) sem e-mail, senha ou conta; (6) conteúdo nunca visível por trás da tela de bloqueio.
- **Testes:** U (política de espera com relógio fake; vetores KDF) · C (secure-key, local-auth fakes) · I (abrir o banco com a chave liberada; chave errada falha) · E (web: PIN, espera persiste após reload) · M: biometria e fallback no OPPO; 2º plano 1 min; matar o app durante a espera ⓜ.
- **UX/a11y/segurança:** `PinPad` com teclas ≥ 56, nunca anuncia dígitos; mensagens de UX §7; STRIDE (S e força bruta); chave web `extractable:false`; nada em `localStorage`.
- **Demonstração:** APK: criar PIN, ativar biometria, sair 1 min e voltar → bloqueio. URL: criar PIN, errar 5× → "Aguarde 30 s", recarregar → espera continua.
- **Riscos / plano B:** etapa grande → dividir em **E-04a** (PIN + KDF + chave + espera) e **E-04b** (biometria + trava por 2º plano); biometria não libera a chave do Keystore com a lib do Expo → chave protegida por PIN no Android também (degradação documentada).
- **Status:** [ ] pendente
- **Curva da espera crescente (aceita, D-029):** 30 s → 1 min → 2 min → 5 min → 15 min (teto).

### E-05 — Backup único criptografado: formato, ida e volta, entre plataformas
- **Sprint:** 1 · **PBIs:** F-06 (formato, restauração, teste automatizado). D-008.
- **Objetivo:** um arquivo `.cedbkp` gerado no Android restaura no PWA e vice-versa, com teste automatizado de ida e volta.
- **Porte (D-045):** `backup/format.ts`, `kdf.ts`, `errors.ts` (envelope, AAD, limites anti-DoS) → `src/core/backup`; **conteúdo novo** (dump lógico, D-008) no lugar do snapshot `sqlcipher_export`; magic `CEDBKP`.
- **Escopo:** core `src/core/backup` (`serializeBackup`/`parseBackup`, header autenticado como AAD, `formatVer` 1, `schemaVersion`); dump lógico neutro gerado a partir do registro de tabelas do `src/storage` (nunca o `.db` cru); compressão **a verificar** (se não houver API comum Hermes/web, `formatVer 1` sem compressão, com flag no header); restauração numa transação + evento `backup.restored` (para reagendar alertas depois); porta `files` (salvar/compartilhar e escolher arquivo; Android: seletor/Compartilhar; web: Web Share com arquivo ou download + `<input type=file>`); tela **Mais → Backup** mínima (fazer backup com senha + confirmação; restaurar com arquivo + senha + confirmação "substitui tudo"); data do último backup em `app_settings`; vetores `tests/fixtures/backup/v1-android.cedbkp` e `v1-web.cedbkp`, gerados **em cada plataforma** a partir da semente sintética.
- **Fora de escopo:** lembretes de backup (E-08 no iPhone; E-23 no Android), aviso "há N dias" no Início (E-08).
- **Dependências:** E-03, E-04 (KDF).
- **Plataformas:** Android = Compartilhar/seletor do sistema · iPhone/PWA = Web Share com arquivo (testar no standalone) ou download; abrir só pelo seletor (≈). Portas: `crypto`, `kdf`, `files`, `db`.
- **Tarefas:**
  - [ ] Core + testes (ida e volta, senha errada, 1 byte alterado, truncado, `schemaVersion` maior → "atualize o app").
  - [ ] Porta `files` (+ fake); verificar a doc atual das libs de arquivo/compartilhar do Expo (avisar dependência).
  - [ ] Botão de semente sintética no autoteste (nunca na produção).
  - [ ] Gerar os 2 vetores (um no OPPO, um no iPhone/Chrome), commitar e testar no Jest que ambos decifram e restauram iguais.
  - [ ] Atualizar TRD §10.1 com o formato fechado e a matriz (F-06, Web Share).
- **Critérios de aceite (F-06):** (1) um único arquivo cifrado com senha do usuário, com banco e configurações; (2) sem a senha não abre; aviso de "sem recuperação"; (3) restaurar valida integridade e versão do esquema e só substitui após confirmação, numa transação; (4) teste automatizado de ida e volta = banco equivalente; (5) arquivo salvo pelo seletor/Compartilhar do sistema; (6) vetor Android restaura no web e vetor web restaura no Android; (7) ~10 mil transações em ≤ 10 s (D-041), medido.
- **Testes:** U · G (vetores por `formatVer`) · I (restaurar nos dois adaptadores) · E (web: backup → apagar → restaurar) · M: **prévia do M-2** (OPPO → iPhone e iPhone → OPPO com dados sintéticos) ⓜ.
- **UX/a11y/segurança:** IV de 12 bytes e sal ≥ 16 bytes aleatórios; chaves/PIN nunca no arquivo; senha com confirmação; textos de UX §4.10.
- **Demonstração:** APK: Backup → arquivo salvo no Drive/Arquivos; restaurar arquivo vindo do iPhone. URL: o inverso.
- **Riscos / plano B:** etapa grande → **E-05a** (core + Jest) e **E-05b** (UI + vetores cruzados); Web Share de arquivo falha no standalone → download (D-029); memória do iPhone no backup grande → processar em blocos.
- **Status:** [ ] pendente

### E-06 — Inventário e porte do núcleo (F-07): base pura, golden do core e CI
- **Sprint:** 1 · **PBIs:** F-07.
- **Objetivo:** o inventário do código antigo está fechado e a base pura (dinheiro, datas, eventos, ids, texto) está portada para `src/core`, com vetores golden passando no Jest **e no aparelho**, mais a CI.
- **Porte (D-045):** `lib/{bytes,text,time}`, `events/*`, `core/parsing/values`, `security/privacy/mask`, `logging/sanitize`, `categorization/normalize` (ver §0.4).
- **Escopo:** `docs/F-07-inventario.md`: arquivo a arquivo do `dia-a-dia` (≈ 11,2 mil linhas), decisão **reaproveitar / adaptar / reescrever / descartar**, etapa de destino, contrato (critérios do backlog/BRD) e divergências com as decisões vigentes (refina a tabela do §0.4); `money` (centavos, `R$ 1.234,56`, parser BR sem `parseFloat`); `dates` (`AAAA-MM-DD`, somar dias/meses com "dia inexistente → último dia", dia da semana, último dia útil seg–sex, "hoje em America/Sao_Paulo" a partir de um instante); `events` (barramento tipado em memória: `transaction.imported`, `backup.restored`…); `text` (normalizar acentos/caixa/espaços); vetores `tests/fixtures/core/*.json`; checagem de `Intl` com `timeZone` no Hermes (D-038); **CI GitHub Actions** (D-042).
- **Fora de escopo:** recorrência completa de contas (E-20), parser de CSV (E-12).
- **Dependências:** E-01 (o núcleo não depende de E-03..E-05).
- **Plataformas:** = nas duas (core puro); vetores executados no autoteste do APK e do PWA. Portas: `clock`.
- **Tarefas:**
  - [ ] Inventário + contratos (incluindo a decisão sobre `transactions/manual` e `maintenance.ts`, perguntando antes).
  - [ ] Testes de caracterização do comportamento antigo → porte de `money`, `dates`, `events`, `text`, `ids` (interface; implementação via porta `crypto`).
  - [ ] Vetores golden + runner comum (Jest e autoteste).
  - [ ] `Intl` no Hermes: registrar o resultado em D-038 e na skill; o core não depende dele.
  - [ ] `.github/workflows/ci.yml` (`npm ci`, `tsc`, `jest`, `expo-doctor`, export web, sem URL externa, rota de autoteste ausente no build de produção). Sem deploy; sem push pelo agente.
- **Critérios de aceite (F-07):** (1) inventário com decisão por módulo (reaproveitar/adaptar/reescrever); (2) nada de auth/lar/RLS/filas/servidor portado (o `dia-a-dia` já era local; conferido no inventário); (3) esquema com migrações versionadas (feito na E-03, referenciado); (4) **golden do core passa no aparelho** (APK e PWA); golden de perfis de banco: E-12/E-13; (5) funciona sem rede; (6) APK cedo (E-01).
- **Testes:** U (incluindo `TZ=America/Sao_Paulo` e `TZ=UTC`, viradas de mês/ano, 29/02, horário de verão histórico) · G (vetores) · I (autoteste nos dois) .
- **UX/a11y/segurança:** formatação de valor também produz o **rótulo falado** ("cento e oitenta e dois reais", "menos …") para o `MoneyText`.
- **Demonstração:** APK e URL: autoteste mostra "Núcleo: N/N vetores OK"; Diagnóstico mostra "Intl com fuso: sim/não".
- **Riscos / plano B:** `Intl` sem fuso no Hermes → offset fixo −03:00 (São Paulo sem horário de verão desde 2019) só para "hoje"; datas de extrato são só datas.
- **Status:** [ ] pendente

---

## 4. Sprint 2 — PWA e fundação de uso

### E-07 — PWA instalável, offline e atualização de versão (+ trava "instale primeiro")
- **Sprint:** 2 · **PBIs:** F-08 (passo 0, D-002), L-01 (pré-requisito offline); TRD §9.
- **Objetivo:** no iPhone, o app só é usado instalado na Tela de Início, abre em modo avião e avisa quando há versão nova.
- **Escopo:** `manifest.webmanifest`, `+html.tsx` (meta do iOS, `apple-touch-icon` 180, `viewport-fit=cover`); ícone **provisório** casa + ✓ (D-014; arte final na E-38); service worker (decidir **SW próprio gerado no build × Workbox** por ADR, com justificativa e aviso de dependência); pré-cache do shell + `.wasm`; cache = hash do build; faixa "Nova versão disponível" → `SKIP_WAITING` só com toque; portas `install-state` e `storage-persistence` (`persist()` após gesto; `estimate()` no Diagnóstico); tela **Instalar na Tela de Início** (bloqueia; sem "pular"); `_headers` com a CSP final do TRD §9, ajustada **com evidência**; flag de build só para preview/e2e que dispensa a instalação (`EXPO_PUBLIC_ALLOW_BROWSER`), proibida na produção (checagem na CI).
- **Fora de escopo:** onboarding passos 1–4 (E-08).
- **Dependências:** E-03 (banco web), E-06 (CI).
- **Plataformas:** Android = sem mudança (`install-state` sempre "instalado"; atualização via APK, D-007) · iPhone/PWA = instalação obrigatória, offline, atualização com aviso. Portas: `install-state`, `storage-persistence`.
- **Tarefas:**
  - [ ] Verificar a doc atual do Expo (web/PWA, `+html`) e do WebKit (manifest/iOS 18–26).
  - [ ] ADR do service worker; implementação; versionamento por hash.
  - [ ] Tela Instalar (UX §4.1) com instruções do iOS.
  - [ ] Playwright: offline após 1ª carga, deploy A → B (faixa), headers/CSP sem violação no console, `crossOriginIsolated`, axe na tela Instalar.
- **Critérios de aceite:** (1) aberto no Safari, mostra só "Instalar"; (2) instalado, abre e funciona em modo avião; (3) dados persistem após fechar e reabrir dias depois; (4) nova versão nunca recarrega sozinha: faixa + toque; (5) CSP sem violações; nenhum recurso de terceiros; (6) `persist()` e uso/cota visíveis no Diagnóstico.
- **Testes:** E (offline, atualização, headers, axe) · M: **M-3 (1ª passada)** no iPhone: instalar, modo avião, atualizar ⓜ.
- **UX/a11y/segurança:** faixa de versão anunciada (`aria-live`); SW nunca guarda dados; CSP `connect-src 'self'` sem exceção (D-032).
- **Demonstração:** URL: Safari mostra "Instale"; pelo ícone abre; modo avião continua funcionando; segundo deploy → faixa "Nova versão". APK: sem mudança visível.
- **Riscos / plano B:** CSP quebra o export do Expo → ajustar só a diretiva necessária com evidência; iOS ignora parte do manifest → meta tags `apple-*`.
- **Status:** [ ] pendente

### E-08 — Onboarding em 4 passos, ajuda e avisos de backup
- **Sprint:** 2 · **PBIs:** F-08, F-06 (lembrete no iPhone e "há N dias"), F-04 (texto curto de privacidade na 1ª abertura).
- **Objetivo:** uma pessoa sem ajuda instala, cria o PIN, entende o backup e escolhe o primeiro passo.
- **Escopo:** passos 1–4 do D-023 (boas-vindas + privacidade, criar PIN (reusa E-04) + biometria, backup: risco + lembrete, primeiro passo); aviso "PIN esquecido não tem recuperação"; Início com "💾 Backup: há N dias" (âmbar > 30 dias Android / > 7 dias iPhone); lembrete **semanal dentro do app** no iPhone (faixa); tela **Sobre/ajuda**: instalar o APK (Android) e "Adicionar à Tela de Início" (iPhone); texto de privacidade (UX §8).
- **Fora de escopo:** lembrete mensal por notificação no Android (E-23, precisa da porta `notifications`); ajuda de exportar CSV por banco (E-12/E-19).
- **Dependências:** E-04, E-05, E-07.
- **Plataformas:** Android = 4 passos, biometria, lembrete mensal configurado (disparo na E-23) · iPhone/PWA = passo 0 (E-07) + 4 passos, só PIN, lembrete semanal no app (≈).
- **Tarefas:** [ ] rotas de onboarding + estado "concluído" em `app_settings` · [ ] componente de faixa de backup · [ ] telas Sobre/ajuda e Privacidade · [ ] e2e do fluxo completo.
- **Critérios de aceite:** (1) primeira abertura percorre os passos sem atalhos que pulem o PIN; (2) o usuário escolhe o lembrete de backup; (3) Início mostra "Backup: há N dias" e fica âmbar no limite da plataforma; (4) sem backup → aviso persistente, sem bloquear o uso; (5) texto de privacidade acessível na 1ª abertura e em Mais.
- **Testes:** U (cálculo "há N dias"/limiar com relógio fake) · E (onboarding + axe) · M: **teste de corredor** com 1 pessoa não técnica (pode ser adiado para a E-40) ⓜ.
- **UX/a11y/segurança:** linguagem simples (D-024); fonte 200% em todas as telas do onboarding; foco inicial correto em cada passo.
- **Demonstração:** APK e URL: instalar/abrir do zero → 4 passos → Início com "Backup: nunca feito".
- **Riscos / plano B:** onboarding longo demais → medir com o teste de corredor e encurtar textos.
- **Status:** [ ] pendente

### E-09 — Exportar e apagar meus dados
- **Sprint:** 2 · **PBIs:** F-04. D-035.
- **Objetivo:** o usuário exporta os dados em JSON/CSV e apaga tudo com confirmação forte.
- **Porte (D-045):** `data-rights/export-data.ts` e `wipe.ts` (Android) → referência; o wipe web é novo.
- **Escopo:** "Exportar meus dados" (JSON completo + CSV de transações; formato exato a confirmar na etapa: 2 arquivos ou 2 botões) com aviso "não criptografado"; "Apagar todos os dados": PIN/biometria + digitar APAGAR; Android: banco, chave do Keystore, notificações agendadas (hook vazio até a E-23), temporários, preferências; web: OPFS, chaves/metadados, caches e registro do SW, storage; volta ao onboarding; fluxo "Esqueci o PIN" → restaurar backup ou apagar.
- **Dependências:** E-04, E-05 (porta `files`), E-07.
- **Plataformas:** Android = Compartilhar nativo · iPhone/PWA = Web Share/download (= ?, conforme E-05). Portas: `files`, `db`, `secure-key`, `notifications` (hook).
- **Tarefas:** [ ] serializadores JSON/CSV no core (CSV com proteção contra injection) · [ ] `wipeAll()` por plataforma · [ ] telas UX nº 38 e 41 · [ ] e2e "apagar → onboarding".
- **Critérios de aceite (F-04):** (1) exportar gera JSON e CSV e abre o compartilhamento do sistema, com aviso; (2) apagar exige autenticação + palavra; (3) depois de apagar, nada do usuário resta (verificado no autoteste: banco ausente, chave ausente, OPFS vazio, caches vazios); (4) backups externos não são apagados (aviso).
- **Testes:** U (serialização, injection) · I (wipe nos dois adaptadores) · E · M: apagar no OPPO e no iPhone instalado ⓜ.
- **UX/a11y/segurança:** ação irreversível com confirmação explícita (D-027); microcopy UX §7; nenhum dado em log durante o wipe.
- **Demonstração:** APK/URL: Mais → Exportar (arquivos no Drive/Arquivos); Apagar → onboarding de novo.
- **Riscos / plano B:** Keystore não apaga a chave pela lib → sobrescrever + documentar.
- **Status:** [ ] pendente

### E-10 — Configurações, modo privacidade e proteção de tela
- **Sprint:** 2 · **PBIs:** F-01 (tempo configurável, capturas/Recentes), D-015, D-022, D-029, D-035.
- **Objetivo:** o usuário ajusta tema, tempo de trava, captura de tela e o modo privacidade, e as escolhas persistem.
- **Porte (D-045):** `security/privacy/PrivacyShield.tsx` (`expo-screen-capture`) → base do adaptador `screen-security.native.ts`; `privacy/mask.ts` já portado na E-06.
- **Escopo:** Configurações (UX nº 39): tema (auto/claro/escuro, persistido), trava (imediato/1/5/15 min), bloquear print/Recentes (Android, **ligado por padrão**), mês financeiro "começa no dia N" e semana dom/seg (D-035; consumidos depois); `MoneyText` com modo privacidade global 👁 (`R$ ••••`, leitor "valor oculto", lembrado); porta `screen-security` (verificar a lib atual; web `supported:false`).
- **Dependências:** E-04, E-06.
- **Plataformas:** Android = proteção de tela ligada · iPhone/PWA = ✕ proteção de tela → modo privacidade (declarado na tela). Portas: `screen-security`, `db`.
- **Tarefas:** [ ] repositório de `app_settings` · [ ] porta + adaptadores · [ ] `MoneyText` e contexto de privacidade · [ ] tela.
- **Critérios de aceite:** (1) preferências persistem após reiniciar; (2) com proteção ligada, print bloqueado e Recentes sem conteúdo no Android; (3) 👁 oculta todos os valores visíveis, inclusive para o leitor; (4) iPhone explica que não há bloqueio de print.
- **Testes:** U (privacidade no formatador) · C · E (persistência e 👁) · M: print/Recentes no OPPO; TalkBack lendo "valor oculto" ⓜ.
- **Demonstração:** APK: tentar print → bloqueado; 👁 oculta valores. URL: 👁 e tema persistem.
- **Riscos / plano B:** lib de proteção de tela incompatível → flag de janela via config plugin próprio (avisar).
- **Status:** [ ] pendente

### E-11 — Diagnóstico, log local e 1º APK release assinado (M-0)
- **Sprint:** 2 · **PBIs:** F-05; F-07 (APK); D-007.
- **Objetivo:** o autor diagnostica falhas sem ver dados sensíveis, e existe um APK release assinado para os amigos.
- **Porte (D-045):** `logging/logger.ts`, `rotation.ts`, `sanitize.ts` → `src/core/log` + repositório; `services/diagnostics` como referência.
- **Escopo:** `event_log` com níveis, rotação (7 dias / 1 MB), API tipada que aceita só campos permitidos (sem valores, descrições ou contas); eventos: backup, restauração, wipe, falhas (importação/alertas entram nas etapas deles); tela Diagnóstico (versão semver + `versionCode`, esquema, armazenamento, persistência, autoteste só no debug) com "Compartilhar log"; build **release** `arm64-v8a` + `armeabi-v7a`, assinado conforme `docs/ASSINATURA.md` (keystore e senha **só com o Kaynan**; o agente não lê nem grava); **M-0**: medir as horas das etapas E-01..E-11 e propor a data do beta.
- **Dependências:** E-03, E-05 (porta `files`).
- **Plataformas:** = nas duas (log no banco; compartilhar por Compartilhar/Web Share/download).
- **Critérios de aceite (F-05):** (1) log estruturado com níveis e rotação; (2) nenhum dado financeiro (teste que tenta gravar um campo proibido e falha); (3) Diagnóstico com "Compartilhar log"; (4) APK release assinado instala no OPPO; como debug e release têm assinaturas diferentes, a troca (desinstalar o debug) fica documentada; (5) versão visível no app.
- **Testes:** U (rotação, filtro de campos) · I · M: instalar o release no OPPO e num Android 10 de 32 bits, se houver ⓜ.
- **Demonstração:** APK release: Mais → Diagnóstico → versão + compartilhar log. URL: o mesmo Diagnóstico com armazenamento/persistência.
- **Riscos / plano B:** assinatura falha no Windows → seguir `docs/ASSINATURA.md`; a keystore nunca entra no git.
- **Status:** [ ] pendente

---

## 5. Sprint 3 — Importação I

> Pré-requisito do sprint: **script local de anonimização** + CSVs anonimizados dos bancos do Kaynan (D-036/D-045). O código antigo não tem golden files; o contrato é BRD §5.2 + backlog + comportamento do `dia-a-dia` (caracterização).

### E-12 — Ler CSV: bytes → codificação → delimitador → prévia (+ script de anonimização)
- **Sprint:** 3 · **PBIs:** C-01 (parte), F-08 (ajuda "como exportar"), F-07 (golden de banco).
- **Objetivo:** o usuário escolhe um CSV e vê uma prévia correta das linhas, nas duas plataformas.
- **Porte (D-045):** `import/stream/csv-tokenizer.ts`, `sniff.ts`, `limits.ts` → `src/core/csv` (valores BR já portados na E-06); `stream/reader.ts` (leitura em blocos de 64 KB) → adaptador da porta `files`.
- **Escopo:** `scripts/anonymize-csv` (roda localmente, fora do git; preserva layout, troca descrições/valores/contas; o agente nunca vê o original); core `src/core/csv`: detecção de codificação (UTF-8 estrito → Windows-1252; verificar suporte no Hermes), BOM, delimitador, RFC 4180, números/datas BR; limites 10 MB / 50 mil linhas (verificação); tela **Importar: escolher arquivo** + prévia de 5 linhas; erro amigável sem ecoar conteúdo; golden de decodificação em `tests/fixtures/csv/<banco>/`.
- **Dependências:** E-05 (`files`: escolher arquivo), E-06.
- **Plataformas:** Android = seletor do sistema · iPhone/PWA = seletor no app (≈; "Abrir com" na E-15).
- **Critérios de aceite:** (1) CSVs UTF-8, UTF-8 com BOM e Windows-1252 decodificados certo; (2) `;`, `,` e tab detectados; (3) aspas com delimitador/quebra de linha dentro; (4) acima dos limites → mensagem clara, nada importado; (5) erro aponta linha/coluna sem mostrar o conteúdo; (6) golden files dos bancos disponíveis passam no Jest e no autoteste.
- **Testes:** U · G · I (autoteste lê os golden nos dois) · E (escolher arquivo sintético → prévia) · M: arquivo real **anonimizado** nos dois aparelhos.
- **UX/a11y/segurança:** prévia em lista acessível; CSV original não é guardado (D-035).
- **Demonstração:** APK/URL: Gastos → Importar → escolher → prévia.
- **Riscos / plano B:** Windows-1252 sem `TextDecoder` no Hermes → tabela de decodificação própria no core (pequena).
- **Status:** [ ] pendente

### E-13 — Perfis de banco e mapeamento manual (bancos do Kaynan)
- **Sprint:** 3 · **PBIs:** C-02, C-01 (detecção de formato).
- **Objetivo:** o app reconhece o banco pelo cabeçalho e, se não reconhecer, deixa o usuário mapear as colunas e salvar o perfil.
- **Porte (D-045):** `import/profiles/{builtin,detect,types,repo}.ts`, `row-mapper.ts`, telas `import/mapping`/`preview` como referência; perfis dos 6 bancos-alvo (D-048) portados: Nubank, Itaú, Bradesco, BB, Caixa, Inter.
- **Escopo:** perfis embutidos versionados (2–3 bancos com amostra anonimizada); detecção por cabeçalho normalizado; tabela `bank_profile` (migração 002) + `account` (`mask_last4`); tela **Prévia/mapeamento** (UX nº 12) com seleção de conta; golden `<caso>.csv` → `<caso>.expected.json` (linhas normalizadas em centavos e `AAAA-MM-DD`).
- **Dependências:** E-12.
- **Plataformas:** = (core); perfis novos chegam por APK novo × deploy do PWA (matriz C-02).
- **Critérios de aceite:** (1) bancos com perfil são reconhecidos sem perguntar; (2) cabeçalho desconhecido → mapeamento manual (data, descrição, valor ou crédito/débito); (3) mapeamento salvo e reaproveitado na próxima importação; (4) versão do perfil registrada; (5) golden de cada perfil passa nos dois.
- **Testes:** U · G · I (migração 002) · E · M: mapeamento manual com TalkBack/VoiceOver ⓜ.
- **Demonstração:** APK/URL: importar CSV do banco X → "Reconheci: X"; CSV desconhecido → mapear colunas.
- **Riscos / plano B:** banco muda o layout → perfil versionado + mapeamento manual.
- **Status:** [ ] pendente

### E-14 — Ledger, deduplicação, idempotência e desfazer
- **Sprint:** 3 · **PBIs:** C-03, C-01 (transação única).
- **Objetivo:** importar grava as transações de uma vez, nunca duplica e pode ser desfeito em até 30 dias.
- **Porte (D-045):** `core/dedup/fingerprint.ts`, `import/commit.ts`, `undo.ts`, `csv-retention.ts` → core + módulo `import`.
- **Escopo:** migração 003: `import_batch`, `txn` (com `dedupe_key UNIQUE`, `deleted_at`) e índices do TRD §6; chave de dedupe no core (conta + data + valor + descrição normalizada + ordinal de repetição no arquivo); importação numa transação; evento `transaction.imported`; tela **Resultado** (novas / já existiam) e **Histórico de importações** com Desfazer (≤ 30 dias); lista simples de transações (2 linhas, D-020, `****1234`).
- **Dependências:** E-13, E-06 (eventos).
- **Plataformas:** = (SQL nos dois adaptadores).
- **Critérios de aceite (C-03):** (1) reimportar o mesmo arquivo não muda nada ("Este extrato já foi importado"); (2) arquivo que se sobrepõe a outro só adiciona o que falta; (3) duas compras legítimas iguais no mesmo dia **não** são fundidas; (4) falha no meio → nada entra; (5) desfazer remove o lote inteiro e só ele; (6) `transaction.imported` publicado uma vez por lote.
- **Testes:** U (chave de dedupe) · I (transação, `UNIQUE`, desfazer, nos dois adaptadores) · E.
- **Demonstração:** APK/URL: importar → "214 novas"; importar de novo → "Nada mudou"; Desfazer.
- **Riscos / plano B:** falso positivo de dedupe → o ordinal de repetição + testes com casos reais anonimizados.
- **Status:** [ ] pendente

### E-15 — Arquivos grandes, progresso e "Abrir com"
- **Sprint:** 3 · **PBIs:** C-01 (limites, streaming, sem travar a tela).
- **Objetivo:** importar 50 mil linhas sem travar a tela, com progresso e cancelamento.
- **Porte (D-045):** `import/scheduler.ts` (fatias de ~8 ms), `analyze.ts`, `job.ts`, `progress-store.ts` → nativo; o Web Worker do web é novo.
- **Escopo:** parsing em blocos; **Web Worker** no web; fatias com `await` no nativo; barra "Lendo N de M linhas" + cancelar; intent filter `.csv` no Android ("Abrir com"), via config plugin; notificação de conclusão em 2º plano no Android **adiada para a E-23** (precisa da porta `notifications`) ou degradada (registrar); medições D-041.
- **Dependências:** E-14.
- **Plataformas:** Android = fatias + "Abrir com" · iPhone/PWA = Web Worker; só seletor; sem aviso em 2º plano (a tela mostra o progresso) (≈).
- **Critérios de aceite:** (1) 10 MB / 50 mil linhas sintéticas em ≤ 60 s no OPPO e no iPhone, com a UI respondendo; (2) cancelar não grava nada; (3) "Abrir com" um `.csv` no Android abre o fluxo de importação; (4) pico de memória no iPhone registrado; se não aguentar, limite menor só no iPhone, com mensagem (D-030).
- **Testes:** U (parser em blocos = parser inteiro) · E (arquivo grande gerado no teste) · M: medições no OPPO e no iPhone; "Abrir com" pelo WhatsApp/Drive ⓜ.
- **Demonstração:** APK: abrir um CSV pelo WhatsApp → importação com progresso. URL: arquivo grande com barra de progresso.
- **Riscos / plano B:** nativo travando mesmo em fatias → reduzir o tamanho da fatia e mover o trabalho pesado para o SQLite (inserção em lote).
- **Status:** [ ] pendente

---

## 6. Sprint 4 — Importação II

### E-16 — Categorização por regras e dicionário (+ casos especiais)
- **Sprint:** 4 · **PBIs:** C-04. D-030.
- **Objetivo:** transações importadas recebem categoria automaticamente, com transferências e faturas fora dos totais.
- **Porte (D-045):** `categorization/{engine,dictionary,fuzzy,normalize,factory,seed}.ts` e `builtin/{categories,merchants}.ts` → core; categorias ajustadas às 15 do D-030; `ml/*` (Naive Bayes) **fica de fora** (C-07, R2).
- **Escopo:** 15 categorias padrão editáveis (D-030; migração 004 `category`, `category_rule`); pipeline de camadas portado (regra do usuário → regra embutida → dicionário de estabelecimentos → nenhuma); dicionário embutido versionado, a partir do `builtin/merchants.ts` antigo (revisado: só nomes genéricos de estabelecimentos); casos especiais: transferência entre contas próprias (sugere o par em ≤ 3 dias, com confirmação), pagamento de fatura, parcela "03/10" (`installment_no/total`), estorno vinculado à compra original; tela **Categorias** (renomear/criar/arquivar).
- **Dependências:** E-14.
- **Plataformas:** = (core).
- **Critérios de aceite:** (1) cada transação tem `category_source`; (2) transferência e fatura ficam fora dos totais; (3) parcela é reconhecida e agrupada; (4) estorno abate a categoria original; (5) cobertura medida no conjunto anonimizado do Kaynan (meta final de 70% na E-19).
- **Testes:** U (pipeline, casos especiais) · G (expected com categoria) · I.
- **Demonstração:** APK/URL: importar → "31 sem categoria" e o restante categorizado; Categorias editáveis.
- **Riscos / plano B:** cobertura baixa → priorizar o dicionário pelos estabelecimentos mais frequentes do conjunto anonimizado.
- **Status:** [ ] pendente

### E-17 — Correção manual com aprendizado
- **Sprint:** 4 · **PBIs:** C-05.
- **Objetivo:** corrigir a categoria de uma transação cria uma regra que acerta as próximas.
- **Porte (D-045):** `categorization/learn.ts` ("aplicar às parecidas") → core + módulo.
- **Escopo:** tela **Detalhe/corrigir** (UX nº 10): trocar categoria, "aplicar às parecidas" (prévia de quantas), regra criada (`source='user'`, `exact`/`contains`); tela **Regras de categoria** (editar/excluir); fila "Sem categoria (N) [Revisar]".
- **Dependências:** E-16.
- **Critérios de aceite:** (1) a correção gera regra e recategoriza as parecidas só com confirmação; (2) a regra do usuário tem prioridade sobre o dicionário; (3) desfazer a correção (toast 10 s); (4) nada sai do aparelho.
- **Testes:** U (prioridade de regras, regex segura) · I · E · M: fluxo de revisão com TalkBack/VoiceOver ⓜ.
- **Demonstração:** APK/URL: corrigir "PADARIA X" → Mercado; reimportar o mês seguinte → já categorizada.
- **Status:** [ ] pendente

### E-18 — Dashboard por categoria e período
- **Sprint:** 4 · **PBIs:** C-06. D-019, D-021, D-022.
- **Objetivo:** ver quanto gastei por categoria no mês, em ≤ 2 s com ~10 mil transações, nas duas plataformas.
- **Porte (D-045):** `dashboard/queries.ts` (SQL com reconciliação) e `service.ts` → `src/storage`/módulo; `components/charts.tsx` só como referência (gráficos novos sobre `react-native-svg`, D-021).
- **Escopo:** agregações em SQL (mês civil ou "começa no dia N", D-035); tela **Gastos** com barras horizontais próprias sobre `react-native-svg` (instalar se ainda não houver, com aviso) + "Ver como tabela"; variação vs mês anterior; Início com o resumo do mês; transações filtráveis por categoria/período; teste de reconciliação (soma das categorias = total exibido, excluindo transferência/fatura).
- **Dependências:** E-16, E-10 (privacidade, mês financeiro).
- **Plataformas:** = (SQL nativo × WASM; meta medida nos dois).
- **Critérios de aceite:** (1) total e categorias batem com a soma das transações (teste); (2) ≤ 2 s com ~10 mil transações no OPPO e no iPhone (gerador sintético); (3) gráfico com alternativa em tabela; (4) 👁 oculta números e eixos.
- **Testes:** U (agregação) · I (reconciliação nos dois adaptadores) · E (axe no gráfico/tabela) · M: medições; leitor de tela no gráfico ⓜ.
- **Demonstração:** APK/URL: Gastos → Outubro com barras; "Ver como tabela"; trocar o mês.
- **Riscos / plano B:** lento no WASM → tabela de resumo mensal materializada e atualizada na importação.
- **Status:** [ ] pendente

### E-19 — Demais bancos, meta de 70% e ajuda por banco
- **Sprint:** 4 · **PBIs:** C-02 (perfis restantes), C-04 (meta), F-08 (ajuda de exportar CSV).
- **Objetivo:** os 6 bancos do D-030 têm perfil e golden file, e a categorização atinge ≥ 70%.
- **Escopo:** perfis + golden dos bancos restantes (amostras anonimizadas de amigos); ajuste do dicionário até a meta; telas de ajuda "Como exportar o CSV do banco X" (texto genérico, sem logos, D-032).
- **Dependências:** E-18 + amostras (§17).
- **Critérios de aceite:** (1) golden dos 6 bancos passam nos dois; (2) ≥ 70% categorizadas sem intervenção no conjunto anonimizado agregado (métrica no teste); (3) ajuda por banco acessível na tela de importação.
- **Testes:** G · U (métrica de cobertura) · M: um amigo importa seguindo só a ajuda ⓜ.
- **Demonstração:** APK/URL: importar CSV de cada banco sem mapeamento manual.
- **Riscos / plano B:** amostra de banco indisponível → banco fica no mapeamento manual (C-02) e a lacuna é registrada; não bloqueia o resto do plano.
- **Status:** [ ] pendente

---

## 7. Sprint 5 — Contas

### E-17b — Lançamento manual de transação (**proposta**, D-050)
- **Sprint:** 4 · **PBIs:** C-08 (novo, Should, **aguarda OK**).
- **Objetivo:** registrar à mão um gasto ou receita (dinheiro vivo, banco sem CSV), sem contar 2× quando o extrato chegar.
- **Porte (D-045):** `transactions/manual.ts` (hash próprio que não colide com o dedupe do CSV, mesmo motor de categorização, pagar conta na mesma transação SQL) + tela `transactions/manual` como referência.
- **Escopo:** tela "Novo lançamento" (valor em centavos, entrada/saída, data, descrição, categoria automática ou escolhida, conta; padrão **Carteira (dinheiro)**); aviso ao lançar numa conta que recebe CSV; na importação, sugestão "Já lançado à mão? [Juntar]" para mesma conta + mesmo valor + data ±3 dias, com confirmação; origem "manual" visível na lista.
- **Fora de escopo:** pagar conta pelo lançamento (fica na E-21, que usa a mesma função).
- **Dependências:** E-14, E-16.
- **Plataformas:** = (core + banco).
- **Critérios de aceite:** (1) o lançamento entra no dashboard e nos totais; (2) reimportar extratos nunca apaga lançamentos manuais; (3) a junção só acontece com confirmação e é reversível; (4) valores em centavos, sem float.
- **Testes:** U (validação, sugestão de junção) · I · E · M: formulário com TalkBack ⓜ.
- **Demonstração:** APK/URL: Gastos → "+ Lançamento" → "Feira R$ 45,00 (Carteira)" aparece em Mercado.
- **Riscos / plano B:** o usuário lança e importa o mesmo gasto → sugestão de junção + conta Carteira como padrão.
- **Status:** [ ] proposta (aguarda OK do Kaynan)

### E-20 — Contas a pagar: recorrência e instâncias (core + banco)
- **Sprint:** 5 · **PBIs:** A-01. D-031.
- **Objetivo:** o núcleo gera corretamente as ocorrências e estados de qualquer conta recorrente.
- **Porte (D-045):** `services/recurrence/{rrule,dates,generate}.ts` e `bills/{types,repo,service}.ts` → core + módulo `bills`; conferir contra o D-031.
- **Escopo:** core `recurrence`: única, semanal, mensal (dia N; inexistente → último dia), anual, último dia útil (seg–sex, sem feriados), a cada N semanas/meses; estados a vencer / vence hoje / vencida / paga calculados pela data; migração 005 `bill_template`, `bill_instance`; geração das instâncias dos próximos 90 dias ao abrir e após alterações (idempotente); validação de linha digitável (dígitos verificadores) e Pix copia-e-cola no core.
- **Dependências:** E-06, E-14 (para o vínculo na E-21).
- **Plataformas:** = (core + banco).
- **Critérios de aceite:** (1) todas as recorrências do D-031 com testes de borda (31/01 → 28/02 ou 29/02; último dia útil caindo no sábado); (2) "vencida" sem job; (3) gerar 2× não duplica instâncias; (4) linha digitável inválida é rejeitada.
- **Testes:** U (relógio fake, `TZ` São Paulo e UTC) · I.
- **Demonstração:** autoteste mostra os vetores de recorrência OK (sem tela de produto nesta etapa; declarado).
- **Status:** [ ] pendente

### E-21 — Contas a pagar: telas, pagar e vincular ao extrato
- **Sprint:** 5 · **PBIs:** A-01.
- **Objetivo:** cadastrar, ver e pagar contas, com vínculo à transação do extrato.
- **Porte (D-045):** telas `bills/new`, `bills/[id]` e aba `bills` como referência.
- **Escopo:** telas UX nº 17–19 (abas A vencer / Vencidas / Pagas; nova/editar com `MoneyField`, "valor varia", recorrência, categoria, forma de pagamento, observação, linha digitável com Colar/Copiar); "Paguei" com toast Desfazer; ao pagar, sugere transação correspondente (data/valor próximos) com confirmação; evento `bill.paid` (cancela lembretes na E-23).
- **Dependências:** E-20.
- **Critérios de aceite (A-01):** (1) campos do PBI; (2) estados com ícone + texto + cor; (3) pagar registra a data e oferece vínculo quando houver transação; (4) pagar publica o evento que cancela lembretes pendentes (verificado na E-23).
- **Testes:** U (sugestão de vínculo) · I · E · M: TalkBack/VoiceOver no formulário ⓜ.
- **Demonstração:** APK/URL: criar "Luz, todo dia 31" → ver próximas → "Paguei" → vínculo com a transação importada.
- **Status:** [ ] pendente

### E-22 — Confiabilidade dos alertas (Android) + prova da estratégia do iPhone
- **Sprint:** 5 · **PBIs:** A-03; D-001 (prova do `.ics` e Badging = M-1b, parte 1).
- **Objetivo:** no Android, o usuário sabe se os lembretes vão tocar; no iPhone, fica provado que o `.ics` com alarmes funciona.
- **Porte (D-045):** `services/diagnostics/alerts.ts`, `notifications/native.ts` → base do adaptador `notifications.native.ts` (conferir a API do SDK 58).
- **Escopo:** porta `notifications` (verificar a lib atual de notificações locais do Expo SDK 58: permissões, canais, alarmes exatos, reboot; avisar dependência); canais `bills`, `subscriptions`, `backup`; pedir permissão no primeiro uso do módulo, depois de explicar; orientar alarmes exatos (Android 12+) e bateria por fabricante (ColorOS primeiro, depois Samsung, Xiaomi, Motorola); tela **"Meus alertas estão funcionando?"** com checklist e "notificação de teste em 1 minuto"; aviso no Início se permissão revogada; opção "ocultar valores na tela bloqueada" (padrão: só nome e data); **iPhone:** gerador `.ics` no core (UID determinístico, `SEQUENCE`, `VALARM`) + tela **"Lembretes no iPhone"** + teste do Badging API; resultado em D-001/matriz.
- **Dependências:** E-21.
- **Plataformas:** Android = permissões/diagnóstico completos · iPhone/PWA = ✕ notificações → tela explicativa + `.ics` (D-001). Portas: `notifications`, `calendar-export`, `badge`.
- **Critérios de aceite (A-03):** (1) permissão pedida com explicação; (2) tela de alarmes exatos aberta pelo app; (3) checklist mostra o estado real; (4) notificação de teste chega em ~1 min com o app fechado; (5) canais separados visíveis nas configurações do Android; (6) aviso no Início ao revogar; (7) **iPhone:** `.ics` importado no iOS 18 e 26 cria eventos com alarme; reexportar atualiza ou o comportamento real fica documentado.
- **Testes:** U (`.ics` válido, UID estável) · C (notifications fake) · M: permissões e teste de 1 min no OPPO; `.ics` no Calendário do iOS 18 e 26 ⓜ.
- **Demonstração:** APK: "Meus alertas…" todo verde + teste em 1 min. URL: "Lembretes no iPhone" → enviar `.ics` → alarme no Calendário.
- **Riscos / plano B:** iOS ignora `VALARM` importado → evento sem alarme + instrução de "alerta padrão" do Calendário (degradação comunicada) e a faixa no app vira o canal principal.
- **Status:** [ ] pendente

---

## 8. Sprint 6 — Lembretes

### E-23 — Motor de lembretes no Android (início do M-1a)
- **Sprint:** 6 · **PBIs:** A-04; F-06 (lembrete mensal de backup); C-01 (aviso de conclusão em 2º plano, se mantido).
- **Objetivo:** lembretes de contas tocam no horário com o app fechado, sem duplicar, e são reconstruídos sempre que algo muda.
- **Porte (D-045):** `notifications/{plan,reminders,scheduler,backup-reminder}.ts` → core (plano, ids) + módulo; inclui as alterações sem commit da árvore de trabalho congelada.
- **Escopo:** core: regras (padrão 3/1/0 dias às 9h; silêncio 22h–7h; atraso 1×/dia por 3 dias; máx. 5/dia → resumo; digest opcional), janela rolante de 60 dias, id determinístico; migração `notification_schedule`; reagendar ao abrir, ao criar/editar/pagar, em `transaction.imported`, após reboot e em `backup.restored` (idempotente); texto padrão só nome e data (valor e linha digitável conforme A-03); lembrete de backup dia 1 às 20h; tela **Regras de lembrete** por conta.
- **Dependências:** E-22.
- **Plataformas:** Android = notificações locais · iPhone/PWA = as mesmas regras alimentam a faixa e o `.ics` (E-24).
- **Critérios de aceite (A-04):** (1) regras configuráveis; (2) atraso no máximo 1/dia por 3 dias; (3) conta paga nunca dispara e pagar cancela os pendentes; (4) reagendar 2× = mesmo conjunto; (5) reconstrução em todos os gatilhos; (6) digest opcional; (7) **M-1a iniciado** nos 2 fabricantes.
- **Testes:** U (relógio simulado, troca de fuso, janela, limite diário) · C (fake: idempotência) · I · M: **M-1a 14 dias** (app fechado, reboot, bateria, restaurar backup) ⓜ.
- **Demonstração:** APK: conta para daqui a 2 min com regra "no dia" → notificação com o app fechado; reiniciar o aparelho → continua agendada.
- **Riscos / plano B:** a lib não reagenda após reboot → reagendar ao abrir + aviso no diagnóstico; ColorOS mata alarmes → orientação de bateria (E-22) e registro no M-1a.
- **Status:** [ ] pendente

### E-24 — "Precisa de atenção", `.ics` e badge (estratégia iPhone, M-1b)
- **Sprint:** 6 · **PBIs:** A-04 (iPhone), D-001, D-019.
- **Objetivo:** ao abrir o app, o usuário vê o que vence e, no iPhone, envia os vencimentos com alarmes para o Calendário.
- **Escopo:** faixa "Precisa de atenção" no Início (vencidas, vencendo, backup atrasado; renovações entram na E-28) com Paguei/Adiar, nas **duas** plataformas; "Enviar para o Calendário" (próximos 60 dias, regras viram `VALARM`, aviso "não criptografado", data do último envio); badge com o número de pendências (se suportado); estado vazio "Tudo em dia ✓".
- **Dependências:** E-22, E-23.
- **Plataformas:** Android = faixa + notificações (`.ics` opcional) · iPhone/PWA = faixa + badge (?) + `.ics` (≈, D-001).
- **Critérios de aceite:** (1) faixa coerente com o motor (mesma fonte de regras); (2) ações da faixa idempotentes; (3) `.ics` reexportado não duplica eventos no iOS (ou degradação documentada); (4) **M-1b validado** no iOS 18 e 26.
- **Testes:** U (seleção do que entra na faixa) · E (faixa + axe) · M: M-1b ⓜ.
- **UX/a11y/segurança:** faixa anunciada como região; `.ics` só nome e data por padrão.
- **Demonstração:** URL (iPhone): abrir → faixa → "Enviar para o Calendário" → alarme toca. APK: a mesma faixa no Início.
- **Status:** [ ] pendente

### E-25 — Ações rápidas na notificação
- **Sprint:** 6 · **PBIs:** A-05 (2º na ordem de corte).
- **Objetivo:** "Paguei" ou "Lembrar amanhã" direto da notificação, sem efeito duplicado.
- **Porte (D-045):** `notifications/actions.ts` → módulo `bills` + adaptador.
- **Escopo:** categorias de ação na porta `notifications`; o app confere o estado no banco antes de aplicar; abrir o app pelo toque.
- **Dependências:** E-23.
- **Plataformas:** Android = ações na notificação · iPhone/PWA = ✕ → ações na faixa/lista (E-24).
- **Critérios de aceite (A-05):** (1) botões Paguei / Lembrar amanhã / abrir; (2) Paguei = paga + data + cancela pendentes; (3) repetir a ação ou tocar em notificação antiga não duplica nem dá erro; (4) comportamento com o app morto testado e documentado.
- **Testes:** U (idempotência da aplicação) · M: ações com o app fechado no OPPO e no 2º fabricante ⓜ.
- **Demonstração:** APK: notificação → "Paguei" → conta aparece paga ao abrir.
- **Status:** [ ] pendente

---

## 9. Sprint 7 — Assinaturas

### E-26 — Cadastro manual de assinaturas
- **Sprint:** 7 · **PBIs:** S-01. D-032.
- **Objetivo:** cadastrar assinaturas com catálogo, moeda estrangeira e "minha parte".
- **Porte (D-045):** `subscriptions/{catalog,money,draft,repo,service}.ts` + `0005_subscriptions` (não versionados) → core + módulo; **sem** cotação por API (D-032).
- **Escopo:** migração `subscription`, `subscription_charge`; catálogo embutido de ~20 serviços BR (sem logos, ícone genérico); BRL/USD/EUR com **cotação manual** registrada por cobrança (`fx_rate_micros`, sem float); estados ativa/em teste/pausada/cancelada; "minha parte" em R$ ou %; link de cancelamento opcional (abre no navegador do sistema por ação do usuário).
- **Dependências:** E-06, E-16 (categorias).
- **Critérios de aceite (S-01):** campos do PBI; valores do catálogo são sugestões editáveis; canceladas saem do total; conversão mostra a moeda original; zero rede.
- **Testes:** U (conversão em inteiros, "minha parte") · I · E · M: formulário com leitor de tela ⓜ.
- **Demonstração:** APK/URL: Mais → Assinaturas → "+ Spotify (catálogo)" em USD com cotação manual.
- **Status:** [ ] pendente

### E-27 — Dashboard de custo mensal e anual
- **Sprint:** 7 · **PBIs:** S-03.
- **Objetivo:** ver o custo mensal equivalente e anual das assinaturas, com soma verificada.
- **Porte (D-045):** `subscriptions/service.ts` (custo normalizado) → core; tela `subscriptions/index` como referência.
- **Escopo:** normalização na consulta (valor ÷ meses); cabeçalho mensal/anual com "Como calculamos? ⓘ"; ordenar por valor/próxima cobrança/categoria; 3 maiores e "em teste"; custo líquido × total do plano; anel por categoria + tabela; linha do tempo dos próximos 30 dias.
- **Dependências:** E-26 (S-02 entra depois; o dashboard já funciona só com o manual).
- **Critérios de aceite (S-03):** todos os do PBI; **teste automatizado: soma exibida = soma dos itens ativos e em teste**.
- **Testes:** U · I · E (axe) · M: leitor de tela no gráfico ⓜ.
- **Demonstração:** APK/URL: "R$ 210,40/mês · R$ 2.524,80/ano", maiores e em teste.
- **Status:** [ ] pendente

### E-28 — Lembretes de renovação e cancelamento
- **Sprint:** 7 · **PBIs:** S-04.
- **Objetivo:** ser avisado antes da renovação ou do fim do teste, reaproveitando o motor de A-04.
- **Porte (D-045):** partes de `subscriptions/service.ts` + motor de A-04 já portado.
- **Escopo:** tipo `subscription.renewal_due` no mesmo `notification_schedule`; padrão 3 dias (7 para anuais) e 1 dia antes do fim do teste; ações "Vou manter"/"Cancelei" (Android na notificação; iPhone na faixa); "possivelmente cancelada" quando a cobrança esperada não aparece no próximo extrato (reage a `transaction.imported`); "acesso até" ao cancelar.
- **Dependências:** E-23, E-24, E-26, E-14.
- **Plataformas:** Android = notificação com ações · iPhone/PWA = faixa + `.ics` (≈).
- **Critérios de aceite (S-04):** todos os do PBI, com as ações idempotentes.
- **Testes:** U (relógio simulado) · C · M: renovação no OPPO e na faixa do iPhone ⓜ.
- **Demonstração:** APK: notificação "Netflix renova sábado" → "Vou manter". URL: renovação na faixa + `.ics`.
- **Status:** [ ] pendente

### E-29 — Detecção de assinaturas no CSV
- **Sprint:** 7 · **PBIs:** S-02 (4º na ordem de corte).
- **Objetivo:** sugerir assinaturas encontradas no extrato com poucos falsos positivos.
- **Porte (D-045):** `subscriptions/detect.ts` → core; tela `subscriptions/detection` como referência.
- **Escopo:** detector no core (descrição normalizada de C-04, intervalos, mediana/desvio, ±10% valor, ±3 dias, ≥ 2 ocorrências; catálogo = 1); exclui parcelas; débitos fixos (aluguel) apontam para A-01; `suggestion_dismissal`; tela **Sugestões** (confirmar/editar/descartar); confirmar cria a assinatura, vincula as cobranças passadas e estima a próxima; conjunto rotulado sintético/anonimizado.
- **Dependências:** E-14 (C-03), E-16 (C-04), E-26.
- **Critérios de aceite (S-02):** todos os do PBI; **precisão ≥ 80%** no conjunto rotulado (teste).
- **Testes:** U · G (conjunto rotulado) · I · E.
- **Demonstração:** APK/URL: importar → "2 assinaturas sugeridas" → confirmar.
- **Status:** [ ] pendente

---

## 10. Sprint 8 — Compras I

### E-30 — Listas de compras (base)
- **Sprint:** 8 · **PBIs:** L-01. D-033.
- **Objetivo:** criar listas e itens e marcar como comprado em ≤ 100 ms, offline.
- **Escopo:** migração `shopping_list`, `list_item` (UUID, `qty_milli`, `position` com chave fracionária, `updated_at`, `deleted_at`); criar/renomear/arquivar/excluir lista; adicionar item (nome, qtd, unidade, observação); marcar/desmarcar com Desfazer; comprados vão para o fim.
- **Dependências:** E-03 (UUID), E-07 (offline no iPhone).
- **Critérios de aceite:** (1) ids UUID gerados no aparelho; (2) exclusão lógica; (3) marcar ≤ 100 ms no OPPO e no iPhone; (4) funciona em modo avião.
- **Testes:** U (chave fracionária) · I · E (offline) · M: uso com uma mão, alvos ≥ 48 ⓜ.
- **Demonstração:** APK/URL (modo avião): criar "Mercado da semana", adicionar e marcar itens.
- **Status:** [ ] pendente

### E-31 — Listas: corredores, colar, duplicar, limpar, autocompletar
- **Sprint:** 8 · **PBIs:** L-01.
- **Objetivo:** usar a lista no mercado por corredor, com entrada rápida.
- **Escopo:** corredores e unidades padrão editáveis (D-033), ordem ajustável; colar texto (uma linha por item); duplicar lista; limpar comprados; autocompletar a partir dos itens mais comprados (o catálogo entra na E-32).
- **Dependências:** E-30.
- **Critérios de aceite:** todos os de L-01 não cobertos pela E-30.
- **Testes:** U (parser de colar, ordenação) · I · E · M: VoiceOver/TalkBack na lista (checkbox com nome + qtd) ⓜ.
- **Demonstração:** APK/URL: colar 10 linhas → itens agrupados por corredor.
- **Status:** [ ] pendente

### E-32 — Catálogo de produtos e estabelecimentos (EAN digitado)
- **Sprint:** 8 · **PBIs:** L-03.
- **Objetivo:** "leite integral 1L" é sempre o mesmo produto, e o mesmo mercado não duplica.
- **Escopo:** migração `product`, `store`; associar item → produto (nome novo cria); sugestão de fusão por similaridade com confirmação; estabelecimentos sem duplicar por grafia; marca/tamanho opcionais; **EAN digitado** nas duas plataformas (validação do dígito verificador), identificador preferencial.
- **Dependências:** E-31.
- **Critérios de aceite (L-03):** todos, exceto a leitura pela câmera (E-33).
- **Testes:** U (normalização, similaridade, EAN) · I · E.
- **Demonstração:** APK/URL: "Leite Integral" e "leite integral 1 l" → sugestão de fusão.
- **Status:** [ ] pendente

### E-33 — EAN pela câmera (Android) + teste no Safari
- **Sprint:** 8 · **PBIs:** L-03 (câmera; 3º na ordem de corte). D-033.
- **Objetivo:** ler o EAN-13 pela câmera no Android; verificar se o Safari permite o mesmo.
- **Escopo:** porta `barcode` com `expo-camera` (verificar a doc atual; avisar dependência e permissão); web: testar `expo-camera` no Safari do iPhone; se não ler, `supported:false` → digitação (E-32); `Permissions-Policy camera=(self)` **só** se o iPhone ganhar a câmera.
- **Dependências:** E-32.
- **Plataformas:** Android = câmera · iPhone/PWA = digitação (≈), salvo se o teste aprovar.
- **Critérios de aceite:** EAN lido vira o identificador do produto; matriz e D-033 atualizados com o resultado do Safari.
- **Testes:** C · M: leitura de embalagens reais no OPPO; teste no Safari do iOS 18/26 ⓜ.
- **Demonstração:** APK: apontar para o código → produto preenchido. URL: campo de EAN digitado (ou câmera, se aprovado).
- **Status:** [ ] pendente

### E-34 — Registro de preço e ida ao mercado
- **Sprint:** 8 · **PBIs:** L-04 (6º na ordem de corte).
- **Objetivo:** guardar quanto paguei em cada item e lugar, sem atrapalhar a lista.
- **Escopo:** migração `shopping_trip`, `price_observation` (só inserção, `superseded_by`); mercado escolhido 1× por ida; preço opcional item a item, sugerindo o último, por unidade ou total com conversão; encerrar: total estimado + oferta de vínculo com a transação do extrato (data/valor, com confirmação); edição/exclusão com histórico.
- **Dependências:** E-32, **E-14 (C-03)**.
- **Critérios de aceite (L-04):** todos os do PBI.
- **Testes:** U (preço unitário em inteiros) · I · E · M: ida ao mercado offline, uma mão ⓜ.
- **Demonstração:** APK/URL: ida ao "Assaí", preços em 3 itens, encerrar → R$ 42,30 → vincular à transação.
- **Status:** [ ] pendente

---

## 11. Sprint 9 — Compras II (lista por CSV)

### E-35 — Exportar lista em CSV
- **Sprint:** 9 · **PBIs:** L-02 (7º na ordem de corte).
- **Objetivo:** enviar uma lista para outro aparelho por arquivo, sem servidor.
- **Escopo:** CSV UTF-8 (com BOM a validar no Excel), `;`, cabeçalho fixo com `format_version=1` e as colunas do PBI; "incluir preços" (desligado); proteção contra injection simétrica; aviso "não criptografado"; compartilhar pela porta `files`.
- **Dependências:** E-34 (preços), E-05 (`files`).
- **Plataformas:** Android = Compartilhar nativo · iPhone/PWA = Web Share/download (= ?).
- **Critérios de aceite (L-02):** todos os do PBI; abre corretamente no Excel e no Google Planilhas (verificação manual).
- **Testes:** U (ida e volta com `=`, `+`, `-`, `@`, valores negativos) · E · M: abrir no Excel/Planilhas ⓜ.
- **Demonstração:** APK: Compartilhar lista → WhatsApp. URL: Web Share/download.
- **Status:** [ ] pendente

### E-36 — Importar lista de CSV e mesclar
- **Sprint:** 9 · **PBIs:** L-08 (7º na ordem de corte).
- **Objetivo:** dois aparelhos chegam à mesma lista importando o CSV um do outro.
- **Escopo:** validar `format_version` (desconhecida → mensagem amigável); resumo antes de aplicar (novos/alterados/iguais/excluídos); "Mesclar" × "Criar nova lista"; mesclagem por id → `updated_at` mais recente → empate: comprado prevalece; sem id → nome normalizado; exclusões mais recentes aplicadas; EAN reaproveita produto; preços como observações `source=import`; tudo numa transação; "Abrir com" no Android (intent da E-15).
- **Dependências:** E-35, E-32.
- **Plataformas:** Android = "Abrir com" + seletor · iPhone/PWA = só seletor; ajuda "Salvar em Arquivos" (≈).
- **Critérios de aceite (L-08):** todos os do PBI, incluindo idempotência e arquivo inválido sem alterar nada.
- **Testes:** U (mesclagem, casos de relógio) · G (CSVs de lista sintéticos) · I · E · M: **troca real OPPO ↔ iPhone** pelo WhatsApp ⓜ.
- **Demonstração:** APK → iPhone: exportar, importar, resumo, mesclar; o inverso.
- **Status:** [ ] pendente

### E-37 — Histórico e comparativo de preços
- **Sprint:** 9 · **PBIs:** L-05 (1º na ordem de corte).
- **Objetivo:** ver a evolução do preço e onde a lista sai mais barata.
- **Escopo:** gráfico de linha por estabelecimento + tabela; menor preço recente; "Onde comprar" com cobertura %; aviso de dado > 60 dias; último preço e mercado mais barato na lista; alerta opcional > 10% acima da média de 90 dias; < 2 observações → explicação em vez de gráfico.
- **Dependências:** E-34.
- **Critérios de aceite (L-05):** todos os do PBI.
- **Testes:** U/I (agregações com window functions nos dois adaptadores) · E (axe) · M: leitor de tela no gráfico ⓜ.
- **Demonstração:** APK/URL: produto → linha de preço; lista → "Onde comprar".
- **Status:** [ ] pendente

---

## 12. Sprint 10 — Polimento e beta

### E-38 — Polimento: acessibilidade, desempenho e identidade visual
- **Sprint:** 10 · **PBIs:** transversais (D-012, D-027, D-041, D-014).
- **Objetivo:** todas as telas passam no checklist de acessibilidade e nas metas de desempenho.
- **Escopo:** roteiro completo TalkBack (OPPO) e VoiceOver (iPhone) nas 42 telas; fonte 200% em todas; axe sem violações sérias em todas as rotas web; medir todas as metas D-041 no OPPO e no iPhone; ícone final (D-014) em todas as variantes; revisão de microcopy.
- **Critérios de aceite:** checklist UX §9.2 marcado para cada tela; tabela de desempenho com as medições; ícone aprovado.
- **Testes:** E (axe em todas as rotas) · M: roteiros completos ⓜ.
- **Demonstração:** APK/URL candidatos a beta.
- **Status:** [ ] pendente

### E-39 — Revisão de segurança, CSP final e hospedagem
- **Sprint:** 10 · **PBIs:** F-01, F-03, F-04, F-06 (revisão); ADR-006.
- **Objetivo:** fechar o STRIDE, os headers e a decisão de hospedagem antes da produção.
- **Escopo:** `security-review` completo; `npm audit` e licenças; nenhuma URL externa, beacon ou rota de autoteste na produção; **decidir Pages clássico × Workers** (ADR-006) com o Kaynan; APK release candidato (`versionCode`/semver).
- **Critérios de aceite:** STRIDE atualizado sem item aberto; ADR-006 fechado; checagens da CI verdes no build de produção.
- **Testes:** CI + M: `curl -sI` no preview; inspeção do APK release ⓜ.
- **Status:** [ ] pendente

### E-40 — Pré-beta: marcos finais e publicação
- **Sprint:** 10 · **PBIs:** critérios de saída (D-012, BRD §3.2).
- **Objetivo:** cumprir os marcos M-1a, M-2 e M-3 e publicar a versão de beta.
- **Escopo:** concluir **M-1a** (14 dias, 2 fabricantes); **M-2** completo (backup OPPO ↔ iPhone com dados de todos os módulos, nos dois sentidos); **M-3** revalidado (offline + atualização no iPhone instalado); teste com **1 familiar** (D-043); correções; **deploy de produção só com comando explícito do Kaynan**; distribuição do APK release pelo Kaynan.
- **Critérios de aceite:** todos os marcos verdes e registrados em `docs/testes/`; ≥ 70% de categorização confirmado; critérios D-012 técnicos atendidos.
- **Testes:** M ⓜ (todos os marcos).
- **Demonstração:** URL de produção (após o comando) e APK release com os amigos.
- **Status:** [ ] pendente

---

## 13. Matriz PBI × Etapa (cobertura do MVP)

| PBI | Prior. | Etapas | Coberto por completo? |
|---|---|---|---|
| F-01 Bloqueio | Must | E-04, E-10 (tempo, captura), E-39 | ✔ |
| F-03 Criptografia | Must | E-02 (decisão), E-03, E-04 (chave), E-39 | ✔ |
| F-04 Exportar/apagar | Must | E-08 (texto de privacidade), E-09 | ✔ |
| F-05 Log | Should | E-11 (+ eventos nas etapas de importação/alertas) | ✔ |
| F-06 Backup | Must | E-05, E-08 (avisos; iPhone semanal), E-23 (lembrete mensal Android), E-40 (M-2) | ✔ |
| F-07 Núcleo | Must | E-01 (APK cedo), E-03 (migrações), E-06, E-12/E-13 (golden de banco) | ✔ |
| F-08 Onboarding e ajuda | Must | E-07 (instalar), E-08, E-12/E-19 (ajuda por banco) | ✔ |
| C-01 Importar CSV | Must | E-12, E-13 (detecção), E-14 (transação), E-15 | ✔ |
| C-02 Perfis | Must | E-13, E-19 | ✔ |
| C-03 Dedupe | Must | E-14 | ✔ |
| C-04 Categorização | Must | E-16, E-19 (meta 70%) | ✔ |
| C-05 Correção | Must | E-17 | ✔ |
| C-06 Dashboard | Must | E-18 | ✔ |
| C-08 Lançamento manual (**proposto**) | Should | E-17b | se aprovado |
| A-01 Contas | Must | E-20, E-21 | ✔ |
| A-03 Confiabilidade | Must | E-22 | ✔ |
| A-04 Motor | Must | E-23, E-24 (iPhone), E-40 (M-1a) | ✔ |
| A-05 Ações | Should | E-25 | ✔ |
| S-01 Cadastro | Must | E-26 | ✔ |
| S-02 Detecção | Should | E-29 | ✔ |
| S-03 Dashboard | Must | E-27 | ✔ |
| S-04 Renovação | Must | E-28 | ✔ |
| L-01 Listas | Must | E-30, E-31 (+ E-07 offline no iPhone) | ✔ |
| L-02 Exportar CSV | Must | E-35 | ✔ |
| L-03 Catálogo | Must | E-32, E-33 (câmera) | ✔ |
| L-04 Preço | Must | E-34 | ✔ |
| L-05 Histórico | Should | E-37 | ✔ |
| L-08 Importar/mesclar | Must | E-36 | ✔ |

**Fora do plano (R2/R3):** A-02, C-07, S-05, X-01, feriados, passkey/Face ID (R2); L-07, X-02, X-03 (R3).

**Dependências do backlog verificadas:**
- F-07/F-03 bloqueiam tudo → E-03 (F-03) e E-06 (F-07) ficam antes de qualquer módulo de produto (E-12+).
- UUID desde o início → convenção na migração da E-03; L-01 usa na E-30.
- C-03 (E-14) antes de S-02 (E-29), do vínculo de L-04 (E-34) e do vínculo de A-01 (E-21); A-02 é R2.
- A-03/A-04 (E-22/E-23) antes de A-05 (E-25) e S-04 (E-28).
- F-01/F-06 logo depois de F-03 (E-04, E-05).

## 14. Riscos de sequência

| # | Risco | Efeito | Mitigação |
|---|---|---|---|
| 1 | Não há iPhone (D-049) | Decisões do web tomadas por aproximação; surpresas no Safari | WebKit em toda etapa + fila do iPhone + janelas J-1..J-3; decisões web provisórias até a J-1 |
| 2 | KDF lenta demais no Hermes | E-04/E-05 mudam | Medida já na E-02; PBKDF2 como plano B |
| 3 | Sem CSVs anonimizados na hora do Sprint 3 | E-12..E-19 param | Script de anonimização entregue na E-12; o Kaynan exporta durante o Sprint 2 |
| 4 | Critérios antigos de C-01..C-06 ausentes | Retrabalho na Importação | Contrato = BRD §5.2 + tabela do backlog + comportamento do código antigo (caracterização); divergência vira pergunta |
| 4b | Código antigo traz decisões incompatíveis (backup com `.db` cru, ML, categorias, só Android) | Porte "literal" quebra D-008/D-030/paridade | Triagem do §0.4: decisões vigentes prevalecem; nada entra sem teste |
| 4c | SDK 57 → 58 e Hermes/web | APIs do código antigo mudaram ou não existem no web | Conferir a doc atual em cada porte; adaptador web sempre novo |
| 5 | Só um fabricante Android (D-049) | Critério "2 fabricantes" só fecha no beta | OPPO (o mais agressivo) antes; amigo Android nas 2 primeiras semanas do beta; emulador API 29/37 para versões |
| 6 | Mudança de esquema depois de backups reais | Restauração quebra | `schemaVersion` + migração testada em toda etapa com migração (vetor de backup antigo restaurando) |
| 7 | Etapas grandes (E-04, E-05, E-23) | Estouram a sessão | Divisões a/b já previstas |
| 8 | Ritmo ≤ 5 h/semana | MVP longo | M-0 mede; aplicar a ordem de corte (§15) sem cortar os "nunca cortar" |
| 9 | Service worker mal versionado | Usuários presos em versão antiga | Entra cedo (E-07) e é testado A → B no iPhone |
| 10 | Libs do Expo com suporte web diferente do esperado | Degradação inesperada | Verificar a doc atual em cada etapa; adaptador `supported:false` + matriz |

## 15. Ordem de corte (D-013)

**Nunca cortar:** F-01, F-03, F-04, F-06, F-07, F-08, C-01..C-06, A-01, A-03, A-04 → etapas E-01..E-24 (exceto as partes listadas abaixo).

| Ordem | Corte | Etapas afetadas |
|---|---|---|
| 1 | L-05 Histórico/comparativo | E-37 sai |
| 1b | C-08 Lançamento manual (se aprovado) | E-17b sai |
| 2 | A-05 Ações rápidas | E-25 sai (ações ficam na faixa/lista) |
| 3 | L-03 só a câmera/EAN | E-33 sai (EAN digitado continua na E-32) |
| 4 | S-02 Detecção | E-29 sai |
| 5 | F-05 vira mínimo | E-11 reduz a log sem rotação/tela de compartilhar (o APK release fica) |
| 6 | L-04 Preço | E-34 sai |
| 7 | L-02/L-08 Lista por CSV | E-35 e E-36 saem |
| 7b | L-01 (só com o módulo Compras inteiro) | E-30..E-32 saem |
| 8 | S-01/S-03/S-04 | E-26..E-28 saem |

## 16. Status
Todas as etapas: **[ ] pendente**. Próxima: **E-01**, aguardando "Start" (3B).

## 17. Perguntas em aberto (impedem alguma etapa)
| # | Pergunta | Bloqueia |
|---|---|---|
| ~~1~~ | ~~Porte × reescrita da E-06~~ → **resolvida**: porte com triagem (D-045). | — |
| 2 | Se você ainda tiver o backlog de 14/10 (critérios de C-01..C-06), ele ajuda; sem ele, o contrato é BRD §5.2 + backlog + comportamento do código antigo. **Não bloqueia mais.** | — |
| ~~3~~ | ~~Bancos~~ → **resolvida** (D-048): Nubank, Itaú, Bradesco, BB, Caixa, Inter. Ainda preciso dos CSVs anonimizados de cada um (você roda o script da E-12). | E-12, E-13, E-19 |
| 4 | Sem iPhone (D-049, **proposta**): aprova as janelas J-1..J-3 com um iPhone emprestado e a mudança do critério de 2 fabricantes para o beta? Há alguém com iPhone para ~3 sessões de 30–45 min? | E-07 (J-1), M-1b, beta |
| 5 | Aprova os desvios do §0.1: SW/offline no Sprint 2 (E-07), Playwright já na E-03, página de bancada descartável publicada em preview `spike/*` na E-02, rota de autoteste em builds de debug/preview? | E-02, E-03, E-07 |
| 7 | Lançamento manual (C-08, D-050, **proposta**): inclui no MVP como Should (E-17b)? | E-17b |
| ~~6~~ | ~~Curva da espera do PIN~~ → **resolvida** (D-029). | — |
