# Fila de verificação no iPhone (D-049)

Não há iPhone para teste. Cada item "só no iPhone real" de uma etapa entra aqui, foi verificado no Playwright WebKit / Chrome quando possível e fica **pendente** até existir um iPhone (iOS 18 e 26). Ao executar: marcar `[x]`, data, versão do iOS e resultado; o que falhar vira tarefa.

| # | Etapa | Verificação no iPhone (Safari / instalado na Tela de Início) | Já verificado como aproximação | Status |
|---|---|---|---|---|
| 1 | E-01 | Preview abre nas 5 abas; rótulos e indicador da aba ativa; safe areas (notch e barra inferior) | Chrome desktop (coluna de 480 px, abas, tema) | [ ] pendente |
| 2 | E-01 | Tema automático segue o modo escuro do iOS; troca manual em Mais | Chrome desktop | [ ] pendente |
| 3 | E-01 | VoiceOver: nomes e estado das abas e do grupo "Tema" (`aria-checked`) | Árvore de acessibilidade do Chrome | [ ] pendente |
| 4 | E-01 | Tamanho de texto do iOS no máximo: nada cortado | — (o PWA usa px fixos; depende do zoom do Safari) | [ ] pendente |
