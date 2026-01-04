# Feature Specification: Notificação de Prova Social

**Feature Branch**: `007-social-proof-notification`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Barra de notificação de prova social que exibe mensagem aleatória tipo 'Priscila de São Paulo acabou de entrar no grupo!' com nomes e cidades aleatórios, configurável pelo painel admin (habilitar/desabilitar)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrador habilita notificações de prova social (Priority: P1)

O administrador do sistema acessa o painel de configuração de uma página de WhatsApp e encontra uma opção para habilitar ou desabilitar as notificações de prova social. Ao habilitar, as páginas de redirecionamento do WhatsApp passam a exibir notificações automáticas de "novos membros entrando".

**Why this priority**: Esta é a funcionalidade central que permite ao administrador controlar se o recurso está ativo ou não. Sem esta configuração, não há como gerenciar o comportamento da feature.

**Independent Test**: Pode ser testado acessando `/parametrizacao/whatsapp`, editando uma página e verificando se a opção de toggle está presente e salva corretamente.

**Acceptance Scenarios**:

1. **Given** o administrador está na página de edição de um grupo WhatsApp, **When** ele alterna a opção de notificações de prova social para "habilitado", **Then** a configuração é salva e a página de redirecionamento passa a exibir as notificações.
2. **Given** o administrador está na página de edição de um grupo WhatsApp com notificações habilitadas, **When** ele alterna a opção para "desabilitado", **Then** a configuração é salva e a página de redirecionamento não exibe mais as notificações.
3. **Given** o administrador está criando um novo grupo WhatsApp, **When** ele visualiza as opções de configuração, **Then** a opção de notificações de prova social está desabilitada por padrão.
4. **Given** o administrador está na página de edição com notificações habilitadas, **When** ele configura o intervalo entre notificações para um valor específico, **Then** a configuração é salva e as notificações aparecem respeitando esse intervalo.

---

### User Story 2 - Visitante visualiza notificações de prova social (Priority: P1)

O visitante acessa uma página de redirecionamento de WhatsApp (`/w/[slug]`) que tem as notificações de prova social habilitadas. Uma barra de notificação aparece na parte superior ou inferior da tela exibindo uma mensagem como "Priscila de São Paulo acabou de entrar no grupo!" e desaparece automaticamente após alguns segundos.

**Why this priority**: Esta é a experiência principal do usuário final e o objetivo central da feature - criar senso de urgência e validação social para incentivar a entrada no grupo.

**Independent Test**: Pode ser testado acessando uma página `/w/[slug]` com a configuração habilitada e observando se a notificação aparece e desaparece automaticamente.

**Acceptance Scenarios**:

1. **Given** uma página de WhatsApp com notificações habilitadas, **When** um visitante acessa a página, **Then** uma notificação com nome e cidade aleatórios aparece após alguns segundos.
2. **Given** uma notificação está sendo exibida, **When** o tempo de exibição termina, **Then** a notificação desaparece suavemente da tela.
3. **Given** uma página de WhatsApp com notificações desabilitadas, **When** um visitante acessa a página, **Then** nenhuma notificação de prova social é exibida.

---

### User Story 3 - Exibição contínua de notificações (Priority: P2)

O visitante permanece na página de redirecionamento e, após a primeira notificação desaparecer, novas notificações continuam aparecendo em intervalos regulares enquanto ele permanece na página, sempre com nomes e cidades diferentes.

**Why this priority**: Melhora a experiência de prova social contínua, mas não é essencial para o MVP. A funcionalidade básica pode existir com apenas uma notificação.

**Independent Test**: Pode ser testado permanecendo na página por mais de um ciclo de notificação e observando se novas notificações aparecem.

**Acceptance Scenarios**:

1. **Given** o visitante está na página com notificações habilitadas, **When** a primeira notificação desaparece, **Then** uma nova notificação com dados diferentes aparece após um intervalo.
2. **Given** múltiplas notificações foram exibidas, **When** uma nova notificação aparece, **Then** ela exibe um nome e cidade diferentes das anteriores recentes.

---

### Edge Cases

- O que acontece quando a página é carregada em um dispositivo com JavaScript desabilitado? (A página funciona normalmente, apenas sem as notificações)
- Como o sistema se comporta quando a configuração é alterada enquanto usuários estão na página? (As novas configurações só afetam novos carregamentos)
- O que acontece em telas muito pequenas? (A notificação deve ser responsiva e legível)
- O que acontece se o administrador tentar configurar um intervalo fora dos limites? (Sistema impede o salvamento e exibe mensagem de validação)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir uma notificação no canto inferior da tela com mensagem no formato "[Nome] de [Cidade] acabou de entrar no grupo!"
- **FR-002**: Sistema DEVE selecionar nomes e cidades aleatórios de listas predefinidas para cada notificação
- **FR-003**: Sistema DEVE exibir a notificação por um período fixo (3-5 segundos) antes de fazê-la desaparecer
- **FR-004**: Sistema DEVE permitir que o administrador habilite ou desabilite as notificações por página de WhatsApp
- **FR-005**: Sistema DEVE apresentar a opção de notificações desabilitada por padrão ao criar novas páginas
- **FR-006**: Sistema DEVE aplicar animação de entrada e saída na notificação para transição suave
- **FR-007**: Sistema DEVE continuar exibindo novas notificações em intervalos configuráveis enquanto o visitante permanece na página
- **FR-008**: Sistema DEVE garantir que nomes/cidades não se repitam consecutivamente nas notificações
- **FR-009**: Sistema DEVE armazenar a configuração de habilitação junto aos dados existentes da página WhatsApp
- **FR-010**: Sistema DEVE permitir que o administrador configure o intervalo entre notificações (em segundos), com valor padrão de 10 segundos
- **FR-011**: Sistema DEVE validar que o intervalo configurado esteja entre 5 e 60 segundos

### Key Entities

- **WhatsAppPage (extensão)**: Adiciona atributos `socialProofEnabled` (booleano) e `socialProofInterval` (número em segundos) aos dados existentes da página de WhatsApp
- **Notificação de Prova Social**: Componente visual temporário contendo nome aleatório e cidade aleatória

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administrador consegue habilitar/desabilitar notificações em menos de 10 segundos
- **SC-002**: Notificação aparece e desaparece corretamente em todas as páginas com a funcionalidade habilitada
- **SC-003**: Tempo entre aparição e desaparecimento da notificação está entre 3 e 5 segundos
- **SC-004**: Notificações continuam aparecendo enquanto o visitante permanece na página
- **SC-005**: Interface de configuração é clara e não requer explicação adicional para o administrador
- **SC-006**: Notificação é legível e visualmente agradável em dispositivos móveis e desktop

## Clarifications

### Session 2026-01-03

- Q: O intervalo entre notificações deve ser configurável pelo administrador? → A: Sim, o administrador pode selecionar o tempo que desejar
- Q: Qual deve ser o intervalo padrão entre as notificações? → A: 8-10 segundos (equilibrado entre atividade e não ser intrusivo)
- Q: Quais devem ser os limites mínimo e máximo para o intervalo? → A: 5-60 segundos
- Q: Onde a notificação deve aparecer na tela? → A: Canto inferior (menos intrusivo, padrão toast)

## Assumptions

- Listas de nomes e cidades brasileiros comuns serão definidas no código (hardcoded), não configuráveis pelo administrador
- A posição da notificação será fixa no canto inferior da tela (não configurável)
- Apenas páginas de WhatsApp (`/w/[slug]`) terão esta funcionalidade, não as páginas de transição (`/t/[slug]`)
