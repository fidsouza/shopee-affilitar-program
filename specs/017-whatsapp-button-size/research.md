# Research: Configuração de Tamanho do Botão WhatsApp

**Feature**: 017-whatsapp-button-size
**Date**: 2026-01-09

## Research Summary

Esta feature não requer pesquisa externa pois segue padrões já estabelecidos no codebase. Todas as decisões técnicas são baseadas em implementações anteriores de features similares.

---

## 1. Sistema de Tamanhos

### Decision
Reutilizar o tipo `EmojiSize` existente (`"small" | "medium" | "large"`) para o campo `buttonSize`.

### Rationale
- Consistência com sistema existente de tamanhos (emojiSize, subheadlineFontSize, vacancyCountFontSize, etc.)
- Schema Zod já definido (`emojiSizeSchema`)
- Padrão familiar para o administrador
- Reduz complexidade de código

### Alternatives Considered
- **Tamanhos numéricos (px/rem)**: Rejeitado por ser muito técnico para o usuário admin
- **Tamanhos customizados (xs, sm, md, lg, xl)**: Rejeitado por inconsistência com padrão existente
- **Slider livre**: Rejeitado por complexidade desnecessária

---

## 2. Classes CSS por Tamanho

### Decision
Definir mapeamento de tamanhos para classes Tailwind, seguindo proporções adequadas para botão CTA.

### Rationale
Análise do botão atual (tamanho "médio" para compatibilidade):
```css
/* Atual (será "medium") */
px-8 py-4 text-lg  /* padding: 32px 16px, font: 18px */
```

Proporções propostas:
```typescript
const BUTTON_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "px-6 py-3 text-base",   // padding: 24px 12px, font: 16px
  medium: "px-8 py-4 text-lg",    // padding: 32px 16px, font: 18px (atual)
  large: "px-10 py-5 text-xl",    // padding: 40px 20px, font: 20px
};
```

### Alternatives Considered
- **Scale transform**: Rejeitado por distorcer a aparência
- **Classes diferentes para mobile**: Rejeitado por complexidade desnecessária

---

## 3. Preview do Botão no Admin

### Decision
Criar componente de preview inline que renderiza o botão com estilos reais baseado no estado do formulário.

### Rationale
- Feedback visual imediato sem necessidade de salvar
- Reutiliza os mesmos estilos do botão real (garantia de fidelidade)
- Segue padrão existente de formulários reativos no admin

### Implementation Pattern
```tsx
// Seção do formulário
<div className="space-y-2">
  <Label>Tamanho do Botão</Label>
  <RadioGroup value={buttonSize} onValueChange={setButtonSize}>
    <div className="flex items-center gap-4">
      <RadioGroupItem value="small" />
      <RadioGroupItem value="medium" />
      <RadioGroupItem value="large" />
    </div>
  </RadioGroup>

  {/* Preview */}
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-500 mb-2">Preview:</p>
    <a className={`inline-flex items-center gap-2 rounded-full bg-green-500 ${BUTTON_SIZE_CLASSES[buttonSize]} font-bold text-white`}>
      <WhatsAppIcon />
      {buttonText}
    </a>
  </div>
</div>
```

---

## 4. Migração de Dados

### Decision
Adicionar campo `buttonSize` ao `WhatsAppPageRecord` com valor padrão "medium" na função `migrateRecord()`.

### Rationale
- Padrão consistente com migrações anteriores (emojiSize, subheadlineFontSize)
- Valor "medium" preserva aparência atual para páginas existentes
- Sem breaking changes

### Implementation
```typescript
// Em migrateRecord()
migrated.buttonSize = record.buttonSize ?? "medium";
```

---

## 5. Localização do Seletor no Admin

### Decision
Posicionar o seletor de tamanho do botão na aba "Geral", logo abaixo do campo "Texto do Botão".

### Rationale
- Agrupamento lógico: campos relacionados ao botão ficam juntos
- Proximidade do campo buttonText facilita visualização do preview
- Segue fluxo natural de configuração

---

## Conclusão

Nenhuma clarificação adicional necessária. Todos os aspectos técnicos foram resolvidos com base em padrões existentes no codebase.

| Aspecto | Decisão | Baseado em |
|---------|---------|------------|
| Tipo de tamanho | EmojiSize (small/medium/large) | emojiSize, subheadlineFontSize |
| Classes CSS | Mapeamento Tailwind | Padrão existente EMOJI_SIZE_CLASSES |
| Preview | Componente inline reativo | Formulários existentes |
| Migração | Default "medium" em migrateRecord() | Padrão de features anteriores |
| Posição no admin | Aba Geral, após buttonText | Agrupamento lógico |
