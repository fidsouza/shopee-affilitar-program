# Implementation Plan: Home Page Simplification and Admin Route Rename

**Branch**: `004-home-page-update` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-home-page-update/spec.md`

## Summary

Simplificar a home page para exibir apenas "Página em Construção" sem informações do sistema, renomear a rota administrativa de `/admin` para `/parametrizacao`, atualizar o emoji/favicon para 🏷️ em todas as páginas, e documentar as mudanças no CLAUDE.md.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui
**Storage**: N/A (não há mudanças de dados)
**Testing**: Manual testing via navegador
**Target Platform**: Web (Vercel)
**Project Type**: Web application (frontend only para esta feature)
**Performance Goals**: Página carrega em < 1 segundo
**Constraints**: Manter compatibilidade com estrutura existente
**Scale/Scope**: 4 arquivos modificados, 1 diretório renomeado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O arquivo constitution.md está em formato template (não preenchido). Não há gates específicos definidos para este projeto. Prosseguindo com boas práticas padrão:

- ✅ Mudanças são simples e focadas
- ✅ Não introduz novas dependências
- ✅ Não altera modelo de dados
- ✅ Mantém estrutura existente do projeto

## Project Structure

### Documentation (this feature)

```text
specs/004-home-page-update/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data changes)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/src/app/
├── layout.tsx              # MODIFICAR: Atualizar emoji 🏷️ no metadata
├── page.tsx                # MODIFICAR: Simplificar para "Em Construção"
├── parametrizacao/         # RENOMEAR de admin/
│   ├── layout.tsx          # Manter (apenas mover)
│   ├── page.tsx            # Manter (apenas mover)
│   ├── pixels/page.tsx     # Manter (apenas mover)
│   ├── products/page.tsx   # Manter (apenas mover)
│   └── whatsapp/page.tsx   # Manter (apenas mover)
├── t/[slug]/               # Não modificar
├── w/[slug]/               # Não modificar
└── api/                    # Não modificar
```

**Structure Decision**: Renomear diretório `admin/` para `parametrizacao/`. O Next.js App Router usa file-system routing, então a mudança de diretório automaticamente muda a rota.

## Implementation Steps

### Step 1: Renomear diretório admin para parametrizacao

```bash
mv frontend/src/app/admin frontend/src/app/parametrizacao
```

Isso automaticamente:
- Muda `/admin` → `/parametrizacao`
- Muda `/admin/products` → `/parametrizacao/products`
- Muda `/admin/pixels` → `/parametrizacao/pixels`
- Muda `/admin/whatsapp` → `/parametrizacao/whatsapp`

### Step 2: Simplificar home page

Modificar `frontend/src/app/page.tsx`:
- Remover todos os textos sobre o sistema
- Remover links para admin e página de transição
- Exibir apenas mensagem "Página em Construção"
- Manter estilo minimalista com Tailwind

### Step 3: Atualizar emoji/favicon

Modificar `frontend/src/app/layout.tsx`:
- Adicionar emoji 🏷️ no title do metadata
- Configurar favicon via emoji (ou manter favicon.ico e atualizar title)

### Step 4: Atualizar CLAUDE.md

Documentar:
- Home page agora é "Página em Construção"
- Rota administrativa mudou de `/admin` para `/parametrizacao`
- Estrutura de diretórios atualizada

## Complexity Tracking

Nenhuma violação de complexidade. A implementação é direta:
- 1 renomeação de diretório
- 2 arquivos modificados (page.tsx, layout.tsx)
- 1 arquivo de documentação atualizado (CLAUDE.md)

## Risk Assessment

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Links internos quebrados | Baixa | Médio | Verificar referências a /admin no código |
| Cache de browser mostrando conteúdo antigo | Baixa | Baixo | Hard refresh após deploy |
| Bookmarks antigos de /admin | Média | Baixo | Documentar mudança (usuários devem atualizar) |

## Verification Checklist

- [ ] Acessar `/` mostra apenas "Página em Construção"
- [ ] Acessar `/` não mostra links para admin
- [ ] Acessar `/admin` retorna 404
- [ ] Acessar `/parametrizacao` mostra dashboard
- [ ] Acessar `/parametrizacao/products` funciona
- [ ] Acessar `/parametrizacao/pixels` funciona
- [ ] Acessar `/parametrizacao/whatsapp` funciona
- [ ] Emoji 🏷️ aparece no title/tab do navegador
- [ ] CLAUDE.md está atualizado
- [ ] Build (`yarn build`) passa sem erros
