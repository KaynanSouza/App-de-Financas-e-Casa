---
name: backlog-pbi
description: Use ao iniciar qualquer PBI ou etapa: ler o PBI no backlog, reinterpretar o que a nova arquitetura muda, quebrar em tarefas e verificar a definição de pronto antes de pedir aprovação.
---

# backlog-pbi — Do PBI às tarefas e à definição de pronto

## Objetivo
Transformar um PBI do backlog em tarefas pequenas e verificáveis, sem inventar requisito e sem esquecer a plataforma iPhone/PWA.

## Fontes, nesta ordem
1. `SESSION.md` (onde estamos) → `CONTEXT.md` → `AGENTS.md`.
2. PBI em `docs/backlog-local-first.pdf` (fonte de **escopo funcional**). Extração: `pdftotext -enc UTF-8 -layout docs/backlog-local-first.pdf <scratch>/backlog.txt`.
3. `DECISIONS.md` (inclui os **24 pontos** que a arquitetura Expo mudou) e `ARCH.md`.
4. `docs/matriz-paridade.md` e a skill técnica correspondente.

## Passo a passo
1. **Ler o PBI inteiro:** descrição, critérios de aceite, notas técnicas, dependências.
2. **Reinterpretar:** onde o PBI citar Capacitor, plugin, WebView, IndexedDB proibido, Keystore ou notificação local, tratar como **intenção**; achar o item correspondente em `DECISIONS.md`. Atenção: C-01..C-06 aparecem como "Concluído (portar)" no backlog, mas são **reescrita** (D-036); **F-08 Onboarding e ajuda** é PBI novo (D-044). O escopo vigente está no `BRD.md` §4.
3. **Checar dependências** do PBI: estão prontas? Se não, parar e avisar.
4. **Listar lacunas e contradições** e **perguntar** ao Kaynan antes de codar. Nunca preencher requisito por conta própria.
5. **Declarar a paridade:** para cada critério, o comportamento no Android e no iPhone/PWA; se faltar capacidade, propor a degradação e **avisar**.
6. **Quebrar em tarefas** (cada uma ≤ 1 commit):
   - core puro + testes unitários;
   - porta/adaptadores em `src/platform` (se houver);
   - esquema/migração (`src/storage`);
   - módulo (`src/modules/<épico>`) + eventos;
   - tela (`src/app`) + a11y;
   - segurança (checklist);
   - testes de integração/e2e e roteiro manual;
   - docs (matriz, TRD/UX se mudou algo, `SESSION.md`).
7. Mapear **critério de aceite → teste** (tabela no PR/relatório).
8. Executar uma tarefa por vez; commit por tarefa com `Refs: <PBI>`.

## Definição de pronto (DoD) — tudo obrigatório
- [ ] **Código** em camadas corretas (core puro, plataforma isolada, sem import nativo fora de `src/platform`).
- [ ] **Testes:** cada critério de aceite coberto; `npm test` e `npx tsc --noEmit` verdes; golden files OK quando aplicável.
- [ ] **Acessibilidade:** checklist `a11y-expo` nas telas novas.
- [ ] **Segurança:** checklist `security-review` aplicável; sem dado real em log, teste ou commit.
- [ ] **Plataformas:** comportamento declarado em `docs/matriz-paridade.md` para Android **e** iPhone/PWA; degradações comunicadas.
- [ ] **Sem rede obrigatória**; funciona em modo avião.
- [ ] **Dinheiro em centavos**; datas em America/Sao_Paulo.
- [ ] **Docs:** `SESSION.md` atualizado; lição relevante registrada na skill correspondente.
- [ ] **Relatório:** feito, testado, **não testado** (por plataforma), próximo passo.
- [ ] **Aprovação do Kaynan** antes de avançar.

## Armadilhas
- Antes de iniciar uma etapa, ler o bloco dela no `PLAN.md` (escopo, dependências, critérios, testes, demonstração) e as perguntas abertas do §17; a etapa só começa com o "Start" do Kaynan.
- Os critérios de aceite de C-01..C-06 não estão no backlog atual ("continuam válidos" do backlog de 14/10, ausente no repo): usar BRD §5.2 até o Kaynan responder (PLAN §17).
- Tratar a nota técnica do backlog como instrução literal (ex.: "Web Worker" no nativo, "plugin do Capacitor").
- Esquecer as dependências críticas: F-07/F-03 bloqueiam tudo; C-03 bloqueia S-02/A-02/L-04; os UUIDs de L-01 precisam existir desde o início.
- Fazer dois PBIs de uma vez.
- O critério de saída do MVP fala só de Android: a validação no PWA ainda é uma decisão pendente.

## Exemplo mínimo (quebra do A-01)
| Tarefa | Camada | Teste |
|---|---|---|
| Gerar ocorrências (mensal/anual/semanal/dia 31/último dia útil) | core | unit + fuso |
| Estado a vencer/hoje/vencida/paga calculado pela data | core | unit com relógio fake |
| Tabelas `bill_template` / `bill_instance` + migração | storage | integração SQLite |
| Instâncias dos próximos 90 dias ao abrir/alterar | módulo bills | unit + integração |
| Tela de cadastro (valor em centavos, a11y) | app | RNTL + manual |
| Paridade: Android lembra (A-04); iPhone = decisão pendente | docs | — |
