# src/modules

Um módulo por épico de produto, com código e tabelas próprios. Módulos conversam por eventos (`src/core/events`), nunca por import direto entre si.
Lógica pura vai para `src/core`; acesso a plataforma só via `src/platform`.
