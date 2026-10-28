---
name: sqlite-web-encrypted
description: Use ao mexer no banco do PWA (iPhone/web): expo-sqlite WASM, OPFS, COOP/COEP, persistência, criptografia na aplicação, chave derivada do PIN, bloqueio e limpeza. PBIs F-01, F-03 e F-06 no web.
---

# sqlite-web-encrypted — Banco do PWA

## Objetivo
Dar ao PWA o mesmo modelo de dados do Android, persistente e protegido, sabendo que **SQLCipher não existe no web**.

## Fatos verificados (Fase 1, Chrome 156 no Windows)
- O `expo-sqlite` web usa um WASM pré-compilado (sem FTS) num **Web Worker**, com VFS `AccessHandlePoolVFS` sobre **OPFS** (pasta `expo-sqlite`).
- Exige **`.wasm` no Metro** e os headers **COOP `same-origin` + COEP `credentialless`** (SharedArrayBuffer).
  - Dev: `metro.config.js` com `resolver.assetExts.push('wasm')` + `server.enhanceMiddleware` definindo os headers. O snippet **não aparece** na página da doc; a fonte é `node_modules/expo-sqlite/skills/expo-sqlite/references/web-and-config.md`.
  - Produção: `public/_headers` (já existe e foi verificado no Pages).
- Persistiu após recarregar; `navigator.storage.persisted()` = **false** (pode ser despejado).
- `withExclusiveTransactionAsync()` e `directory` customizado **não** funcionam no web.
- **Não testado:** Safari do iOS 18/26 (OPFS, SharedArrayBuffer, `persist()`).

## Estratégia de criptografia — **A DECIDIR na Descoberta (spike pendente)**
Nenhum spike foi feito. Candidatas a avaliar (verificar a documentação atual de cada uma):
1. **Criptografia por campo/registro na aplicação** (AES-GCM via WebCrypto) antes de gravar no SQLite. Simples; o esquema e os índices ficam visíveis; não dá para indexar campos cifrados.
2. **Banco em memória + snapshot cifrado:** exportar o banco serializado, cifrar com AES-GCM e gravar no OPFS. Protege tudo; custa memória e tempo de gravação (validar com cerca de 10 mil transações, meta C-06).
3. **VFS com criptografia por página** (ex.: build próprio do wa-sqlite). Mais robusto, mais complexo, depende de um build WASM próprio.
Critérios: desempenho com cerca de 10 mil transações, risco de corrupção, compatibilidade com o formato de backup (skill `backup-cross-platform`), tamanho do bundle e manutenção.

## Chave derivada do PIN (vale para qualquer estratégia)
- KDF: **PBKDF2-SHA-256 via WebCrypto** (nativo) ou Argon2id (exige lib/WASM; a WebCrypto não tem). Parâmetros (iterações/memória) **gravados junto** com o sal e versionados.
- A chave derivada fica **não-extraível** (`extractable: false`) e só em memória; nunca em `localStorage`.
- **Bloqueio:** ao ir para segundo plano após o tempo configurado (F-01), descartar a chave da memória → a tela de PIN volta.
- **Espera crescente** após 5 PINs errados, com o contador **persistido** (senão um reload zera).
- Lembrar: o PIN tem 6 dígitos = 10^6 combinações. A proteção depende da KDF lenta e da espera crescente; documentar isso no STRIDE.

## Persistência e limpeza
1. Chamar `navigator.storage.persist()` **após um gesto do usuário**, depois da instalação na Tela de Início (no Safari, estar instalado conta a favor). Mostrar o resultado na tela de diagnóstico.
2. Mostrar `navigator.storage.estimate()` (uso e cota) no diagnóstico.
3. Tratar `QuotaExceededError` com uma mensagem clara.
4. O Safari pode despejar dados de origens inativas: o **backup F-06 é obrigatório** e o lembrete aparece **dentro do app** (sem notificação).
5. "Apagar dados" (F-04): fechar o banco, remover a pasta do OPFS, apagar as chaves e metadados e desregistrar caches do service worker com dados (não deve haver).

## Checklist de qualidade
- [ ] `self.crossOriginIsolated === true` em produção (`*.pages.dev`).
- [ ] Teste de reload e de reabrir o PWA instalado: os dados continuam.
- [ ] Nada sensível em `localStorage`, `sessionStorage`, IndexedDB em texto claro ou cache do SW.
- [ ] Parâmetros da KDF versionados; teste com vetor conhecido.
- [ ] Memória: medir o pico com o volume-alvo em um iPhone real.

## Armadilhas
- Sem COOP/COEP, o `SharedArrayBuffer` some e o banco não abre.
- O COEP `credentialless` bloqueia recurso cross-origin sem CORP/CORS (o app não deve ter nenhum).
- O web app da Tela de Início tem armazenamento **separado** do Safari: os dados do navegador não aparecem no app instalado.
- Rodar sem `localhost`/HTTPS: o OPFS não funciona.

## Exemplo mínimo (KDF; confirmar parâmetros na Descoberta)
```ts
export async function deriveKey(pin: string, salt: Uint8Array, iterations: number) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
```
