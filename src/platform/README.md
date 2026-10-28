# src/platform

Único lugar onde código dependente de plataforma pode existir. **Nenhum import de módulo nativo fora desta pasta.**

Padrão por capacidade (`<cap>` = ex.: `secure-key`, `notifications`, `file-share`):

```
src/platform/<cap>/index.ts         # interface (porta) + tipos; sem implementação
src/platform/<cap>/<cap>.native.ts  # adaptador Android (Metro resolve .native.ts)
src/platform/<cap>/<cap>.web.ts     # adaptador iPhone/PWA (Metro resolve .web.ts)
```

Toda capacidade nova precisa de linha em `docs/matriz-paridade.md`, inclusive a degradação explícita quando não existir em uma plataforma.
Nenhuma capacidade criada nesta etapa.
