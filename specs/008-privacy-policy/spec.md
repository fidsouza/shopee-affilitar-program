# Feature Specification: Página de Política de Privacidade para Lead Ads

**Feature Branch**: `008-privacy-policy`
**Created**: 2026-01-04
**Status**: Draft
**Input**: Criar página de política de privacidade para campanhas de anúncios de leads no formulário instantâneo do Facebook Ads (Meta Ads)

## Clarifications

### Session 2026-01-04

- Q: Onde a configuração de personalização do texto/caixa será armazenada e vinculada? → A: Configuração global aplicada apenas às páginas de WhatsApp (/w/[slug])
- Q: Quais propriedades de estilo da caixa serão configuráveis? → A: Mínimo - cor de fundo e toggle de borda (sim/não)
- Q: Qual o texto padrão quando o administrador não personaliza? → A: Manter texto atual das páginas /w/ ("Redirecionando...")
- Q: Onde gerenciar essa configuração global no painel administrativo? → A: Na seção existente /parametrizacao/whatsapp (nova aba ou card de "Aparência")
- Q: Qual a cor da borda quando o toggle está ativado? → A: Cor fixa pré-definida (ex: cinza claro #e5e7eb)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualização da Política de Privacidade (Priority: P1)

Como visitante que clicou em um anúncio de lead do Facebook/Meta, preciso acessar uma página de política de privacidade clara e completa para entender como meus dados serão tratados antes de preencher o formulário de lead.

**Why this priority**: Esta é a funcionalidade core e obrigatória - sem uma página de política de privacidade acessível, as campanhas de lead ads não podem ser executadas legalmente e não atendem aos requisitos do Meta.

**Independent Test**: Pode ser testado acessando a URL da política de privacidade diretamente e verificando se todo o conteúdo é exibido corretamente e está legível.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a URL da política de privacidade, **When** a página carrega, **Then** o conteúdo completo da política é exibido de forma legível e bem formatada
2. **Given** um visitante está no formulário instantâneo do Meta, **When** ele clica no link da política de privacidade, **Then** ele é redirecionado para a página da política de privacidade
3. **Given** um visitante está visualizando a política, **When** ele lê o conteúdo, **Then** todas as seções obrigatórias estão presentes (coleta de dados, uso, compartilhamento, direitos do titular)

---

### User Story 2 - Responsividade Mobile (Priority: P1)

Como visitante acessando pelo celular através do Facebook/Instagram, preciso que a página de política de privacidade seja perfeitamente legível no meu dispositivo móvel.

**Why this priority**: A grande maioria dos acessos ao Facebook/Instagram é via mobile. Se a página não for responsiva, os visitantes não conseguirão ler a política adequadamente.

**Independent Test**: Pode ser testado acessando a página em diferentes tamanhos de tela e verificando a legibilidade e usabilidade.

**Acceptance Scenarios**:

1. **Given** um visitante acessa a página pelo celular, **When** a página carrega, **Then** o texto é legível sem necessidade de zoom horizontal
2. **Given** um visitante está em um tablet, **When** a página carrega, **Then** o layout se adapta adequadamente ao tamanho da tela
3. **Given** um visitante muda a orientação do dispositivo, **When** gira o celular, **Then** o layout se ajusta automaticamente

---

### User Story 3 - Navegação e Acessibilidade (Priority: P2)

Como visitante da página de política de privacidade, preciso navegar facilmente entre as seções do documento para encontrar as informações específicas que procuro.

**Why this priority**: Uma política de privacidade pode ser extensa, então facilitar a navegação melhora a experiência do usuário e aumenta a confiança.

**Independent Test**: Pode ser testado navegando pelo índice (se houver) e verificando se os links âncora funcionam corretamente.

**Acceptance Scenarios**:

1. **Given** um visitante está na página de política, **When** ele visualiza o topo da página, **Then** existe um índice ou estrutura clara das seções
2. **Given** um visitante quer encontrar informações sobre compartilhamento de dados, **When** ele procura essa seção, **Then** a seção é facilmente identificável através de títulos claros

---

### User Story 4 - Personalização Visual das Páginas de WhatsApp (Priority: P2)

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

- O que acontece quando a página é acessada por um bot ou crawler? A página deve ser indexável para SEO básico.
- Como o sistema lida com acessos de diferentes países? O conteúdo permanece em português brasileiro.
- O que acontece se o visitante tentar imprimir a página? O layout deve ser adequado para impressão.
- O que acontece se a configuração de aparência do WhatsApp estiver corrompida ou ausente? O sistema usa valores padrão (texto "Redirecionando...", sem borda, sem cor de fundo).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir uma página de política de privacidade acessível via URL pública (ex: /politica-de-privacidade ou /privacy-policy)
- **FR-002**: Sistema DEVE apresentar o conteúdo da política de forma estruturada com seções claramente identificadas
- **FR-003**: A página DEVE conter as seguintes seções obrigatórias para conformidade com LGPD e requisitos do Meta:
  - Identificação do controlador de dados (nome da empresa/pessoa responsável)
  - Quais dados pessoais são coletados
  - Como os dados são coletados (formulário de lead)
  - Finalidade do tratamento dos dados
  - Base legal para o tratamento (consentimento)
  - Com quem os dados podem ser compartilhados
  - Período de retenção dos dados
  - Direitos do titular dos dados (acesso, correção, exclusão, portabilidade)
  - Como exercer os direitos (canal de contato)
  - Informações sobre cookies (se aplicável)
  - Data da última atualização
- **FR-004**: A página DEVE ser totalmente responsiva e legível em dispositivos móveis
- **FR-005**: A página DEVE ter um tempo de carregamento rápido para não prejudicar a experiência do usuário vindo do anúncio
- **FR-006**: O conteúdo DEVE estar em português brasileiro
- **FR-007**: A página DEVE incluir informações de contato para que o titular possa exercer seus direitos (email ou formulário)
- **FR-008**: Sistema DEVE exibir a data da última atualização da política de forma visível

#### Personalização Visual das Páginas WhatsApp

- **FR-009**: Sistema DEVE permitir ao administrador personalizar o texto de redirecionamento das páginas /w/[slug] através de configuração global
- **FR-010**: Sistema DEVE permitir ao administrador configurar cor de fundo da caixa de texto (input de cor ou campo hexadecimal)
- **FR-011**: Sistema DEVE permitir ao administrador ativar/desativar borda na caixa de texto via toggle (sim/não)
- **FR-012**: Quando borda ativada, sistema DEVE exibir borda com cor fixa cinza claro (#e5e7eb)
- **FR-013**: Sistema DEVE exibir texto padrão "Redirecionando..." quando nenhuma personalização for configurada
- **FR-014**: Interface de configuração DEVE estar localizada em /parametrizacao/whatsapp (seção ou card de "Aparência")
- **FR-015**: Configurações de aparência DEVEM ser aplicadas globalmente a todas as páginas /w/[slug]

### Key Entities

- **Política de Privacidade**: Documento legal contendo todas as informações sobre tratamento de dados pessoais, estruturado em seções temáticas
- **Controlador de Dados**: Informações sobre a entidade responsável pelo tratamento dos dados (nome, CNPJ se aplicável, contato)
- **Seções da Política**: Divisões lógicas do documento (Coleta, Uso, Compartilhamento, Direitos, Contato, etc.)
- **WhatsAppAppearanceConfig**: Configuração global de aparência das páginas de WhatsApp contendo: texto de redirecionamento (string), cor de fundo (string hexadecimal, opcional), borda habilitada (boolean)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A página de política de privacidade carrega completamente em menos de 3 segundos em conexão 3G
- **SC-002**: 100% do conteúdo é legível em telas a partir de 320px de largura sem scroll horizontal
- **SC-003**: Todas as 11 seções obrigatórias (conforme FR-003) estão presentes e visíveis na página
- **SC-004**: A página atende aos requisitos de política de privacidade do Meta para campanhas de lead ads
- **SC-005**: Visitantes conseguem encontrar informações de contato para exercer seus direitos em menos de 30 segundos de navegação
- **SC-006**: Administrador consegue personalizar texto e aparência da caixa em menos de 1 minuto através da interface /parametrizacao/whatsapp
- **SC-007**: Alterações de aparência são refletidas em todas as páginas /w/[slug] imediatamente após salvar

## Assumptions

- O conteúdo da política de privacidade será estático (não requer sistema de gerenciamento de conteúdo ou admin)
- As informações do controlador de dados (nome, contato) serão definidas durante a implementação
- A política segue as melhores práticas da LGPD (Lei Geral de Proteção de Dados) brasileira
- Os dados coletados através dos formulários de lead do Meta incluem: nome, email, telefone (campos típicos de lead ads)
- O período de retenção dos dados será definido como padrão razoável (ex: enquanto houver relacionamento comercial ou conforme exigência legal)
- A página será acessível sem necessidade de autenticação
- A empresa não realiza transferência internacional de dados (caso contrário, precisaria de seção específica)
- A configuração de aparência das páginas WhatsApp será armazenada no Edge Config seguindo o padrão existente do projeto
