# Feature Specification: WhatsApp Benefit Cards Personalizáveis

**Feature Branch**: `005-whatsapp-benefit-cards`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "Adicionar benefit cards personalizáveis na página de redirecionamento WhatsApp com emoji, título e descrição customizáveis"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar Benefit Cards no Admin (Priority: P1)

Administrador deseja adicionar e gerenciar benefit cards personalizáveis para páginas de WhatsApp, permitindo criar cards com emoji, título e descrição para destacar benefícios do grupo/destino.

**Why this priority**: É a funcionalidade central que permite ao administrador criar e personalizar os benefit cards que serão exibidos nas páginas de redirecionamento.

**Independent Test**: Pode ser testado acessando o painel admin `/parametrizacao/whatsapp`, criando uma nova página ou editando existente, adicionando/removendo benefit cards e verificando que são salvos corretamente.

**Acceptance Scenarios**:

1. **Given** administrador está editando uma página WhatsApp, **When** adiciona um novo benefit card com emoji "💸", título "Descontos de até 70%" e descrição "Economia real em produtos selecionados a dedo para você.", **Then** o card é adicionado à lista e exibido no formulário.
2. **Given** administrador criou múltiplos benefit cards, **When** salva a página, **Then** todos os cards são persistidos e recuperados ao editar novamente.
3. **Given** administrador tem um benefit card existente, **When** remove o card, **Then** o card é removido da lista e não aparece mais após salvar.
4. **Given** administrador está editando benefit cards, **When** reordena os cards (drag-and-drop ou setas), **Then** a nova ordem é mantida após salvar.

---

### User Story 2 - Exibir Benefit Cards na Página de Redirect (Priority: P1)

Visitante que acessa a página de redirecionamento WhatsApp `/w/[slug]` deve ver os benefit cards configurados exibidos em um grid visual atrativo, antes de ser redirecionado ao grupo.

**Why this priority**: É o valor entregue ao usuário final - a exibição visual dos benefícios que incentiva a conversão.

**Independent Test**: Pode ser testado acessando uma página `/w/[slug]` que tenha benefit cards configurados e verificando que são renderizados corretamente com emoji, título e descrição.

**Acceptance Scenarios**:

1. **Given** página WhatsApp tem 4 benefit cards configurados, **When** visitante acessa `/w/[slug]`, **Then** vê um grid com os 4 cards exibindo emoji, título e descrição de cada um.
2. **Given** página WhatsApp não tem benefit cards configurados, **When** visitante acessa `/w/[slug]`, **Then** a seção de benefits não é exibida (graceful fallback).
3. **Given** página WhatsApp tem benefit cards configurados, **When** visitante acessa em dispositivo móvel, **Then** o grid se adapta responsivamente (ex: 1 coluna em mobile, 2 colunas em tablet, 4 em desktop).

---

### User Story 3 - Editar Benefit Cards Existentes (Priority: P2)

Administrador deseja modificar benefit cards existentes, alterando emoji, título ou descrição de cards já criados.

**Why this priority**: Permite ajustes e otimizações nos cards sem precisar recriá-los.

**Independent Test**: Pode ser testado editando uma página existente, modificando um card específico, salvando e verificando que as mudanças persistiram.

**Acceptance Scenarios**:

1. **Given** administrador está editando uma página com benefit cards, **When** altera o título de um card existente, **Then** a alteração é refletida imediatamente no formulário.
2. **Given** administrador alterou um benefit card, **When** salva a página, **Then** a alteração é persistida e visível ao recarregar.

---

### Edge Cases

- O que acontece quando o emoji inserido é inválido ou muito longo? O sistema deve aceitar qualquer caractere Unicode válido, incluindo emojis compostos.
- Como o sistema lida quando administrador tenta salvar um card com título vazio? O sistema deve exigir título preenchido (descrição pode ser opcional).
- Quantos benefit cards podem ser adicionados por página? Limite razoável de 8 cards por página para evitar poluição visual.
- O que acontece se o administrador não inserir nenhum benefit card? A seção simplesmente não é renderizada na página de redirect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir adicionar múltiplos benefit cards a uma página WhatsApp (máximo 8 cards por página).
- **FR-002**: Cada benefit card DEVE ter: emoji (obrigatório, max 2 caracteres), título (obrigatório, max 50 caracteres), descrição (opcional, max 150 caracteres).
- **FR-003**: Sistema DEVE permitir remover benefit cards individualmente.
- **FR-004**: Sistema DEVE permitir reordenar benefit cards (a ordem definida no admin deve ser respeitada na exibição).
- **FR-005**: Sistema DEVE persistir benefit cards junto com os demais dados da página WhatsApp no Edge Config.
- **FR-006**: Página de redirect `/w/[slug]` DEVE exibir benefit cards em layout grid responsivo quando existirem.
- **FR-007**: Página de redirect DEVE omitir a seção de benefit cards quando nenhum card estiver configurado.
- **FR-008**: Sistema DEVE permitir editar benefit cards existentes (emoji, título, descrição).
- **FR-009**: Sistema DEVE exibir preview visual dos cards no formulário admin durante edição.
- **FR-010**: Sistema DEVE permitir configurar o tamanho do emoji globalmente por página (pequeno/médio/grande), aplicando-se a todos os cards da página. O valor padrão é "médio".

### Key Entities *(include if feature involves data)*

- **BenefitCard**: Representa um card de benefício individual. Atributos: emoji (string), title (string), description (string opcional). Pertence a uma WhatsAppPage.
- **WhatsAppPageRecord**: Entidade existente que será estendida com um array de BenefitCards e configuração de tamanho de emoji (emojiSize: pequeno/médio/grande).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrador consegue criar uma página WhatsApp com 4 benefit cards em menos de 3 minutos.
- **SC-002**: 100% dos benefit cards configurados são exibidos corretamente na página de redirect.
- **SC-003**: Página de redirect com benefit cards carrega em menos de 2 segundos em conexões 3G.
- **SC-004**: Layout responsivo funciona corretamente em viewports de 320px a 1920px de largura.
- **SC-005**: Ordem dos benefit cards definida no admin é preservada na exibição ao visitante.

## Clarifications

### Session 2026-01-01

- Q: Como o tamanho do emoji deve ser configurável? → A: Tamanho global por página - um único tamanho de emoji para todos os cards da página (pequeno/médio/grande)
- Q: Qual deve ser o tamanho padrão do emoji para novas páginas? → A: Médio (equilíbrio entre emoji e texto)

## Assumptions

- Emojis serão inseridos diretamente pelo teclado do usuário (não haverá emoji picker integrado nesta versão).
- A reordenação será implementada via botões "mover para cima/baixo" (drag-and-drop pode ser considerado em versão futura).
- O limite de 8 cards por página é suficiente para casos de uso previstos.
- A descrição é opcional pois alguns casos de uso podem preferir cards mais compactos apenas com emoji + título.
