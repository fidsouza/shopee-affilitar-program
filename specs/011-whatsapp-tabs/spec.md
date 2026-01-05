# Feature Specification: Abas de Gatilhos e Pixel para WhatsApp

**Feature Branch**: `011-whatsapp-tabs`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "Criar novas abas em páginas de WhatsApp: aba Gatilhos com Benefits Cards e Social Proof, e aba Pixel para configurações de Pixel, Evento do Redirect, Eventos ao carregar e Tempo de Redirect"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar Gatilhos de Conversão (Priority: P1)

O administrador acessa a página de edição de uma página WhatsApp e deseja configurar elementos visuais que incentivam o usuário a clicar no botão do WhatsApp. Ele navega até a aba "Gatilhos" onde encontra as configurações de Benefit Cards (cartões de benefícios) e Social Proof (notificações de prova social).

**Why this priority**: Os gatilhos de conversão são elementos cruciais para aumentar a taxa de conversão da página. Agrupar esses recursos em uma aba dedicada melhora a experiência do administrador ao configurar estratégias de marketing.

**Independent Test**: Pode ser testado criando uma página WhatsApp, navegando até a aba "Gatilhos", configurando benefit cards e social proof, salvando e verificando que as configurações aparecem corretamente na página pública.

**Acceptance Scenarios**:

1. **Given** o administrador está editando uma página WhatsApp, **When** ele clica na aba "Gatilhos", **Then** ele vê as seções de Benefit Cards e Social Proof com todos os controles de configuração.

2. **Given** o administrador configurou 3 benefit cards na aba "Gatilhos", **When** ele salva a página e acessa a URL pública, **Then** os 3 benefit cards são exibidos corretamente com emoji, título e descrição.

3. **Given** o administrador habilitou Social Proof com intervalo de 15 segundos, **When** ele salva e acessa a página pública, **Then** as notificações de prova social aparecem a cada 15 segundos.

---

### User Story 2 - Configurar Rastreamento de Pixel (Priority: P1)

O administrador precisa configurar o rastreamento do Meta Pixel para monitorar conversões. Ele navega até a aba "Pixel" onde pode selecionar o pixel configurado, definir eventos que disparam ao carregar a página, o evento que dispara no redirect, e o tempo de delay antes do redirect.

**Why this priority**: O rastreamento de pixel é fundamental para medir o ROI das campanhas de marketing. Uma aba dedicada facilita a gestão dessas configurações técnicas de forma organizada.

**Independent Test**: Pode ser testado selecionando um pixel existente, configurando eventos de carregamento e redirect, definindo o tempo de delay, salvando e verificando que os eventos disparam corretamente no Meta Pixel.

**Acceptance Scenarios**:

1. **Given** o administrador está editando uma página WhatsApp, **When** ele clica na aba "Pixel", **Then** ele vê os campos: seletor de Pixel, Eventos ao Carregar, Evento do Redirect, e Tempo de Redirect.

2. **Given** o administrador selecionou um pixel e marcou "PageView" e "ViewContent" como eventos ao carregar, **When** um usuário acessa a página pública, **Then** ambos os eventos são disparados para o Meta Pixel.

3. **Given** o administrador configurou "Lead" como evento do redirect e 8 segundos de delay, **When** o usuário clica no botão WhatsApp, **Then** o evento "Lead" é disparado e após 8 segundos o usuário é redirecionado.

---

### User Story 3 - Reorganização Visual das Abas (Priority: P2)

O administrador visualiza a interface reorganizada com três abas: "Geral" (informações básicas), "Gatilhos" (conversão) e "Pixel" (rastreamento). Esta separação lógica facilita a navegação e gestão das configurações.

**Why this priority**: A reorganização melhora a usabilidade, mas não adiciona funcionalidade nova - apenas move recursos existentes para locais mais intuitivos.

**Independent Test**: Pode ser testado verificando que cada aba contém apenas os campos relevantes à sua categoria e que todas as configurações são preservadas ao alternar entre abas.

**Acceptance Scenarios**:

1. **Given** o administrador abre o formulário de uma página WhatsApp, **When** a página carrega, **Then** ele vê três abas: "Geral", "Gatilhos" e "Pixel".

2. **Given** o administrador preencheu campos em todas as abas, **When** ele alterna entre as abas sem salvar, **Then** os dados preenchidos são mantidos em cada aba.

3. **Given** o administrador está na aba "Geral", **When** ele visualiza os campos disponíveis, **Then** ele vê apenas: Headline, URL da Foto do Header, Texto do Botão, URL do WhatsApp, e Provas Sociais (texto).

---

### Edge Cases

- O que acontece quando o administrador não seleciona nenhum pixel? O sistema permite salvar com rastreamento desabilitado.
- O que acontece quando o administrador configura benefit cards mas não salva e muda de aba? Os dados são preservados no estado do formulário.
- Como o sistema lida quando o pixel selecionado é deletado? O campo fica em branco e o administrador é alertado ao salvar.
- O que acontece se o tempo de redirect for configurado como 0? O sistema valida um mínimo de 1 segundo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir três abas no formulário de páginas WhatsApp: "Geral", "Gatilhos" e "Pixel".

- **FR-002**: Aba "Geral" DEVE conter os campos: Headline, URL da Foto do Header, Texto do Botão, URL do WhatsApp, e Provas Sociais (textarea de textos separados por linha).

- **FR-003**: Aba "Gatilhos" DEVE conter a seção de Benefit Cards com: lista de até 8 cartões (emoji, título, descrição), controle de tamanho do emoji, e botões de ordenação.

- **FR-004**: Aba "Gatilhos" DEVE conter a seção de Social Proof com: toggle de habilitação, slider de intervalo (5-60 segundos), e prévia do comportamento.

- **FR-005**: Aba "Pixel" DEVE conter: dropdown de seleção de pixel, checkboxes de eventos ao carregar, dropdown/radio de evento do redirect, e input numérico de tempo de redirect.

- **FR-006**: Sistema DEVE preservar os dados de todas as abas no estado do formulário ao alternar entre abas.

- **FR-007**: Sistema DEVE validar que o tempo de redirect está entre 1 e 30 segundos.

- **FR-008**: Sistema DEVE permitir seleção múltipla de eventos ao carregar (PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase, AddPaymentInfo, CompleteRegistration).

- **FR-009**: Sistema DEVE permitir seleção única de evento do redirect dentre os eventos padrão do Meta.

- **FR-010**: Sistema DEVE manter compatibilidade com páginas existentes, migrando campos para as novas abas sem perda de dados.

### Key Entities

- **WhatsAppPage**: Entidade existente que armazena todas as configurações da página, incluindo campos de gatilhos (benefitCards, socialProofEnabled, socialProofInterval) e pixel (pixelConfigId, events, redirectEvent, redirectDelay).

- **PixelConfig**: Entidade existente que representa uma configuração de pixel (id, label, pixelId, defaultEvents).

- **BenefitCard**: Sub-entidade que representa um cartão de benefício (emoji, título, descrição opcional).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores conseguem localizar e configurar gatilhos de conversão em menos de 30 segundos após abrir o formulário.

- **SC-002**: 100% das páginas WhatsApp existentes continuam funcionando após a atualização, sem necessidade de reconfiguração manual.

- **SC-003**: Administradores completam a configuração completa de uma página (geral + gatilhos + pixel) em uma única sessão de edição.

- **SC-004**: Eventos do Meta Pixel são disparados corretamente em 100% dos acessos às páginas públicas.

- **SC-005**: Mudanças de aba não causam perda de dados em nenhum campo do formulário.

## Assumptions

- O sistema de abas existente (shadcn/ui Tabs) será reutilizado para as novas abas.
- Os campos de Benefit Cards e Social Proof existentes serão movidos para a aba "Gatilhos" sem alteração de funcionalidade.
- Os campos de Pixel existentes serão movidos para a aba "Pixel" sem alteração de funcionalidade.
- A aba "Geral" será a aba padrão exibida ao abrir o formulário.
- O modelo de dados (WhatsAppPageRecord) não será alterado, apenas a organização visual dos campos no formulário.

## Out of Scope

- Criação de novos tipos de gatilhos além de Benefit Cards e Social Proof.
- Alterações na lógica de disparo de eventos do Meta Pixel.
- Criação de novas entidades ou alterações no modelo de dados.
- Funcionalidades de prévia em tempo real das páginas públicas.
- Tradução da interface para outros idiomas.
