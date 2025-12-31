# Feature Specification: Home Page Simplification and Admin Route Rename

**Feature Branch**: `004-home-page-update`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User description: "Modificar home page para mostrar apenas página em construção e renomear rota /admin para /parametrizacao. Atualizar CLAUDE.md com a especificação."

## Clarifications

### Session 2025-12-31

- Q: Qual emoji deve ser usado no header/favicon da página? → A: 🏷️ (tag/etiqueta) substituindo o emoji original da Vercel
- Q: O emoji 🏷️ deve ser aplicado em quais páginas? → A: Todas as páginas (home e área administrativa /parametrizacao)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Sees Under Construction Page (Priority: P1)

Um visitante acessa a página inicial do sistema e vê uma mensagem clara de "Página em Construção", sem nenhuma informação sobre o produto, links de afiliados ou funcionalidades do sistema.

**Why this priority**: Esta é a mudança principal solicitada. A home page atual expõe informações que não devem ser visíveis publicamente. Uma página de construção simples é essencial para manter o sistema discreto.

**Independent Test**: Pode ser testado acessando a URL raiz (/) e verificando que apenas a mensagem de construção aparece, sem nenhum outro conteúdo.

**Acceptance Scenarios**:

1. **Given** um usuário qualquer, **When** ele acessa a URL raiz (/), **Then** ele vê apenas uma página com mensagem de "Página em Construção"
2. **Given** um usuário qualquer, **When** ele acessa a URL raiz (/), **Then** não há nenhuma menção a produtos, afiliados, pixels ou funcionalidades administrativas
3. **Given** um usuário qualquer, **When** ele visualiza a home page, **Then** não há links visíveis para a área administrativa

---

### User Story 2 - Admin Access via New Route (Priority: P1)

Um administrador acessa o painel de gerenciamento através da nova rota /parametrizacao ao invés de /admin.

**Why this priority**: A renomeação da rota é crítica para obscurecer o acesso administrativo. O termo "parametrizacao" é menos óbvio que "admin" para usuários que possam tentar acessar áreas restritas.

**Independent Test**: Pode ser testado acessando /parametrizacao e verificando que o dashboard administrativo carrega corretamente.

**Acceptance Scenarios**:

1. **Given** um administrador, **When** ele acessa /parametrizacao, **Then** ele vê o dashboard administrativo completo
2. **Given** um administrador, **When** ele acessa /admin, **Then** ele recebe um erro 404 (página não encontrada)
3. **Given** um administrador em /parametrizacao, **When** ele navega para produtos ou pixels, **Then** as rotas são /parametrizacao/products e /parametrizacao/pixels

---

### User Story 3 - Updated Documentation (Priority: P2)

A documentação do projeto (CLAUDE.md) reflete as mudanças realizadas, permitindo que desenvolvedores futuros entendam a estrutura atual.

**Why this priority**: Documentação atualizada é importante para manutenção, mas não afeta a funcionalidade do usuário final.

**Independent Test**: Pode ser testado verificando que o CLAUDE.md contém informações sobre a home page de construção e a rota /parametrizacao.

**Acceptance Scenarios**:

1. **Given** o arquivo CLAUDE.md, **When** um desenvolvedor o lê, **Then** ele encontra informação sobre a home page ser uma página de construção
2. **Given** o arquivo CLAUDE.md, **When** um desenvolvedor busca a rota administrativa, **Then** ele encontra referência a /parametrizacao (não /admin)

---

### Edge Cases

- O que acontece quando um usuário tenta acessar /admin diretamente? Deve retornar 404
- O que acontece com bookmarks antigos de /admin? Usuários devem atualizar para /parametrizacao
- O que acontece se alguém busca por texto na página de construção? Não deve haver texto indexável sobre o sistema

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir apenas uma página de "Em Construção" na rota raiz (/)
- **FR-002**: Sistema NÃO DEVE conter nenhuma menção a produtos, afiliados, pixels ou funcionalidades na home page
- **FR-003**: Sistema NÃO DEVE ter links visíveis para área administrativa na home page
- **FR-004**: Sistema DEVE mover toda a área administrativa de /admin para /parametrizacao
- **FR-005**: Sistema DEVE retornar erro 404 quando usuário acessa /admin
- **FR-006**: Sistema DEVE manter todas as sub-rotas funcionando sob /parametrizacao (products, pixels)
- **FR-007**: Arquivo CLAUDE.md DEVE ser atualizado para refletir a nova estrutura
- **FR-008**: Sistema DEVE exibir o emoji 🏷️ no header/favicon de todas as páginas (home e /parametrizacao), substituindo o emoji padrão da Vercel

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitantes da home page veem apenas mensagem de construção em menos de 1 segundo de carregamento
- **SC-002**: 100% das tentativas de acesso a /admin resultam em página 404
- **SC-003**: 100% das funcionalidades administrativas permanecem acessíveis via /parametrizacao
- **SC-004**: CLAUDE.md contém documentação precisa das mudanças realizadas

## Assumptions

- A página de construção deve ser simples, sem necessidade de animações elaboradas
- O termo "Página em Construção" ou equivalente em português é suficiente
- Não há necessidade de proteção adicional por senha na rota /parametrizacao (mantém comportamento atual)
- As funcionalidades internas do admin dashboard não mudam, apenas a rota de acesso
