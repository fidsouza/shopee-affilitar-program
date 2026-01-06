# Feature Specification: Toggle de Redirect com Eventos Separados

**Feature Branch**: `013-redirect-toggle`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "crie uma feature para habilitar / desabilitar a feature já existente de redirect. Para o botão vamos ter um disparo de pixel e para o redirect um outro evento pode ser disparado se for selecionado um diferente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Desabilitar Redirect Automático (Priority: P1)

O administrador deseja desabilitar o redirect automático em uma página WhatsApp para que os usuários só sejam redirecionados quando clicarem no botão CTA, permitindo mais tempo para visualizar o conteúdo da página.

**Why this priority**: Esta é a funcionalidade central da feature - sem ela, não há como controlar o comportamento de redirect. Resolve diretamente a necessidade de páginas que funcionam como landing pages com mais conteúdo.

**Independent Test**: Pode ser testado criando uma página WhatsApp com redirect desabilitado e verificando que a contagem regressiva e o redirect automático não acontecem, mas o botão ainda funciona.

**Acceptance Scenarios**:

1. **Given** uma página WhatsApp existente com redirect habilitado, **When** o administrador desabilita a opção de redirect automático e salva, **Then** a página passa a não exibir contagem regressiva nem executar redirect automático.

2. **Given** uma página WhatsApp com redirect desabilitado, **When** um usuário acessa a página, **Then** o usuário permanece na página indefinidamente até clicar no botão CTA.

3. **Given** uma página WhatsApp com redirect desabilitado, **When** o administrador habilita novamente o redirect, **Then** a página volta a exibir contagem regressiva e executar redirect automático.

---

### User Story 2 - Configurar Evento do Botão (Priority: P2)

O administrador deseja configurar um evento de pixel específico para quando o usuário clica no botão CTA, separado do evento de redirect automático, para ter métricas mais precisas sobre a interação do usuário.

**Why this priority**: Permite rastrear separadamente cliques intencionais (botão) de redirects automáticos, melhorando a qualidade dos dados de conversão.

**Independent Test**: Pode ser testado configurando eventos diferentes para botão e redirect, e verificando no Meta Pixel Helper que cada ação dispara o evento correto.

**Acceptance Scenarios**:

1. **Given** uma página WhatsApp com pixel configurado, **When** o administrador seleciona um evento específico para o clique do botão (ex: "Lead"), **Then** ao clicar no botão, o evento "Lead" é disparado.

2. **Given** uma página WhatsApp com eventos de botão e redirect diferentes configurados, **When** o redirect automático acontece, **Then** o evento de redirect configurado é disparado (não o evento de botão).

3. **Given** uma página WhatsApp com redirect desabilitado, **When** o usuário clica no botão, **Then** apenas o evento de botão é disparado.

---

### User Story 3 - Manter Compatibilidade com Configuração Atual (Priority: P3)

O administrador que já possui páginas configuradas não precisa alterá-las - o comportamento atual permanece como padrão (redirect habilitado com mesmo evento para botão e redirect).

**Why this priority**: Garante que páginas existentes continuem funcionando sem necessidade de reconfiguração.

**Independent Test**: Pode ser testado acessando páginas existentes antes e depois da atualização e verificando que o comportamento permanece idêntico.

**Acceptance Scenarios**:

1. **Given** uma página WhatsApp criada antes desta feature, **When** a página é acessada após a atualização, **Then** o comportamento é idêntico ao anterior (redirect habilitado, mesmo evento para ambas ações).

2. **Given** o formulário de criação de página, **When** o administrador cria uma nova página sem alterar as configurações padrão, **Then** a página é criada com redirect habilitado e evento de botão igual ao evento de redirect.

---

### Edge Cases

- O que acontece quando redirect está desabilitado mas nenhum evento de botão foi configurado?
  - O botão funciona normalmente, disparando o evento padrão de redirect (comportamento backward-compatible).

- O que acontece quando o usuário desabilita JavaScript?
  - O botão continua funcionando como link direto (já implementado no sistema atual).

- O que acontece quando redirect está habilitado mas o delay é 0?
  - Validação impede delay menor que 1 segundo (já implementado).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir habilitar/desabilitar redirect automático por página WhatsApp através de um toggle no formulário de configuração.

- **FR-002**: Sistema DEVE ocultar a contagem regressiva e barra de progresso quando redirect automático estiver desabilitado.

- **FR-003**: Sistema DEVE permitir selecionar um evento de pixel específico para clique no botão, independente do evento de redirect.

- **FR-004**: Sistema DEVE disparar o evento de botão (client-side e server-side) quando o usuário clica no botão CTA, independente do status do redirect.

- **FR-005**: Sistema DEVE disparar o evento de redirect (client-side e server-side) apenas quando o redirect automático acontece via countdown.

- **FR-006**: Sistema DEVE manter compatibilidade com páginas existentes, usando redirect habilitado e evento de botão igual ao evento de redirect como padrão.

- **FR-007**: Sistema DEVE permitir que o evento de botão seja igual ao evento de redirect (mesma opção selecionável).

- **FR-008**: Sistema DEVE persistir as configurações de toggle de redirect e evento de botão junto com os demais dados da página WhatsApp.

### Key Entities

- **WhatsAppPage (atualização)**: Adiciona campos `redirectEnabled` (booleano, padrão true) e `buttonEvent` (evento Meta, opcional - quando não definido, usa `redirectEvent`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores conseguem criar páginas WhatsApp com redirect desabilitado em menos de 30 segundos adicionais ao fluxo atual.

- **SC-002**: 100% das páginas existentes mantêm comportamento idêntico após a atualização (backward compatibility total).

- **SC-003**: Eventos de botão e redirect são rastreados corretamente no Meta Pixel com taxa de sucesso igual ou superior ao tracking atual (>99% de correspondência entre client e server-side).

- **SC-004**: Páginas com redirect desabilitado não exibem elementos de contagem regressiva ou barra de progresso.

## Assumptions

- O dropdown de seleção de eventos segue o mesmo padrão visual já existente para `events[]` e `redirectEvent`.
- A localização do novo campo de evento de botão será próxima ao campo de evento de redirect no formulário.
- O toggle de redirect será posicionado próximo ao campo de delay de redirect, pois são configurações relacionadas.
- A API endpoint existente `/api/whatsapp/track-redirect` será reutilizada para tracking do evento de botão.
