---
name: csv-bancos-br
description: Use ao importar/exportar CSV: extratos de bancos brasileiros (C-01..C-04), perfis por banco, golden files, e o CSV da lista de compras (L-02/L-08) com proteção contra CSV injection.
---

# csv-bancos-br — CSV de bancos brasileiros e da lista

## Objetivo
Transformar extratos em transações limpas, **sem duplicar**, sem travar a tela e sem nunca vazar dado real. A lógica atual dos Épicos 1 e 2 será portada (F-07); os golden files existentes são o contrato.

## Regras do backlog
- Limites: **10 MB** e **50 mil linhas**; validar memória em aparelho modesto.
- Importação inteira em **uma transação**; falhou, nada entra. Idempotência pela `UNIQUE` do SQLite (C-03). Desfazer em até 30 dias.
- O CSV original é descartado após importar (retenção opcional de até 30 dias, privada).
- Perfis prontos embutidos no app; o mapeamento manual fica no banco.

## Passo a passo do parser (core puro em `src/core`)
1. **Ler bytes**, não string, pelo adaptador de arquivos (`src/platform/files`).
2. **Codificação:** tentar UTF-8 estrito (com/sem BOM); se houver bytes inválidos, usar **ISO-8859-1/Windows-1252**. `TextDecoder('utf-8', { fatal: true })`; verificar o suporte a `windows-1252` no Hermes/RN na doc atual.
3. **Delimitador:** detectar entre `;`, `,`, `\t` contando ocorrências fora de aspas nas primeiras linhas. Bancos BR usam muito `;`.
4. **Aspas e quebras de linha** dentro de campo (RFC 4180), `\r\n` e `\n`.
5. **Detecção de perfil:** casar o cabeçalho normalizado (sem acento, minúsculo, trim) com os perfis; se nada casar → mapeamento manual (C-02).
6. **Datas** `dd/mm/aaaa` (e `dd/mm/aa` se o perfil disser) → `YYYY-MM-DD` em America/Sao_Paulo. Rejeitar datas impossíveis.
7. **Números** `1.234,56`, `-1.234,56`, `1234,56`, `(1.234,56)`, `R$ 1.234,56` → **centavos inteiros** por manipulação de string, **sem `parseFloat`**.
8. **Streaming:** processar em blocos; emitir progresso.
   - Web: **Web Worker**.
   - Nativo: **não há Web Worker** no RN. Processar em fatias com yield (`await` entre blocos) ou outra opção a avaliar (verificar a doc atual). Medir no OPPO.
9. Publicar `transaction.imported` no barramento (S-02/A-02 reagem).

## CSV da lista de compras (L-02/L-08)
- Exportar: UTF-8 (com BOM, para o Excel abrir com acento; validar), delimitador `;`, cabeçalho fixo com **versão do formato** primeiro, colunas do PBI. Só dados da lista. Avisar que o arquivo não é criptografado.
- **CSV injection:** campo que começa com `=`, `+`, `-`, `@` (e também `\t`, `\r`) recebe o prefixo `'` na exportação; a importação **remove** esse prefixo.
- Atenção: um valor negativo legítimo (`-1`) também começa com `-`. Aplicar o prefixo e removê-lo de forma simétrica, com teste de ida e volta.
- Importar: validar a versão; recusar versão desconhecida com mensagem amigável; resumo antes de aplicar; mesclar por id → `updated_at` mais recente → empate: "comprado" prevalece; sem id → nome normalizado.

## Golden files
- Em `tests/fixtures/csv/<banco>/<caso>.csv` + `<caso>.expected.json`.
- **Somente sintéticos ou anonimizados:** nomes de estabelecimentos genéricos, valores inventados, contas `****1234`. Nunca subir extrato real (o `.gitignore` bloqueia `*.csv` fora de `tests/fixtures`).
- Casos mínimos: UTF-8, ISO-8859-1, BOM, `;` e `,`, aspas com `;` dentro, linha em branco final, valor negativo, crédito/débito em colunas separadas, data inválida, arquivo vazio, cabeçalho desconhecido, 50 mil linhas (gerado no teste, não versionado).

## Checklist de qualidade
- [ ] Nenhum `parseFloat`/`Number()` em valor monetário.
- [ ] Importar o mesmo arquivo 2× não muda nada.
- [ ] Erro aponta linha e coluna, **sem** ecoar o conteúdo da linha (pode ser dado financeiro).
- [ ] Ida e volta do CSV da lista é idêntica, inclusive com `=`, `-`, `@`.
- [ ] Golden files passam em `npm test`.

## Exemplo mínimo
```ts
export function brlToCents(raw: string): number {
  const s = raw.replace(/R\$|\s/g, '');
  const neg = /^-|^\(.*\)$/.test(s);
  const digits = s.replace(/[()\-]/g, '').replace(/\./g, '');
  const m = /^(\d+)(?:,(\d{1,2}))?$/.exec(digits);
  if (!m) throw new Error('invalid amount');
  const cents = Number(m[1]) * 100 + Number((m[2] ?? '0').padEnd(2, '0'));
  return neg ? -cents : cents;
}
```
