---
name: backup-cross-platform
description: Use ao implementar/alterar backup e restauração (F-06), exportação (F-04) ou qualquer formato de arquivo que precise abrir nas duas plataformas (Android ↔ iPhone/PWA).
---

# backup-cross-platform — Um formato de backup para as duas plataformas

## Objetivo
**Um único formato**, versionado e criptografado, que um aparelho Android restaura a partir de um backup do iPhone e vice-versa. É o único mecanismo contra perda do aparelho e contra o despejo do armazenamento no Safari.

## Regras (backlog F-06)
- Um arquivo, cifrado com **senha escolhida pelo usuário**; sem a senha não abre, e **não há recuperação** (avisar).
- Restaurar: pedir arquivo + senha → validar **integridade** e **versão do esquema** → confirmação → substituir tudo → **reagendar todas as notificações** (Android).
- Lembrete mensal (Android: notificação; iPhone: aviso dentro do app) e a data do último backup nas configurações.
- **Teste automatizado de ida e volta** e teste em outro aparelho real antes do beta.

## Formato (rascunho; fechar no TRD §10)
```
magic        "CEDBKP"            6 bytes
formatVer    uint16               versão do FORMATO do arquivo
headerLen    uint32
header       JSON UTF-8 (não cifrado, mas autenticado como AAD):
  { kdf: {alg:"PBKDF2-SHA256"|"Argon2id", salt, iterations|memKiB/timeCost/parallelism},
    cipher: {alg:"AES-256-GCM", iv},
    schemaVersion, createdAt (UTC), appVersion, platform:"android"|"web" }
ciphertext   AES-GCM( payload ), com AAD = magic+formatVer+header
```
- **Payload = dump lógico neutro** (JSON ou CSV por tabela, comprimido), **não** o arquivo `.db` cru. O `.db` do Android é SQLCipher e o do web é outro formato; um dump lógico restaura nos dois.
- Dinheiro em centavos inteiros; datas em ISO; ids UUID preservados.
- Configurações incluídas; **chaves do banco e PIN NUNCA** entram no backup.

## KDF — decisão pendente (TRD)
- **WebCrypto não tem Argon2id.** Opções: (a) PBKDF2-SHA-256 com muitas iterações (nativo nas duas plataformas, sem dependência); (b) Argon2id via WASM/lib nas duas plataformas (exige justificar a dependência). Verificar a documentação atual e as recomendações vigentes (OWASP) para os parâmetros.
- Os parâmetros ficam no header: aumentar as iterações no futuro não quebra backups antigos.
- No Android nativo é preciso uma implementação de AES-GCM/PBKDF2 compatível. Verificar a doc atual (WebCrypto no Hermes/Expo, ou uma lib), avisando antes de adicionar dependência.

## Passo a passo
1. Core puro: `serializeBackup(dump, password, params)` / `parseBackup(bytes, password)`. A cripto é injetada por uma porta (`src/platform/crypto`).
2. Antes de restaurar: decifrar → validar `formatVer` conhecida → validar `schemaVersion` (≤ atual; migrar se for menor; recusar se for maior: "atualize o app").
3. Restaurar em **uma transação**; falhou, nada muda.
4. Salvar/compartilhar via `src/platform/files`:
   - Android: seletor/compartilhar do sistema (Drive, e-mail, outro aparelho).
   - PWA: Web Share com arquivo (verificar o suporte no iOS 18/26) ou download; abrir com `<input type="file">`.
5. Mostrar o tamanho do arquivo; medir com cerca de 10 mil transações.

## Testes
- Ida e volta: `parse(serialize(x)) ≡ x` (teste unitário com dados sintéticos).
- Senha errada → erro específico, sem vazar conteúdo.
- Arquivo truncado ou com 1 byte alterado → falha de autenticação (GCM).
- **Vetores fixos:** um backup gerado no web restaura no Android e vice-versa; guardar 1 arquivo sintético por `formatVer` em `tests/fixtures/backup/` (senha de teste no próprio teste).
- Manual: backup no OPPO → restaurar no PWA do iPhone e o inverso.

## Checklist de qualidade
- [ ] Nada de `.db` cru no backup.
- [ ] Header autenticado (AAD).
- [ ] IV aleatório de 12 bytes por backup; sal aleatório ≥ 16 bytes.
- [ ] Aviso de "sem recuperação de senha" e de "arquivo fora do app".
- [ ] Notificações reagendadas após restaurar.

## Armadilhas
- Reutilizar IV com a mesma chave quebra o AES-GCM.
- Mudar o esquema sem subir `schemaVersion` ou sem migração para restaurar backup antigo.
- Backup grande demais para a memória do iPhone: processar em blocos se necessário.
- Exportação F-04 (JSON/CSV) **não** é backup: é cópia sem criptografia, com aviso.
