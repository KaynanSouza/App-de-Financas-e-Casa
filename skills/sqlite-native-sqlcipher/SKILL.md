---
name: sqlite-native-sqlcipher
description: Use ao criar/alterar o banco no Android: abrir com SQLCipher, guardar a chave, escrever migrações, transações, tabelas novas (ids, dinheiro, exclusão lógica). PBIs F-03, F-07 e todos os módulos.
---

# sqlite-native-sqlcipher — Banco criptografado no Android

## Objetivo
SQLite **inteiro** criptografado (SQLCipher) no armazenamento interno do app, com a chave protegida pelo sistema, migrações versionadas e dados consistentes.

## Fatos verificados (Fase 1, expo-sqlite ~58.0.14)
- O SQLite nativo funcionou no OPPO (3.53.3): create/insert/select e persistência após `force-stop`.
- SQLCipher: config plugin `["expo-sqlite", { "useSQLCipher": true }]`, **só Android/iOS/macOS**, **não** em Expo Go nem no web. Exige um build nativo novo.
- Fazer `PRAGMA key` **logo após abrir**, antes de qualquer leitura ou migração. Se o binário não tiver SQLCipher, o `PRAGMA key` **não faz nada, em silêncio**: confira antes `PRAGMA cipher_version`.
- O `PRAGMA` não aceita parâmetro com bind: valide/escape a chave (ex.: chave em hex no formato `x'...'` do SQLCipher; verificar a doc do SQLCipher).
- Ativar o SQLCipher **não** criptografa um banco já existente em texto claro: precisa de migração explícita.
- `withExclusiveTransactionAsync()` abre **outra conexão**, que **não** herda a chave: não usar sem inicializar a conexão; testar.

## Passo a passo
1. Verificar a **documentação atual** do `expo-sqlite` (plugin, API) e do `expo-secure-store` (ou equivalente) antes de codar.
2. **Chave:** gerar 32 bytes aleatórios no primeiro uso → guardar via `src/platform/secure-key` (Android Keystore através da lib escolhida; verificar se ela suporta exigir biometria/PIN para liberar, o F-01). Nunca em preferências, código, log ou backup do sistema.
3. **Abrir:** `openDatabaseAsync` → `PRAGMA cipher_version` (falhar se vazio) → `PRAGMA key` → `PRAGMA foreign_keys = ON` → migrações.
4. **Migrações:** tabela `schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT)`; uma função por versão, em ordem, cada uma dentro de **uma transação**. Nunca editar uma migração já publicada.
5. **Transações:** toda operação de várias linhas (importação C-01, mesclagem L-08, restauração F-06) roda em uma única transação. Falhou, desfaz tudo.
6. **Modelagem:**
   - ids: **UUID v4 gerado no aparelho** (TEXT), principalmente nas listas (L-01/L-08).
   - Dinheiro: **INTEGER em centavos** (`amount_cents`), nunca REAL.
   - Datas contábeis: `TEXT` `YYYY-MM-DD` no fuso America/Sao_Paulo; instantes em ISO UTC.
   - Exclusão lógica: `deleted_at TEXT NULL`; consultas filtram `deleted_at IS NULL`.
   - `updated_at` em toda tabela mesclável.
   - Unicidade de dedupe (C-03) como `UNIQUE` no SQLite.
7. **Desligar o backup do Android:** `allowBackup=false` por config plugin (o prebuild gera `true`).

## Checklist de qualidade
- [ ] `cipher_version` checado; o teste falha se o binário não tiver SQLCipher.
- [ ] Abrir o arquivo `.db` sem a chave (ex.: `sqlite3` no PC, depois de `adb pull` em build debug) falha.
- [ ] Migração do zero e incremental testadas.
- [ ] Nenhum REAL para dinheiro; nenhum id autoincrement em tabela mesclável.
- [ ] A chave não aparece em log, erro ou exportação.
- [ ] `allowBackup="false"` no manifest gerado.

## Armadilhas
- O build nativo no Windows exige CMake 4.1.2 (ver `expo-app`).
- Trocar o `useSQLCipher` exige rebuild; não muda por OTA.
- Apagar dados (F-04) = fechar o banco, apagar o arquivo **e** a chave **e** as notificações agendadas.
- Testes com dados reais: proibido. Use fixtures sintéticas.

## Exemplo mínimo (esboço; confirmar a API na doc atual)
```ts
// src/platform/db/db.native.ts
import * as SQLite from 'expo-sqlite';
export async function openEncrypted(name: string, keyHex: string) {
  if (!/^[0-9a-f]{64}$/.test(keyHex)) throw new Error('invalid key format');
  const db = await SQLite.openDatabaseAsync(name);
  const v = await db.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version');
  if (!v?.cipher_version) throw new Error('SQLCipher not available in this build');
  await db.execAsync(`PRAGMA key = "x'${keyHex}'";`);
  await db.execAsync('PRAGMA foreign_keys = ON;');
  return db;
}
```
