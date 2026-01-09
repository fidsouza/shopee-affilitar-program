# Research: Subheadline Text with Font Size Control

**Feature**: 016-subheadline-font-size
**Date**: 2026-01-08

## Research Questions

### 1. Por que o texto "Provas Sociais" não está aparecendo na página?

**Decision**: O texto não aparece porque a lógica de renderização em `client.tsx` (linhas 235-247) só exibe `socialProofs` quando NÃO há itens no carrossel de provas sociais (`socialProofCarouselItems`). Se o carrossel estiver configurado, o campo legacy `socialProofs` é ocultado.

**Rationale**: A condição atual é:
```tsx
{(!page.socialProofCarouselItems || page.socialProofCarouselItems.length === 0) && page.socialProofs.length > 0 && (...)}
```
Isso significa que se o usuário configurou qualquer item no carrossel, o texto de provas sociais da aba Geral é escondido.

**Alternatives Considered**:
- Remover completamente o campo legacy - rejeitado pois quebraria dados existentes
- Sempre mostrar ambos - pode ser confuso para o usuário

**Solution**: Transformar o campo `socialProofs` em `subheadline` com propósito diferente (texto abaixo do headline) e garantir que seja sempre exibido quando configurado, independente do carrossel.

---

### 2. Como reutilizar o schema de tamanho de fonte existente?

**Decision**: Reutilizar `emojiSizeSchema` já definido em `validation.ts` (linha 90).

**Rationale**: O schema já existe e é usado para:
- `emojiSize` (benefit cards)
- `vacancyCountFontSize`, `vacancyHeadlineFontSize`, `vacancyFooterFontSize`

Definição existente:
```typescript
export const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");
export type EmojiSize = z.infer<typeof emojiSizeSchema>;
```

**Alternatives Considered**:
- Criar novo schema específico para subheadline - rejeitado por duplicação desnecessária

---

### 3. Como manter compatibilidade com dados existentes?

**Decision**: Manter o campo `socialProofs` para retrocompatibilidade e usar o mesmo array para renderização do subheadline.

**Rationale**:
- O campo `socialProofs` já armazena as linhas de texto
- Adicionar apenas `subheadlineFontSize` como novo campo
- Não é necessário migração de dados - os valores existentes continuam funcionando

**Migration Strategy**:
1. Adicionar `subheadlineFontSize` ao schema com default "medium"
2. Adicionar ao `WhatsAppPageRecord` type
3. Adicionar ao `LegacyWhatsAppPageRecord` como opcional
4. Atualizar função `migrateRecord()` para incluir default

---

### 4. Qual mapeamento de tamanhos de fonte usar no Tailwind?

**Decision**: Usar classes Tailwind responsivas existentes no projeto.

**Rationale**: Baseado no código existente em `client.tsx` (linha 241):
```tsx
className="text-gray-600 text-sm sm:text-base"
```

**Mapeamento proposto**:
| Size   | Mobile (default) | Desktop (sm:)  |
|--------|------------------|----------------|
| small  | text-xs          | text-sm        |
| medium | text-sm          | text-base      |
| large  | text-base        | text-lg        |

**Alternatives Considered**:
- Usar rem fixo - rejeitado pois não é responsivo
- Criar componente separado - rejeitado por ser over-engineering

---

## Summary

Não há unknowns restantes. Todas as decisões técnicas foram tomadas:

1. **Bug fix**: Remover condição que oculta `socialProofs` quando carrossel existe
2. **Rename**: Alterar label de "Provas Sociais (uma por linha)" para "Subheadline"
3. **Font size**: Reutilizar `emojiSizeSchema` para novo campo `subheadlineFontSize`
4. **Styling**: Mapear small/medium/large para classes Tailwind responsivas
5. **Compatibility**: Campo `socialProofs` mantido, novo campo `subheadlineFontSize` adicionado
