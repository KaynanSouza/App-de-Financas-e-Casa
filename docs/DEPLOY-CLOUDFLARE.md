# Deploy do PWA no Cloudflare Pages — preview e produção

> **Regra (AGENTS.md §8):** produção só com comando explícito do Kaynan. Preview só quando a etapa pedir, avisando antes.
> **Login, tokens e contas:** sempre pelo Kaynan. O agente nunca pede, lê nem grava token.
> Estado em 27/10/2026: **nenhum deploy foi feito ainda**; o projeto no Pages não existe.

Fontes consultadas em 27/10/2026:
<https://developers.cloudflare.com/pages/get-started/direct-upload/> ·
<https://developers.cloudflare.com/pages/configuration/headers/> ·
<https://developers.cloudflare.com/pages/configuration/redirects/> ·
<https://developers.cloudflare.com/pages/configuration/serving-pages/> ·
<https://developers.cloudflare.com/pages/configuration/preview-deployments/>

## Duas formas de publicar
1. **Integração Git:** o Pages conecta ao repositório do GitHub e faz o build a cada push (a branch de produção vira produção; as outras viram preview). É automático, mas o build roda nos servidores da Cloudflare e o repositório precisa ser autorizado (OAuth).
2. **Direct Upload (wrangler):** você gera `dist/` localmente e envia com `npx wrangler pages deploy`. Nada é publicado sem um comando seu, o build fica na sua máquina e não precisa conectar o GitHub.
3. **Atenção:** um projeto criado como Direct Upload **não pode** migrar para a integração Git depois (seria preciso criar outro projeto).
4. **Recomendação: Direct Upload.** Encaixa na regra "nada vai para produção sem comando explícito", é reproduzível, não dá acesso ao repositório e o custo é zero.

## Pré-requisitos (uma vez)
- Conta Cloudflare (gratuita), criada pelo Kaynan.
- `wrangler` já está no projeto como devDependency (`npx wrangler --version` → 4.154.0).
- Login, feito pelo Kaynan no terminal (abre o navegador):
  ```powershell
  npx wrangler login
  npx wrangler whoami
  ```
- Criar o projeto (nome sugerido: `financas-casa`; produção = `main`):
  ```powershell
  npx wrangler pages project create financas-casa --production-branch main
  ```

## Build
```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npx expo export --platform web
```
- `public/_headers` e `public/_redirects` são copiados para `dist/` pelo export.
- Conferir localmente, com o mesmo motor do Pages:
  ```powershell
  npx wrangler pages dev dist --port 8788 --compatibility-date=2026-10-23
  ```
  O log deve mostrar `Parsed N valid header rules` e nenhum `invalid redirect rule`.

## Preview (não produção)
```powershell
npx wrangler pages deploy dist --project-name financas-casa --branch preview
```
- URLs: `https://<hash>.financas-casa.pages.dev` (fixa por deploy) e `https://preview.financas-casa.pages.dev` (alias da branch, sempre o último deploy).
- **Previews são públicos por padrão.** Para restringir: Dashboard → Workers & Pages → projeto → Settings → General → *Enable access policy* (Cloudflare Access; isso protege só os previews). Como o app não envia dados, o risco de um preview público é só expor o código do front.
- O Pages adiciona `X-Robots-Tag: noindex` nas URLs de preview.

## Produção (somente com comando explícito do Kaynan)
```powershell
npx wrangler pages deploy dist --project-name financas-casa --branch main
```
- URL: `https://financas-casa.pages.dev`.
- Antes: os testes passam, o build de preview foi validado no iPhone e no Android, e o `SESSION.md` está atualizado.

## Verificação após o deploy
```powershell
curl.exe -sI https://preview.financas-casa.pages.dev/ | Select-String "cross-origin|x-content|referrer"
```
Esperado: `cross-origin-opener-policy: same-origin` e `cross-origin-embedder-policy: credentialless` (necessários para o `expo-sqlite` no web).

## Comportamentos verificados localmente (wrangler 4.154.0)
| Caso | Resultado |
|---|---|
| `/proto-sqlite.html` | 308 → `/proto-sqlite` (o Pages remove `.html`) |
| `/rota/inexistente` | 200 com `index.html` (SPA padrão, porque não há `404.html`) |
| `/* /index.html 200` em `_redirects` | **ignorado**: "Infinite loop detected" |
| `_headers` | aplicado em todas as rotas; cache imutável em `/_expo/static/*` |

## Rollback
Dashboard → projeto → Deployments → escolher um deploy anterior → *Rollback to this deployment*.
