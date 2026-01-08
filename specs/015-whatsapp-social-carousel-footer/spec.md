# Feature Specification: WhatsApp Social Proof Carousel & Custom Footer

**Feature Branch**: `015-whatsapp-social-carousel-footer`
**Created**: 2026-01-07
**Status**: Draft
**Input**: User description: "crie uma nova feature para pagina de whatsapp que é um carrosel de provas sociais podem ser imagens ou apenas texto escrito, se for apenas texto deve ter o campo de descricao da prova, autor e cidade da prova social. Também criar uma feature de footer da pagina que é personalizada com o texto que quiser."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Creates Text-Based Social Proof (Priority: P1)

O administrador deseja adicionar provas sociais em formato de texto para aumentar a credibilidade da página de WhatsApp, incluindo depoimentos de clientes com descrição, autor e cidade.

**Why this priority**: Provas sociais em texto são a forma mais comum e rápida de adicionar credibilidade. Não requerem upload de imagens e podem ser criadas imediatamente pelo admin.

**Independent Test**: Pode ser testado criando uma prova social de texto no admin e verificando se aparece corretamente no carrossel da página `/w/[slug]`.

**Acceptance Scenarios**:

1. **Given** o admin está na página de edição de uma página WhatsApp, **When** ele adiciona uma prova social de texto com descrição "Entrei no grupo e já ganhei 3 cupons!", autor "Maria Silva" e cidade "São Paulo", **Then** a prova é salva e exibida no carrossel da página pública.

2. **Given** o admin criou múltiplas provas sociais de texto, **When** um visitante acessa a página `/w/[slug]`, **Then** as provas são exibidas em um carrossel que permite navegação entre elas.

3. **Given** o admin está editando uma prova social existente, **When** ele altera o texto da descrição, **Then** a alteração é refletida imediatamente na página pública.

---

### User Story 2 - Admin Creates Image-Based Social Proof (Priority: P2)

O administrador deseja adicionar provas sociais em formato de imagem (screenshots de depoimentos, prints de conversas, etc.) para mostrar evidências visuais.

**Why this priority**: Imagens são mais impactantes visualmente, mas dependem de URLs externas. É o segundo tipo mais usado após texto.

**Independent Test**: Pode ser testado adicionando uma URL de imagem no admin e verificando se a imagem é exibida corretamente no carrossel.

**Acceptance Scenarios**:

1. **Given** o admin está na página de edição de uma página WhatsApp, **When** ele adiciona uma prova social de imagem com URL válida, **Then** a imagem é salva e exibida no carrossel da página pública.

2. **Given** uma prova social de imagem foi adicionada, **When** um visitante visualiza o carrossel, **Then** a imagem é exibida com proporções adequadas e responsivas.

3. **Given** o admin fornece uma URL de imagem inválida ou inacessível, **When** a página é renderizada, **Then** um placeholder ou fallback visual é exibido no lugar da imagem.

---

### User Story 3 - Visitor Navigates Social Proof Carousel (Priority: P1)

O visitante da página de WhatsApp deseja ver múltiplas provas sociais navegando pelo carrossel para se convencer a entrar no grupo.

**Why this priority**: A experiência de navegação do carrossel é essencial para que as provas sociais tenham impacto. Sem navegação adequada, as provas não serão vistas.

**Independent Test**: Pode ser testado acessando uma página com múltiplas provas sociais e navegando entre elas usando os controles do carrossel.

**Acceptance Scenarios**:

1. **Given** uma página tem 5 provas sociais cadastradas, **When** o visitante acessa a página, **Then** o carrossel exibe a primeira prova e indicadores visuais mostram que há mais conteúdo.

2. **Given** o visitante está visualizando uma prova social, **When** ele clica no botão de próximo ou desliza (swipe em mobile), **Then** a próxima prova é exibida com animação suave.

3. **Given** o visitante está na última prova social, **When** ele tenta avançar, **Then** o carrossel volta para a primeira prova (loop infinito).

4. **Given** o carrossel está configurado com auto-play, **When** o visitante não interage por alguns segundos, **Then** o carrossel avança automaticamente para a próxima prova.

---

### User Story 4 - Admin Configures Custom Footer (Priority: P2)

O administrador deseja adicionar um rodapé personalizado na página de WhatsApp com texto customizado (avisos legais, informações de contato, créditos, etc.).

**Why this priority**: O footer complementa a página mas não é essencial para a conversão. É importante para compliance e branding, mas secundário às provas sociais.

**Independent Test**: Pode ser testado adicionando texto de footer no admin e verificando se aparece no final da página `/w/[slug]`.

**Acceptance Scenarios**:

1. **Given** o admin está editando uma página WhatsApp, **When** ele preenche o campo de footer com "Este grupo é exclusivo para membros. Dúvidas: contato@exemplo.com", **Then** o texto é exibido no rodapé da página pública.

2. **Given** o admin deixa o campo de footer vazio, **When** a página é renderizada, **Then** nenhum rodapé é exibido (o componente não aparece).

3. **Given** o admin inclui texto longo no footer, **When** a página é renderizada, **Then** o texto é exibido respeitando quebras de linha e com tamanho de fonte adequado para leitura.

---

### User Story 5 - Admin Manages Social Proof Order (Priority: P3)

O administrador deseja reordenar as provas sociais para controlar qual aparece primeiro no carrossel.

**Why this priority**: A ordem das provas impacta a primeira impressão, mas o sistema funciona mesmo sem reordenação. É um refinamento de usabilidade.

**Independent Test**: Pode ser testado alterando a ordem das provas no admin e verificando se a nova ordem é refletida no carrossel.

**Acceptance Scenarios**:

1. **Given** o admin tem 3 provas sociais cadastradas, **When** ele arrasta a terceira prova para a primeira posição, **Then** a ordem é atualizada e a página pública reflete a nova ordem.

2. **Given** o admin reordenou as provas, **When** ele salva as alterações, **Then** a nova ordem é persistida e mantida após recarregar a página.

---

### Edge Cases

- O que acontece quando nenhuma prova social é cadastrada? O carrossel não é exibido.
- O que acontece quando apenas uma prova social existe? O carrossel exibe sem controles de navegação (ou com navegação desabilitada).
- O que acontece quando a URL de uma imagem retorna 404? Exibe um placeholder visual indicando erro de carregamento.
- O que acontece quando o texto da descrição é muito longo? O texto é truncado com ellipsis ou exibido com scroll dentro do card.
- O que acontece quando o footer contém caracteres especiais ou emojis? São renderizados corretamente.
- O que acontece em dispositivos móveis com tela pequena? O carrossel adapta o tamanho e suporta gestos de swipe.

## Requirements *(mandatory)*

### Functional Requirements

#### Social Proof Carousel

- **FR-001**: Sistema DEVE permitir criar provas sociais em dois formatos: texto ou imagem.
- **FR-002**: Para provas sociais de texto, sistema DEVE armazenar: descrição (obrigatório, 1-500 caracteres), autor (obrigatório, 1-100 caracteres), e cidade (obrigatório, 1-100 caracteres).
- **FR-003**: Para provas sociais de imagem, sistema DEVE armazenar: URL da imagem (obrigatório, HTTPS).
- **FR-004**: Sistema DEVE permitir cadastrar até 10 provas sociais por página WhatsApp.
- **FR-005**: Sistema DEVE exibir as provas sociais em formato de carrossel na página `/w/[slug]`.
- **FR-006**: Carrossel DEVE suportar navegação manual (botões anterior/próximo e indicadores de posição).
- **FR-007**: Carrossel DEVE suportar navegação por gestos de swipe em dispositivos touch.
- **FR-008**: Carrossel DEVE ter comportamento de loop infinito (após última prova, volta para primeira).
- **FR-009**: Sistema DEVE permitir ativar/desativar auto-play do carrossel (intervalo padrão: 5 segundos).
- **FR-010**: Sistema DEVE permitir reordenar provas sociais via drag-and-drop no admin.
- **FR-011**: Sistema DEVE permitir editar e excluir provas sociais existentes.
- **FR-012**: Para imagens com erro de carregamento, sistema DEVE exibir placeholder visual.

#### Custom Footer

- **FR-013**: Sistema DEVE permitir configurar texto de footer personalizado por página WhatsApp (0-500 caracteres).
- **FR-014**: Footer DEVE ser exibido na parte inferior da página `/w/[slug]`, após todos os outros elementos.
- **FR-015**: Se campo de footer estiver vazio, nenhum componente de footer é renderizado.
- **FR-016**: Footer DEVE suportar quebras de linha (multiline).
- **FR-017**: Footer DEVE ter estilo visual discreto (fonte menor, cor secundária) para não competir com CTAs.

#### Admin Interface

- **FR-018**: Painel admin DEVE exibir lista de provas sociais cadastradas com preview.
- **FR-019**: Painel admin DEVE permitir alternar entre tipo texto e imagem ao criar prova social.
- **FR-020**: Painel admin DEVE exibir preview do carrossel em tempo real durante edição.
- **FR-021**: Painel admin DEVE ter campo de textarea para footer com contador de caracteres.

### Key Entities

- **SocialProofItem**: Representa uma prova social individual. Atributos: id (identificador único), tipo (text/image), e conteúdo variável por tipo. Para imagem: imageUrl. Para texto: description, author, city. Possui ordem de exibição no carrossel.
- **WhatsAppPageRecord** (extensão): Campos adicionais: socialProofCarouselItems (array de SocialProofItem), carouselAutoPlay (boolean), carouselInterval (segundos), footerText (string opcional).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Administradores conseguem criar uma prova social (texto ou imagem) em menos de 1 minuto.
- **SC-002**: O carrossel carrega e exibe a primeira prova social em menos de 2 segundos após abertura da página.
- **SC-003**: 100% das provas sociais cadastradas são exibidas corretamente no carrossel na ordem definida.
- **SC-004**: Navegação do carrossel (botões e swipe) responde em menos de 300ms.
- **SC-005**: Footer personalizado é renderizado corretamente em 100% dos dispositivos testados (mobile e desktop).
- **SC-006**: Taxa de interação com o carrossel (cliques em navegação) é mensurável e rastreável.
- **SC-007**: Sistema suporta páginas com 0 a 10 provas sociais sem degradação de performance.

## Assumptions

- URLs de imagem são fornecidas pelo admin (não há upload direto de arquivos neste momento).
- O carrossel será posicionado após a seção de social proofs existente (lista de strings) e antes dos benefit cards, ou substituirá a seção existente de social proofs.
- O footer será o último elemento da página, após todos os outros componentes.
- Auto-play do carrossel é desabilitado por padrão para não distrair o usuário do CTA principal.
- O intervalo de auto-play padrão (5 segundos) pode ser configurável entre 3-15 segundos.
- Imagens devem ter largura máxima responsiva e altura proporcional, mantendo aspect ratio.
- O sistema existente de social proofs (array de strings) continuará funcionando em paralelo ou será migrado para o novo formato.
