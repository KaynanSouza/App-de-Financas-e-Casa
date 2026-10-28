---
name: alerts-android-and-ios
description: Use ao implementar lembretes de contas/assinaturas/backup: agendamento local no Android, reagendamento, canais, alarmes exatos, diagnóstico, e a alternativa do iPhone/PWA. PBIs A-01, A-03, A-04, A-05, S-04, F-06 (lembrete).
---

# alerts-android-and-ios — Lembretes nas duas plataformas

## Objetivo
Lembretes que **tocam no horário** no Android, mesmo com o app fechado e sem rede, e uma alternativa **honesta e explícita** no iPhone.

## Princípios (backlog)
- **Reagendar em vez de confiar em timers.** O agendamento é reconstruído: ao abrir o app, ao criar/editar/pagar, ao terminar uma importação, após reiniciar o aparelho e após restaurar um backup.
- **Idempotência:** id da notificação = hash determinístico de `instance_id + rule`. Reagendar substitui, nunca duplica.
- **Janela rolante:** agendar só os próximos N dias (padrão 60) e até um limite de pendentes.
- Tabela `notification_schedule(instance_id, rule, fire_at, state)`; o estado "vencida" é calculado pela data, sem job.
- Horários em UTC no banco; regras de exibição no fuso do aparelho; datas contábeis em America/Sao_Paulo.

## Android (verificar a documentação atual da lib de notificações antes de usar)
1. **Permissão de notificação** (Android 13+): pedir só no primeiro uso do módulo, depois de explicar.
2. **Alarmes exatos** (Android 12+): verificar na doc da lib e do Android se é preciso `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` e como abrir a tela de permissão. Sem a permissão: degradar para alarme inexato e avisar.
3. **Canais separados:** `bills`, `subscriptions`, `backup` (A-03).
4. **Reboot:** confirmar no aparelho real se a lib reagenda após reiniciar; senão, reagendar ao abrir (sempre).
5. **Ações rápidas** (A-05): "Paguei", "Lembrar amanhã". Antes de aplicar, conferir o estado no banco (idempotente; sem HMAC, não há servidor).
6. **Privacidade na tela bloqueada:** padrão = só o nome da conta (A-03).
7. **Bateria/fabricante:** a ColorOS (OPPO, aparelho de teste) é agressiva. Passo a passo por fabricante na tela de diagnóstico.

## Tela "Meus alertas estão funcionando?" (A-03)
Checklist ao vivo: notificações permitidas, alarmes exatos, otimização de bateria, Não Perturbe, canais ativos, próximo alerta agendado, botão "notificação de teste em 1 minuto". Aviso na tela inicial se alguma permissão for revogada.

## iPhone/PWA — estratégia **DECIDIDA (D-001)**: faixa no app + badge (se suportado) + exportação `.ics`; Web Push descartado (exige servidor). Regras padrão (D-031): 3 dias, 1 dia e no dia, às 9h; silêncio 22h–7h; atraso 1×/dia por 3 dias; máx. 5/dia; só nome e data. Pendente no E-02: importação de `VALARM` no iOS 18/26.
Fato (doc do WebKit): web apps da Tela de Início (iOS 16.4+) só notificam por **Web Push**, que passa pela Apple e **exige um servidor** enviando o push. **Não há notificação local agendada.** Um servidor de push contraria o local-first, então não usar sem decisão explícita do Kaynan.
Candidatas (declarar a escolhida na matriz de paridade):
1. **Avisos dentro do app:** ao abrir, uma faixa "vence hoje/amanhã/atrasadas" + badge (verificar o suporte da Badging API no iOS).
2. **Exportar `.ics`:** gerar arquivo de calendário com os vencimentos (com alarmes `VALARM`) para importar no Calendário do iPhone; o lembrete passa a ser do Calendário. Atenção: o feed ICS saiu do escopo do backlog; um **arquivo** exportado manualmente é outra coisa, mas precisa da confirmação do Kaynan. O arquivo não é criptografado: avisar.
3. Os dois combinados.

## Testes
- Unit em `src/core`: gerar ocorrências (último dia útil, dia 31 → último dia do mês), janela rolante, ids determinísticos, janela de silêncio (22h–7h), atraso máx. 1/dia por 3 dias, digest.
- **Relógio simulado** (fake `Clock` de `platform-adapters`) e **mudança de fuso** (rodar o mesmo cenário em `America/Sao_Paulo` e em outro fuso; horário de verão histórico).
- Adaptador fake de notificações: verificar que reagendar 2× gera o mesmo conjunto.
- Manual (aparelho real, 14 dias, ≥ 2 fabricantes): dispara no horário com o app fechado, após reboot e após restaurar backup.

## Checklist de qualidade
- [ ] Reagendar é idempotente (teste).
- [ ] Pagar cancela os pendentes; notificação antiga não causa efeito duplicado.
- [ ] Nenhum valor na tela bloqueada sem opção do usuário.
- [ ] Comportamento no iPhone declarado e comunicado ao usuário na interface.

## Armadilhas
- Confiar em `setTimeout` ou em tarefa em segundo plano para lembrar.
- O limite de 64 pendentes era do iOS **nativo**; no PWA ele não existe porque não há agendamento local.
- Agendar centenas de alarmes de uma vez: respeitar a janela.

## Exemplo mínimo (id determinístico, core puro)
```ts
export function notificationId(instanceId: string, rule: string): string {
  let h = 2166136261; // FNV-1a 32-bit
  for (const c of `${instanceId}|${rule}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return `n_${(h >>> 0).toString(16)}`;
}
```
