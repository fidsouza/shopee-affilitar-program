# Feature Specification: WhatsApp Admin Tabs Organization

**Feature Branch**: `010-whatsapp-admin-tabs`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "Ajuste o estilo das páginas de administração das páginas de WhatsApp. Mover configurações de HeadLine, URL De Foto, Provas Sociais, Texto do Botão, URL WhatsApp para uma aba específica chamada 'Geral'. O resto mantém como está."

## Clarifications

### Session 2026-01-04

- Q: Qual escopo das abas a implementar? → A: Apenas uma aba "Geral" contendo os 5 campos especificados. As demais seções (Pixel/Eventos, Benefit Cards, Notificações de Prova Social) permanecem como estão atualmente, sem serem movidas para abas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access General Tab for Core Page Settings (Priority: P1)

O administrador acessa a página de administração de WhatsApp e visualiza os campos principais organizados em uma aba "Geral": Headline, URL da Foto, Provas Sociais, Texto do Botão e URL do WhatsApp. As demais seções de configuração (Pixel/Eventos, Benefit Cards, Notificações de Prova Social) permanecem abaixo da aba, exatamente como estão atualmente.

**Why this priority**: Esta é a funcionalidade central solicitada - organizar apenas os campos principais em uma aba "Geral" para melhor organização visual.

**Independent Test**: Pode ser testado navegando até /parametrizacao/whatsapp e verificando que os 5 campos principais aparecem na aba "Geral", enquanto as demais seções permanecem inalteradas.

**Acceptance Scenarios**:

1. **Given** o administrador está na página /parametrizacao/whatsapp, **When** a página carrega, **Then** a aba "Geral" é exibida contendo apenas os campos Headline, URL da Foto, Provas Sociais, Texto do Botão e URL do WhatsApp
2. **Given** a aba "Geral" está ativa, **When** o administrador visualiza o restante do formulário, **Then** as seções Pixel/Eventos, Benefit Cards e Notificações de Prova Social são exibidas abaixo da aba, na mesma posição e formato atual
3. **Given** o administrador preenche todos os campos, **When** submete o formulário, **Then** os dados são salvos corretamente

---

### Edge Cases

- O que acontece quando o formulário tem erros na aba "Geral"? O usuário é notificado com destaque visual na aba e nos campos com erro.
- O que acontece se o usuário submete com dados não salvos? O comportamento permanece o mesmo do formulário atual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir uma aba "Geral" na seção de criação/edição de páginas WhatsApp
- **FR-002**: Aba "Geral" DEVE conter APENAS os campos: Headline, URL da Foto do Header, Provas Sociais, Texto do Botão, URL do WhatsApp
- **FR-003**: As seções Pixel/Eventos, Benefit Cards e Notificações de Prova Social DEVEM permanecer fora do sistema de abas, na mesma posição e formato atual
- **FR-004**: Sistema DEVE indicar visualmente quando a aba "Geral" está ativa
- **FR-005**: A aba "Geral" DEVE ser selecionada por padrão ao carregar a página
- **FR-006**: A seção "Aparência Global" DEVE permanecer no topo da página, separada do formulário de abas

### Key Entities

- **WhatsAppPage**: Entidade existente, sem alterações na estrutura de dados - apenas reorganização visual de 5 campos específicos

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores podem criar páginas WhatsApp utilizando a nova interface com aba "Geral" sem perda de funcionalidade
- **SC-002**: Os 5 campos especificados (Headline, URL Foto, Provas Sociais, Texto Botão, URL WhatsApp) são exibidos exclusivamente na aba "Geral"
- **SC-003**: As seções Pixel/Eventos, Benefit Cards e Notificações de Prova Social aparecem inalteradas fora do sistema de abas
- **SC-004**: A funcionalidade de edição de páginas existentes continua operando corretamente

## Assumptions

- A aba "Geral" é a única aba implementada nesta feature (possível expansão futura para outras abas está fora do escopo)
- A seção "Aparência Global" permanece separada do formulário de abas, pois é uma configuração global
- O componente de tabs utilizará shadcn/ui para manter consistência visual com o resto da aplicação
- A lista de páginas cadastradas permanece no final da página, inalterada
