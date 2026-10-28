# BRD — Business Requirements Document · Casa em Dia

> Versão 1.0 · 28/10/2026 · Fase 2 (Descoberta) concluída. Autor: Kaynan Macedo de Souza.
> Fonte de escopo funcional: `docs/backlog-local-first.pdf` (15/10/2026), **ajustada pelas decisões D-001..D-043** em `DECISIONS.md`. Onde o backlog e este documento divergem, vale este documento (com o D-xxx citado).

## 1. Problema
O dinheiro e a rotina da casa estão espalhados: extratos em vários bancos, contas com vencimentos diferentes, assinaturas esquecidas e listas de compras em papel ou em apps sem histórico de preço. As soluções existentes exigem conta, servidor ou acesso bancário, o que expõe dados financeiros a terceiros.
**Casa em Dia** é uma fonte única e **privada**: o dado que entra por um módulo alimenta os outros (o extrato revela assinaturas e contas recorrentes, que viram lembretes; a lista de compras mostra quanto custa cada mercado), e **tudo fica no aparelho**.

**Promessa (D-010):** *"Seu dinheiro e sua rotina num só lugar, privado."*

## 2. Usuários e personas (D-009)
Beta com 3–5 pessoas, **maioria Android**, perfil misto. Sem conta: cada pessoa tem o app e os dados só no próprio celular.

| Persona | Perfil | Plataforma | Necessidades |
|---|---|---|---|
| **Kaynan (autor)** | Jovem, técnico | Android (OPPO) | Visão do mês, contas, importar extratos de vários bancos |
| **Amigo(a) jovem** | 20–30 anos, à vontade com tecnologia | Android ou iPhone | Instalar sem ajuda, lista no mercado, assinaturas |
| **Familiar mais velho(a)** | Menos familiaridade; **fonte ampliada**, possível **daltonismo/baixa visão** | Android ou iPhone | Onboarding guiado, textos simples, alvos grandes, não depender de cor, lembretes confiáveis |

## 3. Objetivos e métricas
### 3.1 Critério de sucesso do produto (D-012)
- Após 30 dias de uso real, **os amigos usam o app sem a ajuda do Kaynan**: instalam, importam, usam a lista e respondem aos lembretes.

### 3.2 Critério técnico de saída do MVP (backlog + D-012)
- ≥ **70%** das transações categorizadas sem intervenção.
- Lembretes disparando no horário em teste de **14 dias** em **≥ 2 fabricantes Android**.
- Backup restaurado em outro aparelho, **incluindo Android ↔ iPhone** (D-008).
- **iPhone validado no PWA**: instalação, uso offline, faixa de avisos e `.ics`.
- Metas de desempenho do TRD §6 atendidas (D-041).
- Checklist de acessibilidade aprovado em todas as telas (D-027).

### 3.3 Metas de R2/R3 (backlog)
- R2: categorização > 85%; detecção de recorrências com 80% de precisão.
- R3: cupom fiscal em ≥ 3 estados (**só Android**; inviável no PWA, ver matriz).

## 4. Escopo por release
Legenda de situação: **Novo** · **Refazer/Adaptar** (backlog) · **Portar** (D-045: código antigo do `dia-a-dia` portado com triagem para `src/core` + portas; substitui D-036).

### 4.1 MVP
| ID | PBI | Prioridade | Situação | Observações |
|---|---|---|---|---|
| F-01 | Bloqueio por biometria/PIN | Must | Refazer | PIN 6 + biometria (Android); só PIN no iPhone (D-003, D-029) |
| F-03 | Criptografia local do banco | Must | Refazer | SQLCipher (Android); estratégia web no spike E-02 (D-004) |
| F-04 | Exportação e exclusão dos dados | Must | Adaptar | **Nunca cortar** (D-013); escopo de exclusão por plataforma (D-035) |
| F-05 | Log local de diagnóstico | Should | Adaptar | Pode virar mínimo (D-013) |
| F-06 | Backup criptografado e restauração | Must | Novo | Formato único Android ↔ iPhone (D-008) |
| F-08 | **Onboarding e ajuda** (novo, D-044) | Must | Novo | Instalação no iPhone, onboarding em 4 passos (D-023), ajuda de instalar o APK e de exportar o CSV de cada banco; nunca cortar |
| F-07 | Porte do núcleo (com triagem) | Must | **Portar** | `src/core` em TS puro + adaptadores; testes escritos no porte; golden files de CSVs anonimizados (D-045) |
| C-01 | Importação de CSV com detecção de formato | Must | **Portar** | 6 bancos (D-030); Caixa e Inter como extras (D-045) |
| C-02 | Mapeamento de colunas e perfis de banco | Must | **Portar** | |
| C-03 | Deduplicação e idempotência | Must | **Portar** | |
| C-04 | Categorização por regras e dicionário | Must | **Portar** | Dicionário antigo como base; categorias ajustadas ao D-030; ML fica para C-07 (R2) |
| C-05 | Correção manual com aprendizado | Must | **Portar** | |
| C-06 | Dashboard por categoria e período | Must | **Portar** | Gráficos próprios (D-021) |
| A-01 | Contas a pagar e recorrência | Must | Portar (parcial) | D-031; base em `dia-a-dia` (D-045) |
| A-03 | Permissões e confiabilidade dos alertas | Must | A fazer | Android; no iPhone, tela "Lembretes no iPhone" (D-001) |
| A-04 | Motor de lembretes locais | Must | Portar (parcial) | Android: notificações (base em `dia-a-dia`, D-045); iPhone: faixa + `.ics` (D-001) |
| A-05 | Ações rápidas na notificação | Should | Portar (parcial) | Só Android (D-005) |
| S-01 | Cadastro manual de assinaturas | Must | A fazer | Cotação manual (D-032) |
| S-02 | Detecção de assinaturas no CSV | Should | A fazer | |
| S-03 | Dashboard de custo mensal/anual | Must | A fazer | |
| S-04 | Lembretes de renovação/cancelamento | Must | A fazer | |
| L-01 | Listas de compras | Must | A fazer | |
| L-02 | Exportar lista em CSV | Must | A fazer | |
| L-03 | Catálogo de itens e estabelecimentos | Must | A fazer | EAN: câmera no Android, digitado no iPhone (D-033) |
| L-04 | Registro de preço ao concluir a compra | Must | A fazer | Item a item (D-033) |
| L-05 | Histórico e comparativo de preços | Should | A fazer | 1º na ordem de corte |
| L-08 | Importar lista de CSV e mesclar | Must | A fazer | |

### 4.2 R2
A-02 (recorrentes no CSV) · C-07 (modelo leve no aparelho) · S-05 (alerta de reajuste) · **X-01 Orçamento por categoria** (D-034) · **Passkey/Face ID no iPhone**, se aprovada no E-02 (D-003) · **Feriados nacionais** no "dia útil" (D-031) · cotação online opcional (reavaliar, D-032).

### 4.3 R3
L-07 (cupom NFC-e; só Android) · **X-02 Metas de economia** · **X-03 Divisão de despesas da casa** (troca por CSV) (D-034).

### 4.4 Ordem de corte do MVP (D-013)
Nunca cortar: F-01, F-03, F-04, F-06, F-07, **F-08**, C-01..C-06, A-01, A-03, A-04.
Cortar nesta ordem: 1. L-05 · 2. A-05 · 3. câmera do L-03 · 4. S-02 · 5. F-05 (mínimo) · 6. L-04 · 7. L-02/L-08 · 7b. L-01 (só com o módulo Compras inteiro) · 8. S-01/S-03/S-04.

### 4.5 Plano de sprints (referência; substitui o do backlog)
Um "sprint" aqui é uma **unidade de escopo**, não 2 semanas: com até 5 h/semana (D-043), cada um deve levar várias semanas. A data do beta é estimada após o Sprint 1.

| Sprint | Foco | PBIs |
|---|---|---|
| 0 (Fase 3) | Spike E-02: cripto web, KDF, passkey PRF, `.ics`, câmera web, Hermes `Intl` | — |
| 1 | Núcleo e fundação Android: core (money/dates/events), portas, storage + migrações, SQLCipher, bloqueio, 1º APK release | F-07 (base), F-03, F-01 |
| 2 | Web/PWA base + backup: storage web (estratégia do E-02), manifest + SW, backup único, exportar/apagar, log | F-03 (web), F-06, F-04, F-05, F-08 |
| 3 | Importação I: parser, perfis (2–3 bancos), script de anonimização | C-01, C-02 |
| 4 | Importação II: dedupe, categorização, correção, dashboard, demais bancos | C-03..C-06 |
| 5 | Contas e confiabilidade | A-01, A-03 |
| 6 | Lembretes: Android + faixa/`.ics` no iPhone; ações | A-04, A-05 |
| 7 | Assinaturas | S-01..S-04 |
| 8 | Compras I | L-01, L-03, L-04 |
| 9 | Compras II + preços | L-02, L-08, L-05 |
| 10 | Beta: teste de 14 dias, restauração cruzada, teste com 1 familiar, correções | — |

## 5. Regras de negócio por módulo
### 5.1 Fundação
- **Sem conta, sem servidor de dados.** Dados só saem do aparelho por backup (F-06), exportação (F-04) ou CSV de lista (L-02), sempre por ação do usuário.
- **Bloqueio:** PIN de 6 dígitos (nunca em texto claro; KDF com sal); biometria no Android; trava 1 min após ir para segundo plano (opções: imediato, 1, 5, 15 min); 5 erros → espera crescente (persistida). **PIN esquecido não tem recuperação**: restaurar backup ou apagar tudo (avisado no onboarding). (D-029)
- **Captura/Recentes:** bloqueado por padrão no Android, desligável; no iPhone não é possível (D-029).
- **Backup:** arquivo único criptografado com senha do usuário (sem recuperação da senha); restaurar valida integridade e versão, pede confirmação, substitui tudo e reagenda alertas. Lembrete: **Android mensal (dia 1, 20h)**, **iPhone semanal dentro do app**; "Backup: há N dias" no Início; alerta âmbar acima de 30 dias (Android) ou 7 dias (iPhone). (D-002, D-008, D-029)
- **iPhone:** uso liberado só com o app instalado na Tela de Início; o app pede persistência ao navegador (D-002).
- **Apagar tudo:** PIN/biometria + digitar APAGAR; remove banco, chaves, notificações, temporários, caches e SW (web); backups externos não são apagados (D-035).
- **Privacidade:** nenhuma coleta pelo app; texto curto (UX.md §8) informa que a Cloudflare recebe só dados técnicos de acesso ao site (D-035).
- **Modo privacidade:** 👁 oculta todos os valores (D-022).

### 5.2 Importação e categorização
- Bancos-alvo: Nubank, C6, Santander, Banco do Brasil, Itaú, Bradesco (D-030); outros pelo mapeamento manual (C-02).
- Limite 10 MB / 50 mil linhas (reduzir só no iPhone se o teste exigir, com mensagem clara).
- Importação inteira numa transação; reimportar o mesmo arquivo não muda nada; desfazer em até 30 dias.
- CSV original **descartado** após importar (opção de reter até 30 dias, criptografado) (D-035).
- **Transferência** entre contas próprias, **pagamento de fatura**: fora dos totais. **Parcela**: só a do mês, nunca assinatura. **Estorno**: abate da categoria original (D-030).
- Categorias padrão editáveis (15, D-030). Correções viram regras (C-05). Nenhum dado sai do aparelho para "treino".
- Valores em centavos inteiros; datas contábeis em America/Sao_Paulo; **mês civil** e semana começando no domingo, configuráveis (D-035).

### 5.3 Contas e lembretes
- Recorrências: única, semanal, mensal (dia inexistente → último dia), anual, último dia útil (seg–sex, **sem feriados no MVP**), a cada N semanas/meses (D-031).
- Estados a vencer / vence hoje / vencida / paga, calculados pela data. Pagar cancela os lembretes pendentes e oferece vínculo com a transação do extrato.
- Lembretes padrão: **3 dias antes, 1 dia antes e no dia, às 9h**; silêncio 22h–7h; atraso 1×/dia por 3 dias; máx. 5/dia (excedente vira resumo). Editáveis por conta (D-031).
- Notificação/`.ics` mostra **só nome e data** por padrão (D-031).
- Boleto: linha digitável/Pix copia-e-cola com botão Copiar (D-031).
- **iPhone:** faixa "Precisa de atenção" ao abrir + badge (se suportado) + "Enviar para o Calendário" (`.ics` com alarmes) (D-001).

### 5.4 Assinaturas
- BRL/USD/EUR com **cotação manual** registrada por cobrança; sem rede (D-032).
- Catálogo de ~20 serviços BR, sem logos oficiais; valores são sugestões (D-032).
- Estados ativa/em teste/pausada/cancelada; canceladas saem do total. "Minha parte" em R$ ou % (D-032).
- Detecção S-02 conservadora (≥ 2 ocorrências, ±10% valor, ±3 dias; o catálogo permite 1); descartes lembrados.
- Custo normalizado calculado na consulta; a soma exibida bate com os itens ativos/em teste.
- Lembretes: 3 dias antes da cobrança (7 para anuais), 1 dia antes do fim do teste.

### 5.5 Compras
- Listas com itens (nome, qtd, unidade, observação, corredor), marcar/desmarcar, duplicar, colar texto; **ids UUID desde o início**; exclusão lógica.
- Unidades e corredores padrão editáveis (D-033).
- Preço **item a item, opcional**, sugerindo o último; mercado por ida; ao encerrar, total e vínculo com o extrato (D-033).
- CSV da lista: UTF-8, `;`, cabeçalho fixo com versão; preços opcionais; proteção contra injection; aviso de "não criptografado". Mesclagem por id → "atualizado em" mais recente → empate: comprado prevalece; resumo obrigatório antes de aplicar.
- EAN: câmera no Android; digitado no iPhone (D-033).

## 6. Fora de escopo
Servidor de dados, conta/login/2FA, lar e convites, sincronização automática ou em tempo real, Web Push/servidor de notificações (D-001), Telegram/WhatsApp/e-mail, **feed** ICS online (o **arquivo** `.ics` exportado está dentro, D-001), Open Finance/agregadores, LLM externo, analytics/telemetria/crash reporting remoto, CDN ou fontes de terceiros, cotação online no MVP (D-032), checagem online de versão (D-007), lojas de apps (D-007), domínio próprio e qualquer custo (D-043), logos de marcas (D-032), PWA no Android (D-005), cobrança/planos.

## 7. Riscos
| Risco | Impacto | Mitigação |
|---|---|---|
| **Perda de dados** (celular perdido; iOS apaga o PWA) — prioritário para o Kaynan | Perda total | Backup único (F-06), lembretes mensal/semanal, instalação obrigatória + `persist()` no iPhone, restauração cruzada testada |
| **Amigos não conseguem instalar/usar** — prioritário | Falha do critério de sucesso | Onboarding guiado (D-023), tutorial de APK e Tela de Início, teste com 1 familiar antes do beta, acessibilidade (D-027) |
| Prazo: porte dos Épicos 1–3 (sem testes, SDK 57, só Android) com ≤ 5 h/semana | MVP muito longo | Medir velocidade no Sprint 1; ordem de corte D-013 |
| Android mata alarmes (ColorOS etc.) | Lembrete não toca | A-03, reagendar ao abrir, teste de 14 dias em 2 fabricantes |
| iPhone sem notificação local | Usuário iPhone perde vencimento | Faixa no app + `.ics`; comunicar a limitação no onboarding |
| Criptografia/KDF no web indefinida | Atraso/insegurança | Spike E-02 antes do Sprint 1 |
| Formatos de CSV dos bancos mudam | Importação quebra | Perfis versionados, mapeamento manual, golden files |
| PIN esquecido | Perda de acesso | Aviso no onboarding; backup |
| Cloudflare Pages clássico em manutenção | Mudança forçada de hospedagem | Decidir Pages × Workers antes da produção (ADR-006) |
| Chave de assinatura do APK perdida | Impossível atualizar | `docs/ASSINATURA.md` |
| Excesso de notificações | Usuário silencia o app | Máx. 5/dia, silêncio, só nome e data |

## 8. Premissas
- Cada usuário tem um único aparelho principal; Android ≥ 10, iOS ≥ 18 (D-040).
- O Kaynan fornece CSVs reais dos seus bancos e anonimiza com o script local; amigos ajudam para os demais bancos (D-036, mantido pela D-045).
- O Cloudflare Pages (gratuito) continua disponível para o PWA; o código do front pode ser público (D-006).
- Distribuição do APK e avisos de atualização são feitos manualmente pelo Kaynan (D-007).
- Custo zero (D-043).
