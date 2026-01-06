# Feature Specification: WhatsApp Vacancy Counter

**Feature Branch**: `014-whatsapp-vacancy-counter`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Contagem de vagas restantes para páginas de WhatsApp com toggle habilitação, headline, contador numérico e footer personalizável, estilo visual similar ao redirect"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrador Habilita Contador de Vagas (Priority: P1)

O administrador acessa o painel de gerenciamento de páginas WhatsApp e habilita a feature de contagem de vagas restantes para uma página específica. Ele configura o número de vagas disponíveis, personaliza a headline (ex: "VAGAS DISPONÍVEIS"), o contador numérico, e o texto de footer (ex: "Corra antes que acabe!").

**Why this priority**: Esta é a funcionalidade core da feature - sem a capacidade de habilitar e configurar o contador, a feature não entrega valor.

**Independent Test**: Pode ser testado criando uma nova página WhatsApp, habilitando o contador de vagas com valores específicos, e verificando que os campos são persistidos corretamente.

**Acceptance Scenarios**:

1. **Given** administrador está na tela de criação/edição de página WhatsApp e redirect está desabilitado, **When** habilita o contador de vagas, **Then** campos de configuração (headline, número, footer) tornam-se visíveis e editáveis
2. **Given** administrador configurou contador com headline "VAGAS DISPONÍVEIS", número 47, footer "Garanta sua vaga agora!", **When** salva a página, **Then** dados são persistidos e exibidos na listagem
3. **Given** administrador está na tela de edição de página com contador habilitado, **When** desabilita o contador, **Then** o componente de contagem não será exibido na página pública

---

### User Story 2 - Visitante Visualiza Contador de Vagas (Priority: P1)

O visitante acessa uma página de redirecionamento WhatsApp (/w/[slug]) que possui o contador de vagas habilitado. Ele visualiza um componente estilizado (similar ao componente de redirect) mostrando a headline no topo, o número de vagas restantes em destaque, e o footer no rodapé do componente.

**Why this priority**: Esta é a experiência do usuário final - crítica para criar urgência e conversão.

**Independent Test**: Pode ser testado acessando uma página /w/[slug] com contador habilitado e verificando que headline, número e footer são exibidos corretamente no estilo visual definido.

**Acceptance Scenarios**:

1. **Given** página WhatsApp tem contador de vagas habilitado com headline "VAGAS DISPONÍVEIS", número 25, footer "Últimas vagas!", **When** visitante acessa /w/[slug], **Then** componente de contagem é exibido com headline no topo, número "25" em destaque, e footer na base
2. **Given** página WhatsApp tem contador de vagas desabilitado, **When** visitante acessa /w/[slug], **Then** componente de contagem não é exibido
3. **Given** página WhatsApp tem contador habilitado, **When** visitante visualiza em dispositivo móvel, **Then** componente mantém legibilidade e proporções adequadas

---

### User Story 3 - Exclusividade Mútua com Redirect (Priority: P2)

O sistema garante que o contador de vagas e o redirect automático são mutuamente exclusivos - apenas um pode estar ativo por vez para cada página.

**Why this priority**: Regra de negócio importante para evitar conflitos visuais e de comportamento, mas não impede a feature de funcionar se implementada depois.

**Independent Test**: Pode ser testado tentando habilitar o contador quando redirect está ativo e vice-versa, verificando que a UI impede a ação.

**Acceptance Scenarios**:

1. **Given** página WhatsApp tem redirect habilitado, **When** administrador tenta habilitar contador de vagas, **Then** sistema bloqueia a ação e exibe mensagem explicativa
2. **Given** página WhatsApp tem contador de vagas habilitado, **When** administrador tenta habilitar redirect, **Then** sistema bloqueia a ação e exibe mensagem explicativa
3. **Given** página WhatsApp tem ambos desabilitados, **When** administrador habilita contador de vagas, **Then** ação é permitida e opção de redirect permanece desabilitada/bloqueada
4. **Given** administrador desabilita o contador de vagas, **When** opção de redirect é verificada, **Then** opção de redirect torna-se disponível para ser habilitada

---

### Edge Cases

- O que acontece quando o número de vagas é zero?
  - O componente continua exibindo "0" como valor do contador
- O que acontece quando headline ou footer estão vazios?
  - Headline é obrigatória; footer é opcional e simplesmente não é renderizado se vazio
- O que acontece se o número de vagas for negativo?
  - Validação impede valores negativos (mínimo: 0)
- O que acontece com páginas existentes que já têm redirect habilitado?
  - Contador de vagas permanece desabilitado por padrão; admin deve desabilitar redirect primeiro para poder habilitar contador

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir habilitar/desabilitar o contador de vagas para cada página WhatsApp individualmente
- **FR-002**: Sistema DEVE permitir configurar a headline do contador (texto exibido acima do número)
- **FR-003**: Sistema DEVE permitir configurar o número de vagas a ser exibido (inteiro >= 0)
- **FR-004**: Sistema DEVE permitir configurar o footer do contador (texto opcional exibido abaixo do número)
- **FR-005**: Sistema DEVE impedir que contador de vagas seja habilitado quando redirect está habilitado
- **FR-006**: Sistema DEVE impedir que redirect seja habilitado quando contador de vagas está habilitado
- **FR-007**: Sistema DEVE exibir mensagem clara ao usuário quando uma opção é bloqueada devido à exclusividade mútua
- **FR-008**: Sistema DEVE renderizar o componente de contador de vagas na página pública (/w/[slug]) quando habilitado
- **FR-009**: Sistema DEVE ocultar o componente de contador de vagas quando desabilitado
- **FR-010**: Sistema DEVE validar que headline não pode ser vazia quando contador está habilitado
- **FR-011**: Sistema DEVE validar que número de vagas é um inteiro não-negativo
- **FR-012**: Sistema DEVE persistir configurações do contador junto com os demais dados da página WhatsApp
- **FR-013**: Componente de contador DEVE seguir estilo visual similar ao componente de redirect existente (tipografia, espaçamento)
- **FR-014**: Sistema DEVE permitir configurar a cor de fundo do contador via color picker com input hex (padrão do componente de Aparência Global)
- **FR-015**: Sistema DEVE permitir configurar o tamanho da fonte do número via seletor pré-definido (Pequeno/Médio/Grande)
- **FR-016**: Sistema DEVE permitir configurar o tamanho da fonte da headline via seletor pré-definido (Pequeno/Médio/Grande)
- **FR-017**: Sistema DEVE permitir configurar o tamanho da fonte do footer via seletor pré-definido (Pequeno/Médio/Grande)
- **FR-018**: Componente de contador DEVE sempre exibir borda (sem opção de toggle)
- **FR-019**: Configuração do contador de vagas DEVE estar localizada na aba "Gatilhos" do painel de administração

### Key Entities *(include if feature involves data)*

- **WhatsAppPage** (extensão): Entidade existente que será estendida com campos para o contador de vagas
  - `vacancyCounterEnabled`: boolean - indica se contador está habilitado
  - `vacancyHeadline`: string - texto da headline (ex: "VAGAS DISPONÍVEIS")
  - `vacancyCount`: number - número de vagas a exibir
  - `vacancyFooter`: string | null - texto opcional do footer
  - `vacancyBackgroundColor`: string | null - cor de fundo em formato hex (#RRGGBB), null para transparente
  - `vacancyCountFontSize`: "small" | "medium" | "large" - tamanho da fonte do número (padrão: large)
  - `vacancyHeadlineFontSize`: "small" | "medium" | "large" - tamanho da fonte da headline (padrão: medium)
  - `vacancyFooterFontSize`: "small" | "medium" | "large" - tamanho da fonte do footer (padrão: small)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores conseguem configurar o contador de vagas em menos de 1 minuto
- **SC-002**: 100% das páginas com contador habilitado exibem o componente corretamente para visitantes
- **SC-003**: Exclusividade mútua entre redirect e contador funciona em 100% dos casos (sem estados inconsistentes)
- **SC-004**: Visitantes visualizam o componente de contador com informações legíveis em dispositivos móveis e desktop
- **SC-005**: Componente de contador mantém consistência visual com outros elementos da página (redirect, social proof)

## Clarifications

### Session 2026-01-06

- Q: Como o administrador deve selecionar a cor de fundo do contador de vagas? → A: Color picker com input hex (igual ao existente em Aparência Global)
- Q: Como o administrador deve configurar o tamanho da fonte do número do contador? → A: Seletor de tamanho pré-definido (Pequeno/Médio/Grande) igual ao emoji size
- Q: O tamanho da fonte configurável deve se aplicar a quais elementos do componente? → A: Número, headline e footer - três seletores separados
- Q: O componente de contador de vagas deve ter opção para habilitar/desabilitar borda? → A: Não, componente sempre com borda
- Q: Em qual aba do painel admin deve ficar a configuração do contador de vagas? → A: Aba "Gatilhos"

## Assumptions

- O número de vagas é um valor estático configurado pelo administrador, não decrementado automaticamente por conversões
- O estilo visual do componente segue o padrão já estabelecido pelo componente de redirect (mesma paleta de cores, fontes, bordas)
- O campo headline tem limite máximo de 100 caracteres (padrão do sistema)
- O campo footer tem limite máximo de 200 caracteres
- O contador de vagas é exibido na mesma área visual que seria ocupada pelo componente de redirect quando este está desabilitado
- Footer vazio não renderiza elemento de footer (não ocupa espaço visual)
