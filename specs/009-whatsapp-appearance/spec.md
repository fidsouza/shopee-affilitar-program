# Feature Specification: Personalização Visual das Páginas de WhatsApp

**Feature Branch**: `009-whatsapp-appearance`
**Created**: 2026-01-04
**Status**: Draft
**Input**: Permitir ao administrador personalizar o texto de "redirecionando" e a aparência da caixa (cor de fundo, borda) nas páginas de WhatsApp (/w/[slug])

## Clarifications

### Session 2026-01-04

- Q: Onde a configuração de personalização do texto/caixa será armazenada e vinculada? → A: Configuração global aplicada apenas às páginas de WhatsApp (/w/[slug])
- Q: Quais propriedades de estilo da caixa serão configuráveis? → A: Mínimo - cor de fundo e toggle de borda (sim/não)
- Q: Qual o texto padrão quando o administrador não personaliza? → A: Manter texto atual das páginas /w/ ("Redirecionando...")
- Q: Onde gerenciar essa configuração global no painel administrativo? → A: Na seção existente /parametrizacao/whatsapp (nova aba ou card de "Aparência")
- Q: Qual a cor da borda quando o toggle está ativado? → A: Cor fixa pré-definida (ex: cinza claro #e5e7eb)
- Q: Nome da nova branch para a feature? → A: 009-whatsapp-appearance
- Q: O que fazer com a especificação atual da branch 008? → A: Copiar toda a spec para 009 e limpar cada uma

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Personalização Visual das Páginas de WhatsApp (Priority: P1)

Como administrador do sistema, preciso personalizar o texto e a aparência da caixa de "redirecionando" nas páginas de WhatsApp (/w/[slug]) para adequar a mensagem e o visual à identidade da campanha.

**Why this priority**: Permite maior flexibilidade de branding e comunicação nas páginas de redirecionamento de WhatsApp, melhorando a experiência do usuário.

**Independent Test**: Pode ser testado acessando /parametrizacao/whatsapp, alterando as configurações de aparência, e verificando se as mudanças são refletidas nas páginas /w/[slug].

**Acceptance Scenarios**:

1. **Given** um administrador acessa /parametrizacao/whatsapp, **When** ele visualiza a seção de aparência, **Then** ele pode editar o texto de redirecionamento
2. **Given** um administrador configura um texto personalizado, **When** um visitante acessa uma página /w/[slug], **Then** o texto personalizado é exibido no lugar do padrão "Redirecionando..."
3. **Given** um administrador ativa o toggle de borda, **When** um visitante acessa uma página /w/[slug], **Then** a caixa de texto é exibida com borda cinza claro (#e5e7eb)
4. **Given** um administrador configura uma cor de fundo, **When** um visitante acessa uma página /w/[slug], **Then** a caixa de texto é exibida com a cor de fundo configurada
5. **Given** um administrador não fez nenhuma personalização, **When** um visitante acessa uma página /w/[slug], **Then** o texto padrão "Redirecionando..." é exibido sem caixa estilizada

---

### Edge Cases

- O que acontece se a configuração de aparência do WhatsApp estiver corrompida ou ausente? O sistema usa valores padrão (texto "Redirecionando...", sem borda, sem cor de fundo).
- O que acontece se o administrador inserir uma cor de fundo inválida? A validação do formulário impede submissão com formato inválido.
- O que acontece se o texto de redirecionamento estiver vazio? A validação exige pelo menos 1 caractere.
- O que acontece se múltiplos administradores editarem ao mesmo tempo? Última escrita prevalece (sem controle de concorrência).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir ao administrador personalizar o texto de redirecionamento das páginas /w/[slug] através de configuração global
- **FR-002**: Sistema DEVE permitir ao administrador configurar cor de fundo da caixa de texto (input de cor ou campo hexadecimal)
- **FR-003**: Sistema DEVE permitir ao administrador ativar/desativar borda na caixa de texto via toggle (sim/não)
- **FR-004**: Quando borda ativada, sistema DEVE exibir borda com cor fixa cinza claro (#e5e7eb)
- **FR-005**: Sistema DEVE exibir texto padrão "Redirecionando..." quando nenhuma personalização for configurada
- **FR-006**: Interface de configuração DEVE estar localizada em /parametrizacao/whatsapp (seção ou card de "Aparência")
- **FR-007**: Configurações de aparência DEVEM ser aplicadas globalmente a todas as páginas /w/[slug]

### Key Entities

- **WhatsAppAppearanceConfig**: Configuração global de aparência das páginas de WhatsApp contendo:
  - `redirectText` (string): Texto de redirecionamento
  - `backgroundColor` (string, opcional): Cor de fundo em formato hexadecimal (#RRGGBB)
  - `borderEnabled` (boolean): Se a caixa deve ter borda
  - `updatedAt` (string): Data/hora da última atualização (ISO 8601)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrador consegue personalizar texto e aparência da caixa em menos de 1 minuto através da interface /parametrizacao/whatsapp
- **SC-002**: Alterações de aparência são refletidas em todas as páginas /w/[slug] imediatamente após salvar
- **SC-003**: Páginas /w/[slug] carregam em menos de 2 segundos mesmo com configuração personalizada
- **SC-004**: Sistema retorna valores padrão em menos de 100ms quando configuração não existe

## Assumptions

- A configuração de aparência das páginas WhatsApp será armazenada no Edge Config seguindo o padrão existente do projeto
- Apenas um administrador edita a configuração por vez (sem necessidade de controle de concorrência)
- A interface de administração já existe em /parametrizacao/whatsapp e será estendida
- As páginas /w/[slug] já existem e funcionam com o texto padrão "Redirecionando..."
