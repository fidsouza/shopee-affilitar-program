# Research: WhatsApp Vacancy Counter

**Feature**: 014-whatsapp-vacancy-counter
**Date**: 2026-01-06

## Overview

Pesquisa de padrões existentes no codebase e decisões técnicas para implementação do contador de vagas.

---

## 1. Padrão de Extensão de Entidade WhatsAppPage

### Decision
Estender o tipo `WhatsAppPageRecord` existente com novos campos para o contador de vagas, seguindo o mesmo padrão usado para features anteriores (benefit cards, social proof, redirect toggle).

### Rationale
- Consistência com padrões estabelecidos no projeto
- Função `migrateRecord()` já existe para backward compatibility
- Edge Config suporta extensão de objetos sem breaking changes

### Alternatives Considered
- **Criar entidade separada VacancyConfig**: Rejeitado - adiciona complexidade desnecessária com joins/lookups
- **Usar configuração global (como WhatsAppAppearance)**: Rejeitado - contador deve ser configurável por página

---

## 2. Padrão de Exclusividade Mútua (Redirect vs Vacancy Counter)

### Decision
Implementar validação client-side na UI que desabilita os checkboxes mutuamente, com mensagem explicativa. Não adicionar validação server-side (Zod refine).

### Rationale
- Padrão similar já existe: quando `redirectEnabled=false`, UI esconde campos de delay
- UX mais responsiva com feedback imediato
- Server-side já aceita ambos campos, apenas a UI controla exclusividade
- Simplifica lógica de migração de dados existentes

### Alternatives Considered
- **Validação Zod com .refine()**: Rejeitado - complexifica migração e pode causar erros em dados legados
- **Lógica server-side no repo**: Rejeitado - viola single responsibility, UI já é responsável por UX

---

## 3. Padrão de Tamanho de Fonte (Small/Medium/Large)

### Decision
Reutilizar o padrão `EmojiSize` existente para os três seletores de tamanho de fonte (headline, number, footer).

### Rationale
- Padrão já existe e funciona (`emojiSizeSchema` em validation.ts)
- UI de seleção já implementada nos Benefit Cards
- Mapeamento para classes Tailwind já definido (`EMOJI_SIZE_CLASSES`)

### Alternatives Considered
- **Criar novo type VacancyFontSize**: Rejeitado - duplicação desnecessária
- **Input numérico (px)**: Rejeitado - inconsistente com UX existente

---

## 4. Padrão de Color Picker para Background

### Decision
Reutilizar o padrão de color picker existente na seção "Aparência Global" (input color + input text hex + botão limpar).

### Rationale
- Componente já existe e está testado em produção
- Usuários já familiarizados com a interface
- Validação hex já implementada no schema `whatsAppAppearanceSchema`

### Alternatives Considered
- **Paleta de cores pré-definidas**: Rejeitado - limita customização
- **Apenas input texto**: Rejeitado - UX inferior sem preview visual

---

## 5. Posicionamento na UI Admin (Aba Gatilhos)

### Decision
Adicionar seção "Contador de Vagas" na aba "Gatilhos", após a seção "Social Proof Notifications".

### Rationale
- Requisito explícito do usuário (clarificação)
- Contador é um "gatilho" de urgência/escassez, similar ao social proof
- Mantém separação lógica: Geral (conteúdo), Gatilhos (conversão), Pixel (tracking)

### Alternatives Considered
- **Nova aba dedicada**: Rejeitado - fragmentação desnecessária
- **Aba Geral**: Rejeitado - não é conteúdo base da página

---

## 6. Estilo Visual do Componente

### Decision
Criar componente com estrutura similar ao countdown/redirect existente:
- Container com borda sempre ativa (border-gray-200)
- Background personalizável via cor hex
- Layout vertical: headline (topo) → número (destaque) → footer (base)

### Rationale
- Consistência visual com componente de redirect
- Borda sempre ativa (decisão do usuário na clarificação)
- Hierarquia visual clara para criar urgência

### Alternatives Considered
- **Borda condicional como redirect**: Rejeitado - usuário optou por borda sempre ativa
- **Layout horizontal**: Rejeitado - não escala bem em mobile

---

## 7. Valores Default dos Novos Campos

### Decision
Definir defaults sensatos para backward compatibility:
- `vacancyCounterEnabled`: false (não quebra páginas existentes)
- `vacancyHeadline`: "" (validação requer preenchimento quando enabled)
- `vacancyCount`: 0
- `vacancyFooter`: null (opcional)
- `vacancyBackgroundColor`: null (transparente)
- `vacancyCountFontSize`: "large" (destaque visual)
- `vacancyHeadlineFontSize`: "medium"
- `vacancyFooterFontSize`: "small"

### Rationale
- Páginas existentes continuam funcionando sem modificação
- Valores de fonte seguem hierarquia visual natural (large > medium > small)
- Contador desabilitado por padrão evita exibição acidental

### Alternatives Considered
- **Headline com valor default "VAGAS DISPONÍVEIS"**: Rejeitado - pode não ser apropriado para todos os contextos

---

## Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `lib/validation.ts` | Adicionar campos vacancy* ao schema `whatsAppPageSchema` |
| `lib/repos/whatsapp-pages.ts` | Atualizar type `WhatsAppPageRecord` e função `migrateRecord` |
| `app/parametrizacao/whatsapp/page.tsx` | Adicionar seção na aba Gatilhos |
| `app/w/[slug]/client.tsx` | Renderizar componente VacancyCounter |

## Conclusão

Todas as decisões técnicas foram tomadas com base nos padrões existentes no codebase. Não há unknowns ou clarifications pendentes. Pronto para Phase 1 (Design & Contracts).
