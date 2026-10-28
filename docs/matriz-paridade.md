# Matriz de paridade — Android x iPhone/PWA

> Estado: **FINAL da Fase 2 (28/10/2026)**, validada pelo Kaynan no Bloco 0 e atualizada com os Blocos A–G. Itens "?" são verificados no spike E-02 (Fase 3) ou no sprint indicado; ao confirmar, atualizar esta matriz no mesmo commit.
> Regra (AGENTS.md §5, D-005): toda feature declara o comportamento nas duas plataformas; capacidade ausente = **degradação explícita**.
> Android = app nativo (APK). iPhone = PWA instalado na Tela de Início (Safari, iOS 18/26). "Testar" = depende de verificação em aparelho real.

> **Aviso (D-049, 28/10/2026):** não há iPhone para teste. Tudo que diz "iPhone" abaixo é o comportamento **projetado** e testado no WebKit (Playwright); a validação em iPhone real está adiada. Itens "?" que dependem do Safari do iOS ficam abertos até lá.

## Legenda
**=** igual · **≈** degradado (limitação descrita) · **✕** ausente (alternativa descrita) · **?** a verificar

## MVP

| PBI | Android (nativo) | iPhone (PWA) | Paridade | Observação / degradação |
|---|---|---|---|---|
| F-01 Bloqueio | Biometria + PIN 6 dígitos; trava em 1 min; chave liberada pelo Keystore; print/Recentes **bloqueados por padrão** (desligável) | PIN 6 dígitos (KDF + espera crescente); trava em 1 min; sem bloqueio de print/Recentes → modo privacidade | ≈ | Passkey/Face ID avaliada no E-02 → R2 (D-003, D-029) |
| F-03 Criptografia | SQLCipher (AES-256), chave no Keystore, `allowBackup=false` | Criptografia na aplicação (estratégia do spike E-02), chave derivada do PIN | ≈ ? | Provisória até a Fase 3 (D-004) |
| F-04 Exportar/apagar | JSON+CSV pelo Compartilhar; apagar (PIN + "APAGAR") banco, chave, notificações, temporários, preferências | JSON+CSV por Web Share (com arquivos) ou download; apagar OPFS, chaves, caches e registro do SW, storage | = ? | Web Share no modo standalone: testar (D-035) |
| F-05 Log local | `event_log` no banco; compartilhar log | Igual | = | — |
| F-06 Backup | Formato único (D-008); salvar pelo Compartilhar; lembrete **mensal** (dia 1, 20h) por notificação | Formato único; Web Share/download; abrir por seletor; lembrete **semanal** dentro do app; instalação obrigatória + `persist()` | ≈ | Restauração cruzada nos dois sentidos; KDF no E-02 (D-039) |
| F-07 Núcleo (porte) | Core TS rodando no app | Mesmo core | = | Porte com triagem do `dia-a-dia` (D-045); o código antigo era só Android: toda parte de plataforma ganha adaptador web |
| F-08 Onboarding e ajuda | 4 passos; PIN + biometria; lembrete de backup mensal; ajuda para instalar o APK | Passo 0 "Instalar na Tela de Início" (bloqueia até instalar); PIN; backup semanal | ≈ | D-002, D-023, D-044 |
| C-01 Importar CSV | Seletor do sistema + "Abrir com"; parsing em fatias (sem Web Worker); notificação ao concluir em 2º plano | Só seletor dentro do app; parsing em Web Worker; sem aviso em 2º plano (a tela mostra o progresso) | ≈ | Limite 10 MB / 50 mil linhas: medir memória no iPhone |
| C-02..C-05 Perfis, dedupe, regras, correção | Core | Core | = | Perfis novos: APK novo × deploy; 6 bancos (D-030) |
| C-08 Lançamento manual (D-050) | Core + banco | Core + banco | = | Conta "Carteira (dinheiro)" padrão; sugestão de junção na importação |
| C-06 Dashboard | SQL no SQLite nativo | SQL no SQLite WASM | = ? | Meta < 2 s com ~10 mil transações nos dois |
| A-01 Contas e recorrência | Core + banco | Core + banco | = | — |
| A-03 Permissões/confiabilidade | Permissões, alarmes exatos, bateria por fabricante, canais, tela "Meus alertas…" | ✕ Sem notificações: a tela explica o modelo do iPhone (avisos no app + `.ics`) e mostra a data do último `.ics` exportado | ✕ | D-001 |
| A-04 Motor de lembretes | Notificações locais agendadas, janela rolante, reagendamento | ≈ Faixa de vencimentos ao abrir + badge (?) + `.ics` com `VALARM` | ≈ ? | Alarmes do `.ics` e Badging API: testar |
| A-05 Ações rápidas | "Paguei"/"Lembrar amanhã" na notificação | ✕ Ações ficam na faixa/lista dentro do app | ✕ | — |
| S-01 Assinaturas | Core + banco; cotação **manual** | Igual | = | Sem rede no MVP (D-032) |
| S-02 Detecção no CSV | Core, reage a `transaction.imported` | Igual | = | — |
| S-03 Dashboard de custo | Igual | Igual | = | — |
| S-04 Lembretes de renovação | Notificação com "Vou manter"/"Cancelei" | ≈ Faixa no app + `.ics`; ações dentro do app | ≈ | D-001 |
| L-01 Listas | Offline | Offline (requer service worker) | = ? | SW ainda não existe |
| L-02 Exportar CSV da lista | Compartilhar nativo | Web Share com arquivo / download | = ? | Testar no standalone |
| L-03 Catálogo | EAN pela câmera (`expo-camera`) | EAN **digitado** (sem `BarcodeDetector` no Safari) | ≈ ? | Spike testa `expo-camera` web no Safari (D-033) |
| L-04 Registro de preço | Igual | Igual | = | — |
| L-05 Histórico/comparativo | Igual | Igual | = | Gráficos próprios com react-native-svg (D-021) |
| L-08 Importar e mesclar CSV | "Abrir com" (WhatsApp/e-mail/Drive) + seletor | ✕ "Abrir com" não existe; só o seletor dentro do app | ≈ | Instruir "Salvar em Arquivos" e depois importar |

## R2 / R3
| PBI | Android | iPhone (PWA) | Observação |
|---|---|---|---|
| A-02 Recorrentes no CSV | Core | Core | = |
| X-01 Orçamento por categoria (R2) | Aviso por notificação | Aviso na faixa do app | ≈ |
| Feriados no "dia útil" (R2) | Core | Core | = |
| C-07 Modelo leve | Core (TF-IDF + regressão) | Core | Medir memória no iPhone |
| S-05 Reajuste | Notificação | Faixa no app | ≈ |
| Passkey/Face ID (D-003) | N/A (biometria nativa) | WebAuthn + PRF se o E-02 aprovar | R2 |
| L-07 Cupom NFC-e | Câmera + consulta SEFAZ (rede) | ✕ CORS bloqueia a SEFAZ sem servidor | R3; inviável no PWA sem proxy |
| X-02 Metas de economia (R3) | Core | Core | = |
| X-03 Divisão de despesas (R3) | Troca por CSV (Compartilhar / "Abrir com") | Troca por CSV (Web Share / seletor) | ≈ (como L-02/L-08) |

## Capacidades transversais
| Capacidade | Android | iPhone (PWA) |
|---|---|---|
| Atualização | APK novo enviado pelo Kaynan (D-007) | Automática no próximo acesso com rede (SW com aviso de nova versão) |
| Persistência | Garantida até desinstalar | Pode ser despejada → instalação obrigatória + `persist()` + backup semanal (D-002) |
| Vibração / háptico | Sim | ✕ |
| Uso offline | Sempre | Após a 1ª carga, com SW |

## Telas exclusivas por plataforma
| Tela | Android | iPhone |
|---|---|---|
| Instalar na Tela de Início | — | ✔ (bloqueia até instalar, D-002) |
| Meus alertas estão funcionando? (A-03) | ✔ | — |
| Lembretes no iPhone (`.ics`, D-001) | — | ✔ |
| Leitor de EAN | câmera | digitação |
