---
name: a11y-expo
description: Use ao criar ou revisar qualquer tela/componente (nativo e web): rótulos, papéis, foco, leitores de tela, contraste, alvos de toque, fonte escalável, gráficos, valores em reais e movimento.
---

# a11y-expo — Acessibilidade em React Native + web

## Objetivo
Toda tela utilizável com **TalkBack** (Android) e **VoiceOver** (Safari/iPhone), em conformidade com o **WCAG 2.2 AA**. Faz parte da definição de pronto.

## Passo a passo (verificar a documentação atual do React Native / RN Web para cada prop)
1. **Papel e rótulo:** todo elemento interativo tem `accessibilityRole` (ou `role`) e `accessibilityLabel` (ou `aria-label`) em português claro. Verificar na doc atual qual forma o RN 0.88 recomenda e como o RN Web mapeia para `aria-*`.
2. **Estado:** `accessibilityState` (`checked`, `disabled`, `selected`, `expanded`). Ex.: item da lista "comprado" = `checked: true`.
3. **Dicas:** `accessibilityHint` só quando a ação não é óbvia.
4. **Ordem de foco:** segue a ordem visual; agrupar (`accessible`) card com rótulo único; no web, testar com Tab/Shift+Tab, foco visível e sem armadilha de foco em modais.
5. **Contraste:** texto ≥ **4,5:1**, texto grande e ícones ≥ **3:1**, nos temas claro e escuro.
6. **Alvos de toque:** mínimo **44×44 pt** (o WCAG 2.2 AA exige 24×24 CSS px; adotamos 44 como padrão), com `hitSlop` quando o visual for menor.
7. **Fonte escalável:** manter `allowFontScaling` (padrão true); testar em 200%; o layout quebra linha, não corta. `maxFontSizeMultiplier` só com justificativa.
8. **Não depender só de cor:** "vencida" = cor **+ ícone + texto**; gráficos com rótulos ou padrões.
9. **Gráficos:** alternativa textual (resumo + tabela acessível): "Mercado: R$ 1.234,56, 32% do mês".
10. **Valores em reais:** exibir com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` a partir de centavos. O rótulo lido deve soar natural ("mil duzentos e trinta e quatro reais e cinquenta e seis centavos"); testar como o TalkBack e o VoiceOver leem "R$ 1.234,56" e "-R$ 50,00" ("menos"). Valores ocultos (privacidade) leem "valor oculto".
11. **Reduzir movimento:** respeitar `AccessibilityInfo.isReduceMotionEnabled()` / `prefers-reduced-motion`; o Reanimated tem suporte próprio (verificar a doc).
12. **Anúncios:** resultado de ações longas (importação concluída, backup salvo) via `AccessibilityInfo.announceForAccessibility` (nativo) / região `aria-live` (web).
13. **Formulários:** label visível associado, erro em texto junto ao campo, sem só borda vermelha; teclado numérico para valores e PIN.

## Checklist de qualidade (por tela)
- [ ] Percorrida com TalkBack no OPPO e com VoiceOver no iPhone (PWA).
- [ ] Teclado no web: tudo alcançável e com foco visível.
- [ ] Contraste conferido (nos dois temas).
- [ ] Fonte 200% sem corte.
- [ ] Nenhuma informação só por cor; gráficos com texto.
- [ ] Testes com `@testing-library/react-native` usando `getByRole`/`getByLabelText` (instalar só com aprovação; ver `testing-strategy`).

## Armadilhas
- `TouchableOpacity`/`Pressable` sem `accessibilityRole="button"`.
- Ícone sem rótulo ("botão" mudo).
- Rótulo repetindo o papel ("botão salvar botão").
- Modal sem prender e devolver o foco.
- Toast que some antes de o leitor de tela anunciar.
- A tela de PIN deve anunciar quantos dígitos foram digitados, nunca os dígitos.

## Exemplo mínimo
```tsx
<Pressable
  accessibilityRole="checkbox"
  accessibilityLabel={`${item.name}, ${item.qty} ${item.unit}`}
  accessibilityState={{ checked: item.checked }}
  hitSlop={8}
  onPress={toggle}
>
  <Text>{item.name}</Text>
</Pressable>
```
