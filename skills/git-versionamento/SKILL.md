---
name: git-versionamento
description: Use ao criar branch, commitar, taguear sprint, revisar o que pode entrar no git, ou relacionar uma branch com um preview do Cloudflare Pages.
---

# git-versionamento — Git do Casa em Dia

## Objetivo
Histórico pequeno, legível e rastreável até o PBI, sem nenhum segredo ou dado real.

## Branches
- `main`: estável; é a **branch de produção** do projeto Pages (`casa-em-dia`). Deploy de produção **só** com comando explícito do Kaynan.
- Trabalho: `feat/<pbi>-<slug>`, `fix/<pbi>-<slug>`, `chore/<slug>`, `docs/<slug>`, `spike/<slug>`.
  Ex.: `feat/a-04-reminder-engine`, `spike/web-encryption`.
- Integrar na `main` quando a etapa passar nos testes **e** o Kaynan aprovar.

## Commits (Conventional Commits; descrição em inglês, conforme AGENTS.md §1; exceção: mensagem ditada literalmente pelo Kaynan no prompt)
- Formato: `<type>(<scope>): <descrição>` + corpo opcional + `Refs: <PBI>`.
- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`.
- Scope = módulo: `core`, `import`, `bills`, `subscriptions`, `shopping`, `platform`, `storage`, `pwa`, `android`.
- Um assunto por commit; pequeno. Commitar só quando o Kaynan pedir ou quando a etapa mandar.
- Rodapé de coautoria conforme instruções vigentes da sessão.
- Ex.: `feat(bills): generate instances for 90-day window` + `Refs: A-01`.

## Tags
- Por sprint/etapa aprovada: `sprint-<n>` (ex.: `sprint-1`) ou `fase-<n>` (ex.: `fase-1`). Tag anotada: `git tag -a fase-1 -m "Fase 1 concluída"`.
- Releases do app (quando houver distribuição): `v<major>.<minor>.<patch>`, alinhadas ao `version` do `app.json`.
- Remoto: `origin` = `git@github.com:KaynanSouza/App-de-Financas-e-Casa.git`. **Não fazer push** de commits, branches ou tags sem pedido do Kaynan (até a Fase 1, nada foi enviado pelo agente).

## Nunca versionar (o `.gitignore` cobre; conferir no `git status` antes de cada commit)
- Keystores e certificados (`*.jks`, `*.keystore`, `*.p12`, `*.key`, `*.pem`), `credentials.json`.
- `.env*`, `.dev.vars*`, `.wrangler/`, tokens da Cloudflare/EAS.
- CSVs reais (`*.csv` só em `tests/fixtures/**`, sintéticos), `.ofx`, dumps, `*.db`, `*.sqlite*`, backups.
- `dist/`, `android/`, `ios/`, `*.apk`, `*.aab`, `node_modules/`.
- `.gitattributes` mantém binários (PDF, PNG) intactos e LF no repositório.

## Branch → preview no Cloudflare Pages
- O projeto é **Direct Upload** (sem integração Git): uma branch **não** gera preview sozinha.
- Para publicar o preview de uma branch (avisando o Kaynan antes):
  ```powershell
  npx expo export --platform web
  npx wrangler pages deploy dist --project-name casa-em-dia --branch <nome-da-branch>
  ```
  → `https://<branch-normalizada>.casa-em-dia-44l.pages.dev` (minúsculas; `/` vira `-`). O wrangler registra o hash do commit: commitar **antes** do deploy.
- `--branch main` = **produção**: proibido sem comando explícito.

## Checklist antes de commitar
- [ ] `git status` sem arquivo proibido; `git diff --cached` revisado.
- [ ] `npm test` e `npx tsc --noEmit` verdes.
- [ ] `SESSION.md` atualizado; lição relevante registrada na skill (ver `skills/README.md`).
- [ ] Mensagem com PBI.

## Armadilhas
- Um PDF tratado como texto pelo `autocrlf` corrompe: por isso existe o `.gitattributes` com `*.pdf binary`.
- Commitar `android/local.properties` (caminhos da máquina): fica em `android/`, ignorado.
- Deploy antes de commitar: o preview fica associado ao hash errado.
