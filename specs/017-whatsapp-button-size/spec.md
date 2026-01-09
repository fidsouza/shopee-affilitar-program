# Feature Specification: Configuração de Tamanho do Botão WhatsApp

**Feature Branch**: `017-whatsapp-button-size`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "crie uma feature para poder aumentar ou diminuir o tamanho do botao principal da pagina de whatsapp o ideal e que tenha um preview de como o botao vai ficar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ajustar Tamanho do Botão no Admin (Priority: P1)

O administrador acessa a página de configuração de WhatsApp (/parametrizacao/whatsapp), localiza a seção de configuração do botão principal e seleciona o tamanho desejado entre as opções disponíveis (pequeno, médio, grande). Ao selecionar, um preview em tempo real mostra exatamente como o botão aparecerá para os usuários finais na página de WhatsApp.

**Why this priority**: Esta é a funcionalidade central da feature. Sem ela, não há valor entregue ao usuário.

**Independent Test**: Pode ser testado acessando /parametrizacao/whatsapp, alterando o tamanho do botão e verificando que o preview atualiza instantaneamente sem necessidade de salvar.

**Acceptance Scenarios**:

1. **Given** administrador está na aba "Geral" da configuração de WhatsApp, **When** seleciona tamanho "Grande" para o botão, **Then** o preview do botão atualiza imediatamente mostrando o botão maior
2. **Given** administrador alterou o tamanho do botão para "Pequeno", **When** clica em "Salvar configurações", **Then** a configuração é persistida e uma mensagem de sucesso é exibida
3. **Given** administrador selecionou tamanho "Médio", **When** visualiza o preview, **Then** o preview mostra o botão com tamanho intermediário entre pequeno e grande

---

### User Story 2 - Visualizar Botão na Página Pública (Priority: P2)

O usuário final acessa a página de redirecionamento WhatsApp (/w/[slug]) e visualiza o botão principal com o tamanho configurado pelo administrador, mantendo todas as funcionalidades existentes (clique, tracking, animações).

**Why this priority**: Essencial para que a configuração do admin tenha efeito real na experiência do usuário final.

**Independent Test**: Pode ser testado acessando uma página /w/[slug] configurada e verificando que o botão aparece com o tamanho correto conforme configurado no admin.

**Acceptance Scenarios**:

1. **Given** administrador configurou botão como "Grande", **When** usuário acessa /w/[slug], **Then** o botão é renderizado com tamanho grande
2. **Given** administrador configurou botão como "Pequeno", **When** usuário acessa /w/[slug], **Then** o botão é renderizado com tamanho pequeno, mantendo legibilidade

---

### User Story 3 - Valor Padrão para Páginas Existentes (Priority: P3)

Páginas de WhatsApp existentes que não possuem configuração de tamanho do botão devem continuar funcionando normalmente, utilizando o tamanho padrão (médio) para manter a compatibilidade retroativa.

**Why this priority**: Garante que a atualização não quebre páginas existentes em produção.

**Independent Test**: Pode ser testado acessando uma página existente sem a configuração de tamanho e verificando que o botão aparece com tamanho médio (padrão atual).

**Acceptance Scenarios**:

1. **Given** página WhatsApp existente sem configuração de tamanho, **When** usuário acessa a página, **Then** o botão é renderizado com tamanho médio (comportamento atual)
2. **Given** página WhatsApp existente, **When** administrador acessa configuração, **Then** o seletor de tamanho mostra "Médio" como valor padrão selecionado

---

### Edge Cases

- O que acontece quando o texto do botão é muito longo? O botão deve acomodar o texto sem quebrar, ajustando proporcionalmente.
- Como o botão se comporta em telas muito pequenas (mobile)? O botão deve ser responsivo e manter proporções adequadas para cada tamanho de tela.
- Se o administrador não salvar após alterar o tamanho, o preview deve refletir a alteração mas a página pública deve manter o valor salvo anteriormente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir que administrador selecione o tamanho do botão entre três opções: pequeno, médio e grande
- **FR-002**: Sistema DEVE exibir preview em tempo real do botão na interface de administração quando o tamanho é alterado
- **FR-003**: Sistema DEVE persistir a configuração de tamanho do botão ao salvar a página WhatsApp
- **FR-004**: Sistema DEVE aplicar o tamanho configurado ao renderizar o botão na página pública /w/[slug]
- **FR-005**: Sistema DEVE usar tamanho "médio" como valor padrão para páginas novas e páginas existentes sem configuração
- **FR-006**: Sistema DEVE manter todas as funcionalidades existentes do botão (clique, tracking, animações hover/active) independente do tamanho
- **FR-007**: O preview DEVE mostrar uma representação fiel do botão incluindo ícone WhatsApp, texto configurado e cores

### Key Entities

- **WhatsAppPage**: Entidade existente que armazenará o novo atributo de tamanho do botão (buttonSize)
- **ButtonSize**: Tipo enumerado com valores pequeno, médio e grande, seguindo padrão existente do sistema

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrador consegue visualizar o preview do botão em menos de 1 segundo após alterar o tamanho
- **SC-002**: 100% das páginas existentes continuam funcionando sem necessidade de reconfiguração
- **SC-003**: A diferença visual entre os três tamanhos é claramente perceptível pelos usuários
- **SC-004**: O botão mantém legibilidade e usabilidade em todos os tamanhos, tanto em desktop quanto mobile

## Assumptions

- O padrão de tamanhos seguirá o mesmo sistema já utilizado para emojiSize e subheadlineFontSize (small/medium/large)
- A posição do seletor de tamanho será na seção "Geral" da aba de configuração, próximo ao campo de texto do botão
- O preview utilizará o mesmo componente visual do botão real para garantir fidelidade
- As proporções de tamanho serão:
  - Pequeno: padding reduzido, fonte menor
  - Médio: tamanho atual do botão (mantém compatibilidade)
  - Grande: padding aumentado, fonte maior
