# Feature Specification: WhatsApp Redirect Page

**Feature Branch**: `003-whatsapp-redirect-page`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "Página de redirecionamento para WhatsApp com headline personalizável, provas sociais personalizáveis, botão personalizável e redirect automático para URL do grupo de WhatsApp"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Creates WhatsApp Redirect Page (Priority: P1)

O administrador acessa o painel admin e cria uma nova página de redirecionamento para WhatsApp, configurando headline, provas sociais, texto do botão e URL do grupo de WhatsApp.

**Why this priority**: Esta é a funcionalidade core que permite ao admin criar e gerenciar as páginas de redirecionamento. Sem ela, não há páginas para os visitantes acessarem.

**Independent Test**: Pode ser testado criando uma página completa no admin e verificando se todas as configurações são salvas corretamente.

**Acceptance Scenarios**:

1. **Given** o admin está logado no painel, **When** ele acessa a seção de páginas WhatsApp e clica em criar nova, **Then** o formulário de criação é exibido com todos os campos configuráveis, incluindo seleção múltipla de eventos e evento de redirecionamento
2. **Given** o admin preencheu todos os campos obrigatórios (incluindo pelo menos 1 evento e o evento de redirect), **When** ele salva a página, **Then** a página é criada com um slug único e fica disponível para acesso
3. **Given** o admin está editando uma página existente, **When** ele altera qualquer configuração e salva, **Then** as alterações são persistidas e refletidas na página pública
4. **Given** o admin está criando uma página, **When** ele visualiza o campo de eventos, **Then** ele pode selecionar múltiplos eventos Meta de uma lista de eventos disponíveis
5. **Given** o admin está criando uma página, **When** ele visualiza o campo de evento de redirecionamento, **Then** ele pode selecionar um único evento que será disparado antes do redirect

---

### User Story 2 - Visitor Views WhatsApp Redirect Page (Priority: P1)

O visitante acessa a página de redirecionamento através de um link compartilhado e visualiza a headline, provas sociais e o botão de ação antes de ser redirecionado automaticamente.

**Why this priority**: Esta é a experiência principal do usuário final e o propósito central da feature - converter visitantes em membros do grupo WhatsApp.

**Independent Test**: Pode ser testado acessando a URL da página criada e verificando se todos os elementos são exibidos corretamente e o redirecionamento ocorre.

**Acceptance Scenarios**:

1. **Given** uma página de WhatsApp está ativa com Pixel Config e eventos configurados, **When** um visitante acessa a URL `/w/[slug]`, **Then** ele visualiza a headline, provas sociais e botão configurados, E todos os eventos Meta selecionados são disparados (client-side e server-side)
2. **Given** o visitante está na página, **When** o tempo de countdown termina, **Then** o evento de redirecionamento (redirectEvent) é disparado E o visitante é automaticamente redirecionado para a URL do grupo WhatsApp
3. **Given** o visitante está na página, **When** ele clica no botão antes do redirecionamento automático, **Then** o evento de redirecionamento (redirectEvent) é disparado E ele é imediatamente redirecionado para a URL do grupo WhatsApp
4. **Given** o visitante já teve o evento de redirecionamento disparado (via clique ou countdown), **When** ocorre qualquer outra ação de redirecionamento, **Then** o evento de redirecionamento NÃO é disparado novamente (deduplicação)

---

### User Story 3 - Admin Manages Multiple WhatsApp Pages (Priority: P2)

O administrador visualiza, edita, ativa/desativa e remove páginas de WhatsApp existentes através do painel.

**Why this priority**: Gerenciamento de múltiplas páginas é importante para organização, mas depende da criação básica funcionar primeiro.

**Independent Test**: Pode ser testado criando múltiplas páginas e verificando as operações de listagem, edição e exclusão.

**Acceptance Scenarios**:

1. **Given** existem várias páginas de WhatsApp criadas, **When** o admin acessa a listagem, **Then** todas as páginas são exibidas com seus status e informações básicas
2. **Given** o admin está na listagem, **When** ele desativa uma página, **Then** a página não fica mais acessível publicamente
3. **Given** o admin está na listagem, **When** ele exclui uma página, **Then** a página é removida permanentemente

---

### Edge Cases

- O que acontece quando o visitante acessa uma página desativada ou inexistente? → Exibe página 404 com mensagem amigável
- O que acontece se a URL do WhatsApp estiver inválida ou expirada? → O redirecionamento ocorre normalmente (validação é responsabilidade do admin)
- O que acontece se o visitante desabilitar JavaScript? → O botão funciona como link direto, sem animações/countdown
- O que acontece se não houver Pixel Config associado? → Página funciona normalmente, apenas sem disparar eventos Meta

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir criar páginas de redirecionamento WhatsApp com slug único
- **FR-002**: Sistema DEVE permitir configurar headline (título) personalizável para cada página
- **FR-003**: Sistema DEVE permitir configurar provas sociais personalizáveis (texto de quantidade de membros, texto de avaliação, etc.)
- **FR-004**: Sistema DEVE permitir configurar o texto do botão de ação (ex: "Entrar no Grupo VIP")
- **FR-005**: Sistema DEVE armazenar a URL de destino do grupo WhatsApp (chat.whatsapp.com/*)
- **FR-006**: Sistema DEVE validar que a URL de destino é uma URL válida do WhatsApp
- **FR-007**: Sistema DEVE redirecionar automaticamente o visitante após um período configurável (padrão: 5 segundos)
- **FR-008**: Sistema DEVE permitir que o visitante clique no botão para redirecionamento imediato
- **FR-009**: Sistema DEVE exibir um countdown visual antes do redirecionamento automático
- **FR-010**: Sistema DEVE permitir listar todas as páginas de WhatsApp no painel admin
- **FR-011**: Sistema DEVE permitir editar páginas de WhatsApp existentes
- **FR-012**: Sistema DEVE permitir ativar/desativar páginas de WhatsApp
- **FR-013**: Sistema DEVE permitir excluir páginas de WhatsApp
- **FR-014**: Sistema DEVE gerar slugs únicos para cada página de WhatsApp
- **FR-015**: Sistema DEVE retornar 404 para páginas inexistentes ou desativadas
- **FR-016**: Sistema DEVE permitir configurar URL externa de foto circular para o header da página (ex: foto da criadora do grupo)
- **FR-017**: Sistema DEVE permitir associar um Pixel Config à página de WhatsApp (similar ao fluxo de produtos)
- **FR-018**: Sistema DEVE permitir seleção múltipla de eventos Meta para a página (mínimo 1 evento obrigatório)
- **FR-019**: Sistema DEVE disparar todos os eventos Meta selecionados tanto via client-side (fbq) quanto server-side (Conversion API), ao carregar a página
- **FR-020**: Sistema DEVE permitir configurar um evento principal (redirectEvent) que será disparado ANTES do redirecionamento
- **FR-021**: Sistema DEVE disparar o evento principal (redirectEvent) tanto via client-side quanto server-side, imediatamente antes do redirecionamento (seja por clique no botão ou por redirecionamento automático)
- **FR-022**: Sistema DEVE garantir que o evento principal só seja disparado uma vez por sessão do visitante (evitar duplicação)
- **FR-023**: Sistema DEVE exibir lista de eventos Meta disponíveis para seleção múltipla no formulário de criação/edição

### Key Entities

- **WhatsAppPage**: Representa uma página de redirecionamento para WhatsApp
  - id: Identificador único
  - slug: URL amigável para acesso público
  - headline: Título principal da página
  - headerImageUrl: URL da foto circular do header (opcional)
  - socialProofs: Lista de provas sociais (texto configurável)
  - buttonText: Texto do botão de ação
  - events: Lista de eventos Meta a serem disparados ao carregar a página (mínimo 1 obrigatório, ex: Lead, ViewContent, etc.)
  - redirectEvent: Evento Meta principal a ser disparado ANTES do redirecionamento (obrigatório, ex: CompleteRegistration, Lead, etc.)
  - whatsappUrl: URL de destino do grupo WhatsApp
  - pixelConfigId: Referência ao Pixel Config associado (opcional)
  - redirectDelay: Tempo em segundos antes do redirecionamento automático
  - status: Ativo/Inativo
  - createdAt, updatedAt: Timestamps

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores conseguem criar uma página de WhatsApp completa em menos de 2 minutos
- **SC-002**: Páginas de redirecionamento carregam em menos de 2 segundos
- **SC-003**: 100% dos cliques no botão resultam em redirecionamento bem-sucedido para a URL configurada
- **SC-004**: Redirecionamento automático ocorre exatamente no tempo configurado (±0.5 segundos)
- **SC-005**: Sistema suporta pelo menos 100 páginas de WhatsApp ativas simultaneamente

## Assumptions

- O padrão de URL para páginas públicas será `/w/[slug]` (similar ao `/t/[slug]` existente para produtos)
- O tempo padrão de redirecionamento automático será 5 segundos quando não especificado
- Provas sociais serão uma lista de textos simples configuráveis (ex: "+5.000 membros", "⭐ 4.9 de avaliação")
- A validação da URL do WhatsApp aceitará URLs no formato `https://chat.whatsapp.com/*` ou `https://wa.me/*`
- A página de redirecionamento seguirá o mesmo padrão visual das transition pages existentes

## Clarifications

### Session 2025-12-30

- Q: A página deve ter opção de adicionar foto? → A: Sim, foto circular no header (ex: foto da criadora do grupo)
- Q: Deve haver integração com Meta Pixel? → A: Sim, igual ao fluxo de criação de produtos (associar Pixel Config)
- Q: Qual evento Meta deve ser disparado no clique do botão? → A: Evento personalizável (admin escolhe qualquer evento Meta disponível)
- Q: Como a foto do header deve ser armazenada/fornecida? → A: URL externa (admin fornece link de imagem já hospedada)
- Q: Quando o evento Meta deve ser disparado? → A: No clique do botão E no redirecionamento automático (ambos os caminhos)
- Q: Deve disparar PageView ao carregar a página? → A: Não, apenas o evento configurado no momento do redirecionamento
- Q: O que acontece se não houver Pixel Config associado? → A: Funciona normalmente, apenas sem disparar eventos Meta
- Q: O que acontece se o admin não selecionar um evento Meta? → A: Evento é obrigatório - admin deve selecionar um evento ao criar a página

### Session 2025-12-31 (Atualização - Múltiplos Eventos)

- Q: Deve ser possível selecionar múltiplos eventos para a página? → A: Sim, admin pode selecionar múltiplos eventos que serão disparados ao carregar a página
- Q: Como funcionam os eventos ao carregar a página? → A: Todos os eventos selecionados na lista `events` são disparados ao carregar a página (client-side e server-side)
- Q: E o evento no momento do redirecionamento? → A: Existe um campo separado `redirectEvent` para o evento principal que é disparado ANTES do redirecionamento (clique ou automático)
- Q: O evento de redirect pode ser o mesmo de um evento da lista? → A: Sim, pode ser qualquer evento Meta disponível, independente da lista de eventos
- Q: Como evitar duplicação do evento de redirect? → A: O sistema deve garantir que o redirectEvent só seja disparado uma vez por sessão do visitante
- Q: Qual a diferença entre `events` e `redirectEvent`? → A: `events` são disparados ao carregar a página (ex: ViewContent, Lead), `redirectEvent` é disparado apenas antes do redirecionamento (ex: CompleteRegistration)
