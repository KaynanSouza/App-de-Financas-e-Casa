# UX — Experiência do usuário · Casa em Dia

> Versão 1.0 · 28/10/2026 · Fase 2. Decisões: D-009, D-014..D-029, D-033, D-035 em `DECISIONS.md`.
> Público misto, com familiares mais velhos, fonte ampliada e daltonismo/baixa visão (D-009): **acessibilidade é requisito, não acabamento.**

## 1. Princípios
1. **Calmo e claro** (D-015): uma informação principal por bloco, números grandes, bastante respiro.
2. **O que precisa de atenção primeiro** (D-019): o app abre mostrando o que exige ação.
3. **Privado por padrão**: sem conta; o app explica onde os dados ficam; modo privacidade a um toque (D-022).
4. **Nunca só cor** (D-016): estado = ícone + texto + cor.
5. **Uma mão** (D-028): ações principais na metade inferior; alvos ≥ 48 (D-027).
6. **Honesto sobre limites**: no iPhone, o app diz claramente que não há notificação e oferece a alternativa (D-001).
7. **Erros humanos** (D-024): dizem o que aconteceu e o que fazer, sem culpar e **sem mostrar dados**.
8. **Desfazer em vez de "tem certeza?"** para ações reversíveis (D-027).

## 2. Navegação (D-018)
Abas inferiores fixas, ícone + rótulo: **Início · Gastos · Contas · Compras · Mais**. Topo de cada tela: título, 👁 (modo privacidade) e ⚙ (atalho para Configurações) no Início. Botão principal da tela fixo acima das abas. No web em tela grande: coluna centralizada de ~480 px (D-020). Voltar: gesto/sistema no Android; botão "‹ Voltar" no topo no PWA.

## 3. Mapa de telas (D-025)
| # | Tela | Grupo | PBI | Android | iPhone/PWA |
|---|---|---|---|---|---|
| 1 | Instalar na Tela de Início | Onboarding | F-08, D-002 | — | ✔ (bloqueia até instalar) |
| 2 | Boas-vindas + privacidade | Onboarding | F-08, F-04 | ✔ | ✔ |
| 3 | Criar PIN (+ biometria) | Onboarding | F-01 | ✔ (biometria) | ✔ (só PIN) |
| 4 | Backup: risco e lembrete | Onboarding | F-06 | ✔ mensal | ✔ semanal |
| 5 | Primeiro passo | Onboarding | F-08, D-023 | ✔ | ✔ |
| 6 | Bloqueio (PIN/biometria) | Sessão | F-01 | ✔ | ✔ (PIN) |
| 7 | Início | Início | D-019, A-04, S-04 | ✔ | ✔ (faixa = alerta) |
| 8 | Dashboard de gastos | Gastos | C-06 | ✔ | ✔ |
| 9 | Transações | Gastos | C-03, C-06 | ✔ | ✔ |
| 10 | Detalhe/corrigir transação | Gastos | C-05 | ✔ | ✔ |
| 11 | Importar: escolher arquivo | Gastos | C-01 | ✔ (+ "Abrir com") | ✔ (seletor) |
| 12 | Importar: prévia/mapeamento | Gastos | C-02 | ✔ | ✔ |
| 13 | Importar: resultado | Gastos | C-03, C-04 | ✔ | ✔ |
| 14 | Histórico de importações (desfazer) | Gastos | C-03 | ✔ | ✔ |
| 15 | Regras de categoria | Gastos | C-04, C-05 | ✔ | ✔ |
| 16 | Categorias | Gastos | C-04 | ✔ | ✔ |
| 17 | Contas (a vencer / vencidas / pagas) | Contas | A-01 | ✔ | ✔ |
| 18 | Nova/editar conta | Contas | A-01 | ✔ | ✔ |
| 19 | Detalhe da conta (pagar, vincular) | Contas | A-01 | ✔ | ✔ |
| 20 | Regras de lembrete | Contas | A-04 | ✔ | ✔ (vira `.ics`) |
| 21 | Meus alertas estão funcionando? | Contas | A-03 | ✔ | — |
| 22 | Lembretes no iPhone (`.ics`) | Contas | A-04, D-001 | — | ✔ |
| 23 | Listas | Compras | L-01 | ✔ | ✔ |
| 24 | Lista (por corredor) / ida ao mercado | Compras | L-01, L-04 | ✔ | ✔ |
| 25 | Colar itens | Compras | L-01 | ✔ | ✔ |
| 26 | Catálogo de produtos + fusões | Compras | L-03 | ✔ | ✔ |
| 27 | Estabelecimentos | Compras | L-03 | ✔ | ✔ |
| 28 | Produto: histórico de preço | Compras | L-05 | ✔ | ✔ |
| 29 | Onde comprar (comparativo) | Compras | L-05 | ✔ | ✔ |
| 30 | Exportar lista | Compras | L-02 | ✔ | ✔ |
| 31 | Importar lista: resumo da mesclagem | Compras | L-08 | ✔ | ✔ |
| 32 | Leitor de EAN | Compras | L-03 | ✔ câmera | ✔ digitação |
| 33 | Assinaturas (custo mensal/anual) | Mais | S-03 | ✔ | ✔ |
| 34 | Nova/editar assinatura (catálogo) | Mais | S-01 | ✔ | ✔ |
| 35 | Sugestões detectadas | Mais | S-02 | ✔ | ✔ |
| 36 | Detalhe da assinatura | Mais | S-04 | ✔ | ✔ |
| 37 | Backup e restauração | Mais | F-06 | ✔ | ✔ |
| 38 | Exportar/apagar dados | Mais | F-04 | ✔ | ✔ |
| 39 | Configurações | Mais | F-01, D-015, D-029, D-035 | ✔ | ✔ |
| 40 | Diagnóstico | Mais | F-05 | ✔ | ✔ (+ armazenamento) |
| 41 | Privacidade | Mais | F-04, D-035 | ✔ | ✔ |
| 42 | Sobre/versão + ajuda (instalar, CSV) | Mais | F-08, D-007 | ✔ | ✔ |

PBIs sem tela própria: **F-03** e **F-07** (infraestrutura; o estado da criptografia aparece em Diagnóstico) e **A-05** (ações "Paguei"/"Lembrar amanhã" na **notificação** do Android; no iPhone as mesmas ações ficam na faixa do Início e na lista de Contas).

## 4. Wireframes principais
### 4.1 Instalar (iPhone) e Boas-vindas
```
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ Instale o Casa em Dia         │   │        ⌂✓  Casa em Dia         │
│                               │   │                               │
│ 1. Toque em  ⬆ Compartilhar   │   │ Seu dinheiro e sua rotina     │
│ 2. "Adicionar à Tela de       │   │ num só lugar, privado.        │
│     Início"                   │   │                               │
│ 3. Abra pelo ícone ⌂✓          │   │ • Seus dados ficam só neste   │
│ [imagem passo a passo]        │   │   aparelho. Sem conta.        │
│                               │   │ • Você decide quando algo sai │
│ Por quê? No iPhone, instalar  │   │   daqui (backup/exportação).  │
│ protege seus dados de serem   │   │                               │
│ apagados pelo sistema.        │   │ [ Ler sobre privacidade ]     │
│                               │   │                               │
│   (não há botão "pular")      │   │        [   Começar   ]        │
└───────────────────────────────┘   └───────────────────────────────┘
```

### 4.2 Criar PIN / Bloqueio
```
┌───────────────────────────────┐
│ Crie um PIN de 6 dígitos      │
│ Ele protege o app. Não há     │
│ como recuperar: guarde bem.   │
│        ● ● ● ○ ○ ○            │  ← leitor: "3 de 6 dígitos"
│   ┌───┐ ┌───┐ ┌───┐           │
│   │ 1 │ │ 2 │ │ 3 │  …  (≥56) │
│   └───┘ └───┘ └───┘           │
│   [ ⌫ ]  [ 0 ]  [ ✓ ]         │
│ Android: [ Usar biometria ]   │
└───────────────────────────────┘
```

### 4.3 Início (D-019)
```
┌ Casa em Dia              👁  ⚙ ┐
│ ⚠ Precisa de atenção (3)        │
│ ✕ Internet · venceu ter 28/10   │
│   R$ 99,00   [Paguei] [Adiar]   │
│ ⚠ Luz · vence sex 31/10  R$ 182 │
│ ↻ Netflix · renova sáb   R$ 55  │
│ iPhone: [📅 Enviar p/ Calendário]│
├─────────────────────────────────┤
│ Outubro · gastos                │
│ R$ 3.482,10   ↓ 8% vs setembro  │
│ Assinaturas R$ 210,40/mês       │
├─────────────────────────────────┤
│ [↑ Importar extrato] [🛒 Lista] │
│ 💾 Backup: há 5 dias            │
├────┬──────┬──────┬───────┬──────┤
│ ⌂  │  ◔   │  ⏰   │  🛒   │  …   │
└────┴──────┴──────┴───────┴──────┘
```
Vazio: "Tudo em dia ✓. Nenhuma conta vencendo nos próximos 7 dias."

### 4.4 Gastos — Dashboard e Transações
```
┌ Gastos · Outubro ‹ ›      👁 ┐   ┌ Transações · Outubro   🔍 ⏷ ┐
│ R$ 3.482,10 · ↓ 8% vs set    │   │ ↓ Supermercado Bom Preço     │
│ Mercado   ███████░░ R$ 1.120 │   │   R$ 182,40                   │
│ Casa      █████░░░░ R$   890 │   │   Mercado · 12/10 · ****1234  │
│ Transporte██░░░░░░░ R$   410 │   │ ↑ Salário        R$ 4.500,00  │
│ …                            │   │   Renda · 05/10 · ****1234    │
│ [Ver como tabela]            │   │ ⇄ Transferência  R$ 500,00    │
│ Transferências e faturas não │   │   fora dos totais             │
│ entram no total ⓘ            │   │ ? Sem categoria (3) [Revisar] │
│     [ ↑ Importar extrato ]   │   │                               │
└──────────────────────────────┘   └───────────────────────────────┘
```

### 4.5 Importar (C-01..C-03)
```
1 Escolher        2 Conferir                    3 Pronto
┌──────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ Banco: Nubank│  │ Reconheci: Nubank conta  │  │ ✓ 214 novas              │
│ Conta: ▾     │  │ 214 linhas · 01–31/10    │  │ ⇄ 12 já existiam         │
│ [Escolher    │  │ Data | Descrição | Valor │  │ ? 31 sem categoria       │
│  arquivo CSV]│  │ 02/10 Padaria…  -12,50   │  │ [Revisar categorias]     │
│ Como exportar│  │ (prévia de 5 linhas)     │  │ [Desfazer importação]    │
│ do banco? ⓘ  │  │ [Ajustar colunas]        │  │ ↻ 2 assinaturas sugeridas│
│              │  │ [   Importar 214   ]     │  │                          │
└──────────────┘  └──────────────────────────┘  └──────────────────────────┘
Progresso: barra + "Lendo 18.000 de 50.000 linhas"; pode cancelar.
Erro: "Não reconheci este arquivo. Exporte o extrato em CSV no app do banco e tente de novo." [Ajuda]
```

### 4.6 Contas
```
┌ Contas            [+ Nova] ┐   ┌ Nova conta                  ┐
│ [A vencer] [Vencidas] [Pagas]│  │ Nome  [ Luz              ]  │
│ ✕ Internet  venceu 28/10  ⓘ │  │ Valor [ R$ 182,00 ] □ varia │
│   R$ 99,00   [Paguei]       │  │ Vence [ 31/10/2026 ]        │
│ ⚠ Luz      sex 31/10       │  │ Repete [ Todo mês, dia 31 ▾]│
│   R$ 182,00  [Paguei]       │  │ Lembrar [3d, 1d, no dia · 9h]│
│ ○ Aluguel  05/11  R$ 1.500  │  │ Categoria [ Contas da casa ▾]│
│                             │  │ Linha digitável [colar] [⧉] │
│ Android: Meus alertas ✓ OK  │  │ Obs.  [                  ]  │
│ iPhone:  Lembretes no iPhone│  │        [   Salvar   ]       │
└─────────────────────────────┘  └─────────────────────────────┘
```
Estados: ○ a vencer · ⚠ vence hoje/em breve · ✕ vencida · ✓ paga (sempre ícone + texto).

### 4.7 Lembretes no iPhone (D-001)
```
┌ Lembretes no iPhone            ┐
│ No iPhone, apps instalados     │
│ pelo Safari não conseguem      │
│ tocar alarmes sozinhos.        │
│ Você tem duas formas:          │
│ 1. Ao abrir o app, mostramos o │
│    que vence (faixa no Início).│
│ 2. Envie os vencimentos para o │
│    Calendário com alarmes:     │
│   [ 📅 Enviar próximos 60 dias ]│
│ Último envio: 20/10/2026       │
│ ⚠ O arquivo não é criptografado│
│   e mostra só nome e data.     │
└────────────────────────────────┘
```

### 4.8 Compras — Lista no mercado (D-033)
```
┌ Mercado da semana · Assaí ▾ 👁 ┐
│ HORTIFRÚTI                     │
│ ☑ Banana 1 kg    R$ [ 6,99 ]   │
│   último: R$ 6,49 (12/10)      │
│ ☐ Tomate 500 g                 │
│ FRIOS E LATICÍNIOS             │
│ ☐ Leite integral 1 L × 6       │
│ [+ Adicionar item] [Colar]     │
├────────────────────────────────┤
│ 3 de 12 · parcial R$ 42,30     │
│        [ Encerrar compra ]     │
└────────────────────────────────┘
⋯ menu: Compartilhar lista (CSV) · Importar lista · Duplicar · Arquivar
```

### 4.9 Assinaturas (S-03)
```
┌ Assinaturas                [+] ┐
│ R$ 210,40/mês · R$ 2.524,80/ano│
│ Como calculamos? ⓘ             │
│ Maiores: Spotify fam. (minha   │
│ parte R$ 11,15 de 44,90) …     │
│ ⧗ Em teste: Max · acaba 03/11  │
│ Ordenar: [Valor ▾]             │
│ ↻ Netflix   R$ 55,90  sáb 01/11│
│ ↻ iCloud    R$ 4,90   15/11    │
│ Sugestões encontradas (2) ›    │
└────────────────────────────────┘
```

### 4.10 Backup e restauração (F-06)
```
┌ Backup                          ┐
│ Último backup: há 5 dias ✓      │
│ Guarde em outro lugar que não   │
│ este celular (Drive, iCloud     │
│ Drive, e-mail para você).       │
│ [ Fazer backup agora ]          │
│ Senha do backup: sem ela o      │
│ arquivo não abre. Não há como   │
│ recuperar.                      │
│ ───────────────                 │
│ [ Restaurar de um arquivo ]     │
│ Substitui tudo neste aparelho.  │
│ Lembrete: [ Mensal ▾ ] (iPhone: │
│ semanal)                        │
└─────────────────────────────────┘
```

## 5. Design system
### 5.1 Cores (D-016) — contraste calculado (WCAG 2.x)
| Token | Claro | Contraste (sobre `#F7F8F9`) | Escuro | Contraste (sobre `#121417`) | Uso |
|---|---|---|---|---|---|
| `bg` | `#F7F8F9` | — | `#121417` | — | Fundo |
| `surface` | `#FFFFFF` | — | `#1C1F23` | — | Cards |
| `text` | `#1A1D21` | 15,91 | `#E8EAED` | 15,31 | Texto |
| `textMuted` | `#4A515A` | 7,55 | `#B4BAC2` | 9,44 | Texto secundário |
| `primary` | `#0F5F73` | 6,80 | `#6CC4D9` | 9,26 | Ações, links |
| `onPrimary` | `#FFFFFF` (7,23 sobre primary) | — | `#121417` (9,26 sobre primary) | — | Texto em botão |
| `income` | `#1F5FAD` | 5,99 | `#8AB4F8` | 8,76 | ↑ entrada |
| `expense` | `#B3471B` | 5,15 | `#F2A07B` | 8,87 | ↓ saída |
| `warning` | `#8A5A00` | 5,57 | `#E8C268` | 10,85 | ⚠ vence hoje/em breve |
| `success` | `#116B5C` | 6,02 | `#6FD1BC` | 10,12 | ✓ paga/feito |
| `danger` | `#A1263A` | 6,92 | `#F28B9B` | 7,86 | ✕ vencida/erro |
Sobre `surface`, os contrastes são maiores no claro (ex.: `expense` 5,48) e um pouco menores no escuro (≥ 7,04). Bordas/divisórias e foco: definir no Sprint 1 com ≥ 3:1 para componentes (WCAG 1.4.11).

### 5.2 Tipografia (D-017)
Fonte do sistema; valores com algarismos tabulares. Escala (sp/px, escalável até 200%): `caption` 13 · `body` 16 · `bodyStrong` 16/semibold · `title` 20/semibold · `headline` 24/semibold · `display` 32/bold (valor principal). Altura de linha 1,4–1,5. Nunca truncar valor monetário.

### 5.3 Espaçamento e forma
Base 4: `xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `xxl` 32. Margem lateral 16. Raio: 8 (botão/campo), 12 (card). Alvo mínimo **48×48**, espaço ≥ 12 entre ações (D-027). Tecla do PIN ≥ 56.

### 5.4 Componentes (D-026)
`Button` (primário/secundário/perigoso) · `IconButton` · `Card` · `MoneyText` (formata centavos, privacidade, rótulo acessível) · `MoneyField` (teclado numérico) · `TextField` · `ListItem` (2 linhas) · `StatusBadge` (ícone + texto + cor) · `Banner` (atenção/aviso/info) · `EmptyState` · `ProgressBar` · `PinPad` · `Tabs` · `SegmentedControl` · `Sheet` · `Toast` (com Desfazer, 10 s) · `ChartBar`/`ChartLine`/`ChartRing` + `ChartTable` (alternativa textual) (D-021).

### 5.5 Movimento e feedback (D-024)
Transições ≤ 200 ms; desligadas com "reduzir movimento". Vibração leve só no Android (Paguei, item comprado). Sem sons próprios.

## 6. Estados
| Estado | Padrão |
|---|---|
| Vazio | `EmptyState` com explicação + 1 ação ("Importe seu primeiro extrato") |
| Carregando | Esqueleto/placeholder; > 1 s mostra texto ("Calculando…") |
| Progresso longo | `ProgressBar` com números + cancelar (importação, backup) |
| Erro | O que aconteceu + o que fazer + ação; sem dados no texto |
| Offline (PWA) | Nada muda (o app é offline); só "Nova versão disponível" depende de rede |
| Privacidade ligada | `R$ ••••`; gráficos sem eixos numéricos |
| Bloqueado | Tela de PIN; conteúdo nunca visível por trás |
| Sem permissão (Android) | Banner na Início + atalho para "Meus alertas" |
| Não instalado (iPhone) | Tela "Instalar" (bloqueia) |

## 7. Microcopy (tom D-024)
- Confirmação reversível: "Luz marcada como paga. [Desfazer]"
- Apagar tudo: "Isso apaga todos os dados deste aparelho. Backups que você salvou em outro lugar continuam lá. Digite APAGAR para confirmar."
- Exportar: "Este arquivo não é criptografado. Quem tiver o arquivo poderá ler seus dados."
- PIN errado: "PIN incorreto. Tente de novo." → após 5: "Muitas tentativas. Aguarde 30 s."
- Esqueceu o PIN: "Não há como recuperar o PIN. Você pode restaurar um backup ou apagar os dados e começar de novo."
- Backup atrasado: "Seu último backup foi há 9 dias. [Fazer backup agora]"
- Importação duplicada: "Este extrato já foi importado. Nada mudou."
- Lista inválida: "Esta lista foi criada por uma versão mais nova do app. Atualize o Casa em Dia e tente de novo."
- iPhone sem alarme: "No iPhone, o Casa em Dia não toca alarmes sozinho. Envie os vencimentos para o Calendário."

## 8. Texto de privacidade (D-035)
> **Seus dados ficam só neste aparelho.**
> • Não existe conta, login nem servidor do Casa em Dia.
> • O Casa em Dia não coleta nada: sem análise de uso, sem anúncios, sem terceiros no app. A Cloudflare, que hospeda o site do iPhone, recebe apenas os dados técnicos de acesso (como qualquer site) ao baixar ou atualizar o app — nunca seus dados financeiros.
> • Seus dados só saem daqui quando **você** exporta, faz backup ou compartilha uma lista — e o app avisa quando o arquivo não é criptografado.
> • Se perder o celular sem backup, os dados se perdem.

## 9. Acessibilidade (D-027, D-028)
### 9.1 Requisitos globais
TalkBack e VoiceOver em **todas** as telas · fonte até 200% sem truncar · contraste AA (tabela 5.1) · nunca só cor · alvos ≥ 48 · "reduzir movimento" · gráficos com tabela · valores lidos corretamente ("cento e oitenta e dois reais"; "menos" para negativos; "valor oculto") · pt-BR fixo, `R$ 1.234,56`, `dd/mm/aaaa` · teclado numérico em valores/PIN/quantidades · web: Tab/Enter/Esc, foco visível, Esc fecha modais · toast anunciado (`announceForAccessibility` / `aria-live`).

### 9.2 Checklist por tela (aplicar a cada uma das 42 telas)
| # | Item | Nativo (Android) | Web (iPhone) |
|---|---|---|---|
| 1 | Todo elemento interativo tem papel + rótulo pt-BR | `accessibilityRole/Label` | `role`/`aria-label` (RN Web) |
| 2 | Estados expostos (checked, selected, disabled, expanded) | `accessibilityState` | `aria-*` |
| 3 | Ordem de leitura = ordem visual; cards agrupados | TalkBack | VoiceOver + Tab |
| 4 | Contraste conferido nos 2 temas | ✔ | ✔ |
| 5 | Fonte 200% sem corte; abas legíveis | Config. do sistema | Tamanho de texto do iOS |
| 6 | Alvos ≥ 48 e espaço ≥ 12 | ✔ | ✔ |
| 7 | Estado com ícone + texto | ✔ | ✔ |
| 8 | Valores com rótulo falado correto; privacidade = "valor oculto" | ✔ | ✔ |
| 9 | Gráfico tem "Ver como tabela" | ✔ | ✔ |
| 10 | Erros junto ao campo, em texto | ✔ | ✔ |
| 11 | Movimento respeita preferência | `isReduceMotionEnabled` | `prefers-reduced-motion` |
| 12 | Modais prendem e devolvem o foco; Esc fecha (web) | ✔ | ✔ |
| 13 | axe sem violações sérias | — | Playwright + axe |
| 14 | Roteiro manual executado | TalkBack no OPPO | VoiceOver no iPhone |

### 9.3 Pontos específicos
- **PIN:** anunciar "N de 6 dígitos", nunca os dígitos.
- **Lista no mercado:** item = checkbox com nome + quantidade; preço com rótulo "Preço de Banana".
- **Abas com 200%:** rótulos curtos (Início, Gastos, Contas, Compras, Mais); se não couber, ícone + rótulo acessível (testar).
- **Faixa "Precisa de atenção":** anunciada como região; cada item com ações acessíveis.
