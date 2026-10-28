---
name: security-review
description: Use antes de fechar qualquer PBI que toque dados, armazenamento, arquivos, notificações, logs, rede, headers ou autenticação; e para manter o modelo de ameaças STRIDE (F-03).
---

# security-review — Checklist de segurança (Android + PWA)

## Objetivo
Garantir que nenhum dado financeiro vaze do aparelho sem uma ação explícita do usuário, nas duas plataformas.

## Modelo de ameaças (STRIDE) — manter em TRD §4
| Ameaça | Cenário | Mitigação esperada |
|---|---|---|
| **S**poofing | Alguém com o celular desbloqueado abre o app | Bloqueio F-01 (biometria/PIN), timeout em 2º plano |
| **T**ampering | CSV/backup adulterado; APK falso como "atualização" | Validação estrita, AES-GCM autenticado, keystore guardada (`docs/ASSINATURA.md`) |
| **R**epudiation | (app de 1 usuário) | `event_log` local só de inserção (F-05) |
| **I**nformation disclosure | Aparelho perdido; backup em nuvem; app malicioso; storage do navegador; logs; screenshots | SQLCipher/criptografia web, `allowBackup=false`, mascaramento, sem logs sensíveis, FLAG_SECURE opcional |
| **D**enial of service | CSV gigante; quota do navegador | Limites 10 MB/50 mil linhas, `QuotaExceededError` tratado |
| **E**levation | Service worker comprometido; XSS | CSP restritiva, sem script de terceiros, SW versionado |

## Checklist por PBI
### Aparelho e armazenamento
- [ ] Android: banco SQLCipher (`cipher_version` checado), chave no Keystore (via lib), nunca no código ou em prefs.
- [ ] Android: `allowBackup="false"` no manifest gerado (o prebuild gera `true`!).
- [ ] PWA: nada sensível em `localStorage`/`sessionStorage`/cache do SW; banco protegido pela estratégia decidida (skill `sqlite-web-encrypted`).
- [ ] PWA: `navigator.storage.persist()` pedido e o backup reforçado (despejo possível).
- [ ] "Apagar dados" remove banco, chave, notificações e temporários.

### Autenticação local (F-01)
- [ ] PIN nunca em texto claro: KDF lenta com sal (ou derivação da chave do banco).
- [ ] 5 erros → espera crescente, com o contador persistido (resiste a reload/reinício).
- [ ] Biometria só libera a chave via sistema (Android); no PWA, o que existir de fato (WebAuthn incerto; verificar).
- [ ] Recentes/screenshot: opção de ocultar no Android; no web não existe (declarado na matriz).

### Arquivos e saídas
- [ ] Exportação F-04, CSV L-02 e `.ics` avisam que **não são criptografados**.
- [ ] Backup F-06 cifrado (AES-GCM, KDF com parâmetros no header).
- [ ] Import valida tamanho, formato e versão; erro **sem ecoar conteúdo**.
- [ ] CSV injection tratado na exportação e na importação.
- [ ] CSV original descartado após importar (ou retido ≤ 30 dias, privado).

### Logs e UI
- [ ] Logs (F-05) sem valores, descrições, contas ou nomes; contas mascaradas `****1234`.
- [ ] Mensagens de erro sem dado financeiro.
- [ ] Notificações respeitam "ocultar valores na tela bloqueada".

### Web/PWA
- [ ] CSP com `connect-src 'self'` (exceção S-01 só com decisão), `frame-ancestors 'none'`.
- [ ] COOP/COEP presentes; nenhuma origem externa.
- [ ] SW não cacheia nada além do shell estático; versão nova só com consentimento.
- [ ] Cloudflare Web Analytics **desligado**; sem beacon no HTML.

### Repositório e build
- [ ] Nada de keystore, `.env*`, token, CSV real ou dump no git (`git status`, `.gitignore`).
- [ ] Dependência nova revisada (licença, manutenção, permissões nativas que adiciona).
- [ ] `npm audit` revisado (8 alertas do template ainda pendentes).

## Passo a passo
1. Ler o diff do PBI e marcar quais seções acima se aplicam.
2. Atualizar a tabela STRIDE se surgir um vetor novo.
3. Registrar os riscos aceitos em `DECISIONS.md`.
4. Reportar ao Kaynan: o que foi verificado, o que **não** foi, e em qual plataforma.

## Armadilhas reais
- O manifest Android do prebuild vem com `allowBackup="true"`.
- O SQLCipher **não existe no web**; o `PRAGMA key` sem SQLCipher **não faz nada, em silêncio**.
- Preview `*.pages.dev` é **público** por padrão (só o código do front; nunca dados).
