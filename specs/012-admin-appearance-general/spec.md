# Feature Specification: Aparência Global na Aba Geral e Remoção de Bordas Duplicadas

**Feature Branch**: `012-admin-appearance-general`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "Mover Aparência Global para a aba Geral e ajustar bordas duplicadas dos componentes de administração"

## Clarifications

### Session 2026-01-05

- Q: Qual estratégia de remoção de bordas deve ser aplicada às páginas de Produtos e Pixels? → A: Remover bordas de ambos (container e items), deixando apenas o wrapper do layout com borda

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar Aparência Global na Aba Geral (Priority: P1)

O administrador acessa a página de configuração de WhatsApp (`/parametrizacao/whatsapp`) e encontra as configurações de Aparência Global dentro da aba "Geral", junto com as outras configurações gerais da página. Isso permite uma experiência mais integrada onde todas as configurações básicas estão em um único local.

**Why this priority**: Centralizar todas as configurações gerais em uma única aba melhora a usabilidade e reduz a carga cognitiva do administrador, que não precisa mais procurar configurações em seções separadas da página.

**Independent Test**: Pode ser testado acessando `/parametrizacao/whatsapp`, clicando na aba "Geral" e verificando que os campos de Aparência Global (Texto de Redirecionamento, Cor de Fundo, Borda) estão presentes e funcionais.

**Acceptance Scenarios**:

1. **Given** o administrador está na página `/parametrizacao/whatsapp`, **When** ele clica na aba "Geral", **Then** ele visualiza os campos de Aparência Global (Texto de Redirecionamento, Cor de Fundo, toggle de Borda) integrados aos outros campos da aba
2. **Given** o administrador edita os campos de Aparência Global na aba Geral, **When** ele salva as alterações, **Then** as configurações são persistidas corretamente e aplicadas a todas as páginas de redirect

---

### User Story 2 - Interface Visual Limpa sem Bordas Duplicadas em Todas as Páginas Admin (Priority: P1)

O administrador visualiza todas as páginas de administração (WhatsApp, Produtos, Pixels) com uma aparência visual limpa, onde os componentes não apresentam bordas duplicadas ou aninhadas. Apenas o wrapper principal do layout possui borda, e os containers/items internos não possuem bordas adicionais.

**Why this priority**: Bordas duplicadas prejudicam a experiência visual e dão uma impressão de falta de polimento na interface. Isso afeta diretamente a percepção de qualidade do sistema em todas as áreas administrativas.

**Independent Test**: Pode ser testado visualmente acessando cada página admin (`/parametrizacao/whatsapp`, `/parametrizacao/products`, `/parametrizacao/pixels`) e verificando que não existem bordas duplicadas.

**Acceptance Scenarios**:

1. **Given** o administrador está na página `/parametrizacao/whatsapp`, **When** ele visualiza qualquer aba (Geral, Gatilhos, Pixel), **Then** não há bordas duplicadas - apenas o wrapper do layout possui borda
2. **Given** o administrador está na página `/parametrizacao/products`, **When** ele visualiza a lista de produtos, **Then** não há bordas no container da lista nem nos items individuais
3. **Given** o administrador está na página `/parametrizacao/pixels`, **When** ele visualiza a lista de pixels, **Then** não há bordas no container da lista nem nos items individuais
4. **Given** a página contém seções aninhadas (como os Benefit Cards dentro de Gatilhos), **When** o administrador visualiza essas seções, **Then** apenas o wrapper do layout delimita o conteúdo

---

### User Story 3 - Preview de Aparência Integrado (Priority: P2)

O administrador pode visualizar o preview da aparência global dentro da aba Geral, permitindo que ele veja como as configurações afetarão a página de redirect antes de salvar.

**Why this priority**: O preview é útil mas secundário à funcionalidade principal de mover os campos e corrigir as bordas.

**Independent Test**: Pode ser testado editando os campos de aparência na aba Geral e verificando que o preview reflete as mudanças em tempo real.

**Acceptance Scenarios**:

1. **Given** o administrador edita o Texto de Redirecionamento, **When** ele digita um novo texto, **Then** o preview mostra o novo texto imediatamente
2. **Given** o administrador seleciona uma Cor de Fundo, **When** ele escolhe uma cor, **Then** o preview reflete a cor escolhida
3. **Given** o administrador ativa/desativa a opção de Borda, **When** ele altera o toggle, **Then** o preview mostra/oculta a borda correspondente

---

### Edge Cases

- O que acontece quando o administrador tem configurações de Aparência Global salvas anteriormente? As configurações devem ser carregadas corretamente na nova posição dentro da aba Geral.
- Como o sistema lida se o administrador tenta salvar com campos inválidos? As validações existentes (max 100 caracteres para texto, formato hex para cor) devem continuar funcionando.

## Requirements *(mandatory)*

### Functional Requirements

#### Aparência Global (WhatsApp)
- **FR-001**: Sistema DEVE mover todos os campos de "Aparência Global" (Texto de Redirecionamento, Cor de Fundo, toggle de Borda) para dentro da aba "Geral"
- **FR-002**: Sistema DEVE remover a seção separada de "Aparência Global" que existe fora das abas
- **FR-003**: Sistema DEVE manter o preview de aparência visível e funcional dentro da aba "Geral"
- **FR-004**: Sistema DEVE manter as validações existentes dos campos de Aparência Global (max 100 caracteres, formato hex opcional)
- **FR-005**: Sistema DEVE preservar a funcionalidade de salvar configurações de aparência

#### Remoção de Bordas - WhatsApp (`/parametrizacao/whatsapp`)
- **FR-006**: Sistema DEVE remover bordas dos containers de formulário e listas na página WhatsApp
- **FR-007**: Sistema DEVE remover bordas dos items individuais nas listas da página WhatsApp
- **FR-008**: Sistema DEVE remover bordas das seções aninhadas na aba "Gatilhos" (Benefit Cards e Social Proof)

#### Remoção de Bordas - Produtos (`/parametrizacao/products`)
- **FR-009**: Sistema DEVE remover bordas do container do formulário de produtos
- **FR-010**: Sistema DEVE remover bordas do container da lista de produtos
- **FR-011**: Sistema DEVE remover bordas dos items individuais na lista de produtos

#### Remoção de Bordas - Pixels (`/parametrizacao/pixels`)
- **FR-012**: Sistema DEVE remover bordas do container do formulário de pixels
- **FR-013**: Sistema DEVE remover bordas do container da lista de pixels
- **FR-014**: Sistema DEVE remover bordas dos items individuais na lista de pixels

#### Preservação do Layout
- **FR-015**: Sistema DEVE manter a borda apenas no wrapper principal do layout (`<main>` em `layout.tsx`)
- **FR-016**: Sistema DEVE manter bordas nos inputs de formulário (campos de texto, selects, checkboxes) para indicar áreas interativas

### Key Entities

- **GlobalAppearance**: Configurações visuais globais que incluem texto de redirecionamento, cor de fundo opcional e opção de borda
- **WhatsAppPage**: Configuração individual de página de WhatsApp que pode herdar ou sobrescrever as configurações de aparência global

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos campos de Aparência Global estão acessíveis exclusivamente dentro da aba "Geral"
- **SC-002**: Nenhuma borda duplicada é visível em qualquer página de administração (WhatsApp, Produtos, Pixels)
- **SC-003**: O tempo para o administrador encontrar e configurar a aparência global é reduzido (não precisa mais procurar em seção separada)
- **SC-004**: Todas as funcionalidades existentes de aparência (preview, validação, persistência) continuam operando corretamente após a movimentação
- **SC-005**: Apenas o wrapper principal do layout (`<main>`) possui borda visível nas páginas admin

## Assumptions

- As configurações de Aparência Global continuarão sendo salvas separadamente das configurações individuais de página (mesmo botão "Salvar Aparência" ou integrado ao save geral)
- A ordem dos campos na aba "Geral" pode ser reorganizada para acomodar os novos campos de forma lógica
- O preview de aparência será posicionado de forma visível dentro da aba, possivelmente em uma coluna lateral ou abaixo dos campos
- Bordas de inputs de formulário (text fields, selects, checkboxes) serão mantidas para indicar interatividade

## Out of Scope

- Alterações na lógica de persistência de dados
- Adição de novos campos ou funcionalidades de aparência
- Alterações na página de redirect em si (apenas no painel administrativo)
- Mudanças no layout geral ou navegação lateral
