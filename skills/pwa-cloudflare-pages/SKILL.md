---
name: pwa-cloudflare-pages
description: Use ao mexer no PWA (manifest, ícones, meta iOS, safe areas, service worker, offline, atualização) ou em _headers/_redirects, e ao publicar preview/produção no Cloudflare Pages.
---

# pwa-cloudflare-pages — PWA estático no Cloudflare Pages

## Objetivo
PWA instalável pelo Safari, que abre em **modo avião** após a primeira carga, publicado de forma reproduzível e só com autorização.

## Estado atual (Fase 1)
- Projeto Pages clássico `casa-em-dia` → `https://casa-em-dia-44l.pages.dev`; preview: `https://preview.casa-em-dia-44l.pages.dev`.
- **Ainda não há manifest nem service worker**: não abre offline, e a instalação vira um atalho simples.
- `public/_headers` e `public/_redirects` são copiados para `dist/` pelo `expo export`.
- Passo a passo completo em `docs/DEPLOY-CLOUDFLARE.md`.

## Passo a passo (PWA) — verificar a documentação atual do Expo (web/PWA) e do WebKit antes
1. **Manifest** (`public/manifest.webmanifest`): `name` "Casa em Dia", `short_name`, `start_url: "/"`, `display: "standalone"`, `theme_color`, `background_color`, ícones 192/512 + `maskable`. Linkar no HTML (ver como o Expo Router permite customizar o `<head>`: doc atual de `+html.tsx`).
2. **iOS:** `apple-touch-icon` (180×180), `apple-mobile-web-app-title`, status bar e `viewport-fit=cover`. Conferir o que o iOS 18/26 ainda exige.
3. **Safe areas:** `react-native-safe-area-context` e `env(safe-area-inset-*)` no web.
4. **Service worker** (verificar opções atuais: Workbox ou SW escrito à mão; avisar antes de adicionar dependência):
   - Pré-cache do shell: HTML, `/_expo/static/**`, `.wasm`, ícones e fontes **locais**.
   - **Versão** do cache = hash do build. Ao ativar, apagar caches antigos.
   - Estratégia: cache-first para assets com hash; network-first com fallback para HTML.
   - **Aviso de nova versão:** o SW novo fica em `waiting` → faixa "Nova versão disponível — atualizar", que envia `SKIP_WAITING` e recarrega. Nunca recarregar sem o usuário.
   - O SW **nunca** guarda dado financeiro nem respostas com dados.
5. Testar offline: DevTools → Offline e, no iPhone, modo avião abrindo pelo ícone.

## `_headers` (máx. 100 regras, 2.000 caracteres por linha)
- Manter: `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless` (expo-sqlite), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, cache imutável em `/_expo/static/*`.
- **CSP restritiva** (adicionar e testar no preview): `default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; worker-src 'self' blob:; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`. Verificar no preview o que o export do Expo exige (script inline? `unsafe-inline` de estilo do RN Web?). Ajustar com evidência, nunca afrouxar por chute.
- `Permissions-Policy` desligando o que não é usado (câmera só quando L-03 existir).
- **Zero rede no MVP** (D-032): sem exceção no `connect-src`. `_headers` final proposto em `TRD.md` §9. Instalação na Tela de Início é obrigatória no iPhone (D-002).
- `Cache-Control: no-cache` para `/sw.js` e `/manifest.webmanifest`.

## `_redirects`
- **Não** usar `/* /index.html 200`: o Pages **ignora** ("Infinite loop detected").
- Sem `404.html` no output, o Pages já serve `/` para rotas desconhecidas (SPA). O Expo gera `+not-found.html`, não `404.html`.

## Deploy
- Validar local: `npx wrangler pages dev dist --port 8788 --compatibility-date=<data>`.
- **Preview** (avisar antes): `npx wrangler pages deploy dist --project-name casa-em-dia --branch <branch>` → `https://<branch>.casa-em-dia-44l.pages.dev` (públicos, com `noindex`).
- **Produção: SÓ com comando explícito do Kaynan** (`--branch main`).
- Login: sempre feito pelo Kaynan (`npx wrangler login`). Nunca pedir nem ler token.

## Analytics / telemetria
- O Cloudflare **Web Analytics** pode injetar um beacon de terceiros: conferir no Dashboard (projeto → Settings / Web Analytics) que está **desligado**. Verificar com `curl -s <url> | grep -i beacon` após cada deploy.
- Nenhuma lib de analytics, crash reporting ou fonte remota no bundle (`grep -o 'https\?://' dist -r`).

## Checklist de qualidade
- [ ] Abre em modo avião (iPhone instalado + Android Chrome).
- [ ] Headers presentes no preview (`curl -sI`), `crossOriginIsolated` true.
- [ ] Nenhuma URL externa; nenhum beacon.
- [ ] Faixa de nova versão testada (deploy A → deploy B).

## Armadilhas
- O wrangler ≥ 4.151 desvia `pages project create` para o Workers; o projeto já existe, então **não** use `--force` de novo.
- HTTPS de projeto novo pode levar cerca de 70 s (`SEC_E_ILLEGAL_MESSAGE`).
- PWA preso em cache antigo: sem versionamento do SW, o usuário nunca atualiza.
- Antes da produção: decidir Pages clássico × Workers (ADR-006).
