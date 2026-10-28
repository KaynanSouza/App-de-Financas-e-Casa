# Skills do projeto Casa em Dia

Cada skill é uma pasta `skills/<nome>/SKILL.md` que ensina o agente, em sessões futuras, a executar uma tarefa recorrente **do jeito deste projeto**. Antes de uma tarefa, leia a skill correspondente (além de `SESSION.md`, `CONTEXT.md` e `AGENTS.md`).

## Lista

| Skill | Quando usar |
|---|---|
| [`expo-app`](expo-app/SKILL.md) | Rotas/telas, `app.json`, scripts, rodar Android/web, development build, expo-doctor, **adicionar dependência**. |
| [`platform-adapters`](platform-adapters/SKILL.md) | Qualquer coisa que difere entre Android e web; portas em `src/platform` com `.native.ts`/`.web.ts`/fake. |
| [`sqlite-native-sqlcipher`](sqlite-native-sqlcipher/SKILL.md) | Banco no Android: SQLCipher, chave, migrações, transações, UUID, centavos, exclusão lógica. |
| [`sqlite-web-encrypted`](sqlite-web-encrypted/SKILL.md) | Banco no PWA: WASM/OPFS, COOP/COEP, persistência, criptografia na aplicação, chave derivada do PIN. |
| [`alerts-android-and-ios`](alerts-android-and-ios/SKILL.md) | Lembretes: agendamento e reagendamento no Android, diagnóstico, alternativa do iPhone. |
| [`pwa-cloudflare-pages`](pwa-cloudflare-pages/SKILL.md) | Manifest, service worker, offline, `_headers`/CSP, `_redirects`, preview e produção no Pages. |
| [`csv-bancos-br`](csv-bancos-br/SKILL.md) | Importar extratos BR (encoding, datas, valores, perfis, golden files) e CSV da lista (injection). |
| [`backup-cross-platform`](backup-cross-platform/SKILL.md) | Backup/restauração F-06 num formato único Android ↔ iPhone; exportação F-04. |
| [`a11y-expo`](a11y-expo/SKILL.md) | Criar ou revisar qualquer tela/componente (TalkBack, VoiceOver, WCAG 2.2 AA). |
| [`security-review`](security-review/SKILL.md) | Antes de fechar PBI que toque dados, arquivos, logs, rede, headers ou autenticação; STRIDE. |
| [`testing-strategy`](testing-strategy/SKILL.md) | Planejar/escrever testes; escolher o nível; roteiro manual em aparelhos reais. |
| [`git-versionamento`](git-versionamento/SKILL.md) | Branch, commit, tag, o que nunca versionar, branch → preview no Pages. |
| [`backlog-pbi`](backlog-pbi/SKILL.md) | Iniciar um PBI: ler, reinterpretar, quebrar em tarefas, **definição de pronto**. |

## Gestão das skills

- **Toda lição relevante de uma etapa vira uma linha na skill correspondente, no mesmo commit da etapa.** Lição relevante = algo que custou tempo, uma armadilha real, um comando que funcionou, um fato verificado na documentação (com versão e data) ou uma decisão que muda o "como fazer".
- Escreva o **fato e a ação** ("CMake 3.22.1 quebra por MAX_PATH → usar 4.1.2 + `cmake.dir`"), não a história.
- Onde depender de biblioteca ou API, escreva **"verificar a documentação atual antes de usar"**; nunca invente API. Ao verificar, registre versão e data.
- Decisões ainda abertas ficam marcadas **"A DECIDIR"** e apontam para `DECISIONS.md`. Quando decididas, atualize a skill no mesmo commit do ADR.
- Mantenha cada `SKILL.md` com **no máximo ~120 linhas**. Se crescer, enxugue ou divida (nova skill = nova linha nesta tabela + referência no `AGENTS.md`, se for de uso geral).
- Informação errada ou desatualizada é **removida**, não acumulada.
- Formato de cada SKILL.md: frontmatter (`name`, `description` dizendo **quando** usar), objetivo, passo a passo, checklist de qualidade, armadilhas, exemplo mínimo.
- Fonte das armadilhas reais da Fase 1: `docs/PROVA-DE-VIDA.md`.
