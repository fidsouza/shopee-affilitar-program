# Feature Specification: Subheadline Text with Font Size Control

**Feature Branch**: `016-subheadline-font-size`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "ajuste o texto Provas Sociais (uma por linha) na aba Geral, primeiro não está mais aparecendo na página, segundo alterar para sub head line, deve ser permitido alterar o tamanho da fonte com 3 tamanhos: pequeno, medio, grande."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Subheadline Text (Priority: P1)

O administrador acessa o painel em `/parametrizacao/whatsapp`, vai até a aba "Geral" e configura um texto de subheadline que será exibido logo abaixo do headline principal na página de redirecionamento do WhatsApp.

**Why this priority**: Este é o requisito principal - o texto precisa ser configurável e aparecer corretamente na página pública. Sem isso, a feature não funciona.

**Independent Test**: Pode ser testado configurando um texto no admin e verificando se aparece na página `/w/[slug]`.

**Acceptance Scenarios**:

1. **Given** o administrador está na aba Geral do formulário de página WhatsApp, **When** ele insere texto no campo "Subheadline" (que substitui o antigo "Provas Sociais"), **Then** o texto é salvo e exibido na página de redirecionamento imediatamente abaixo do headline.

2. **Given** o campo subheadline está vazio, **When** o administrador visualiza a página de redirecionamento, **Then** nenhum texto de subheadline é exibido (não exibe espaço vazio).

3. **Given** o administrador inseriu texto com múltiplas linhas, **When** a página é renderizada, **Then** cada linha é exibida separadamente, mantendo a formatação.

---

### User Story 2 - Select Font Size for Subheadline (Priority: P1)

O administrador pode escolher entre três tamanhos de fonte para o subheadline: pequeno, médio ou grande.

**Why this priority**: O controle de tamanho é um requisito explícito do usuário e parte integral da feature.

**Independent Test**: Pode ser testado selecionando cada opção de tamanho e verificando a mudança visual na página pública.

**Acceptance Scenarios**:

1. **Given** o administrador está configurando o subheadline, **When** ele seleciona o tamanho "Pequeno", **Then** o texto é exibido em tamanho pequeno na página de redirecionamento.

2. **Given** o administrador está configurando o subheadline, **When** ele seleciona o tamanho "Médio", **Then** o texto é exibido em tamanho médio na página de redirecionamento.

3. **Given** o administrador está configurando o subheadline, **When** ele seleciona o tamanho "Grande", **Then** o texto é exibido em tamanho grande na página de redirecionamento.

4. **Given** o administrador não selecionou nenhum tamanho, **When** a página é renderizada, **Then** o tamanho padrão (médio) é aplicado.

---

### User Story 3 - Subheadline Appears on WhatsApp Redirect Page (Priority: P1)

O texto de subheadline deve ser visível na página de redirecionamento `/w/[slug]`, posicionado entre o headline e o botão CTA.

**Why this priority**: Este é o bug principal reportado - o texto "não está mais aparecendo na página". Deve ser corrigido para que a feature funcione.

**Independent Test**: Pode ser testado acessando a página pública e verificando se o subheadline aparece no local correto.

**Acceptance Scenarios**:

1. **Given** uma página WhatsApp tem subheadline configurado, **When** um usuário acessa a página `/w/[slug]`, **Then** o texto de subheadline é visível entre o headline e o botão principal.

2. **Given** uma página WhatsApp tem subheadline e também itens no carrossel de provas sociais, **When** um usuário acessa a página, **Then** ambos são exibidos (subheadline logo abaixo do headline, carrossel em sua posição atual).

---

### Edge Cases

- O que acontece quando o texto do subheadline é muito longo? O texto deve quebrar naturalmente respeitando o container da página, sem overflow.
- Como o sistema lida com caracteres especiais ou emojis no subheadline? Deve renderizar corretamente todos os caracteres Unicode, incluindo emojis.
- O que acontece se o campo subheadline contiver apenas espaços em branco? Deve ser tratado como vazio (não exibir nada).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE permitir que o administrador configure um texto de subheadline na aba "Geral" do formulário de páginas WhatsApp.
- **FR-002**: Sistema DEVE exibir o texto de subheadline na página de redirecionamento `/w/[slug]`, posicionado entre o headline e o botão CTA.
- **FR-003**: Sistema DEVE permitir que o administrador selecione o tamanho da fonte do subheadline entre três opções: Pequeno, Médio e Grande.
- **FR-004**: Sistema DEVE usar o tamanho "Médio" como padrão quando nenhum tamanho for selecionado.
- **FR-005**: Sistema DEVE persistir a configuração de subheadline e tamanho de fonte no armazenamento da página.
- **FR-006**: Sistema DEVE suportar texto multilinha no campo subheadline, renderizando cada linha separadamente.
- **FR-007**: Sistema NÃO DEVE exibir o subheadline (nem espaço vazio) quando o campo estiver vazio ou contiver apenas espaços.
- **FR-008**: Sistema DEVE renomear o campo de "Provas Sociais (uma por linha)" para "Subheadline" no formulário administrativo.

### Key Entities

- **WhatsAppPage**: Entidade existente que será estendida com os novos campos:
  - `subheadline`: Texto de subheadline (substitui o campo `socialProofs` legacy na aba Geral)
  - `subheadlineFontSize`: Tamanho da fonte selecionado (pequeno, médio, grande)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das páginas WhatsApp com subheadline configurado exibem o texto corretamente na página pública.
- **SC-002**: A mudança de tamanho de fonte reflete imediatamente na página pública após salvar as configurações.
- **SC-003**: Administradores conseguem configurar o subheadline e tamanho de fonte em menos de 30 segundos.
- **SC-004**: O subheadline é visível e legível em dispositivos móveis e desktop.

## Assumptions

- O campo "Provas Sociais (uma por linha)" atual será renomeado para "Subheadline" e continuará aceitando múltiplas linhas.
- Os dados existentes no campo `socialProofs` serão migrados/mapeados para o novo campo de subheadline.
- A feature de "Carrossel de Provas Sociais" na aba "Gatilhos" permanece inalterada e separada desta funcionalidade.
- Os três tamanhos de fonte (pequeno, médio, grande) terão valores visuais distintos mas proporcionais ao design existente da página.
