# Quickstart: WhatsApp Vacancy Counter

**Feature**: 014-whatsapp-vacancy-counter
**Date**: 2026-01-06

## Resumo da Implementação

Esta feature adiciona um contador de vagas às páginas WhatsApp (/w/[slug]) com:
- Toggle habilitação (mutuamente exclusivo com redirect)
- Headline, número e footer personalizáveis
- Cor de fundo e tamanhos de fonte configuráveis
- Configuração na aba "Gatilhos" do admin

---

## Arquivos a Modificar

### 1. Validação (lib/validation.ts)

Adicionar campos ao `whatsAppPageSchema`:

```typescript
// Após socialProofInterval
vacancyCounterEnabled: z.boolean().default(false),
vacancyHeadline: z.string().max(100).default(""),
vacancyCount: z.number().int().min(0).default(0),
vacancyFooter: z.string().max(200).optional().or(z.literal("")).transform(v => v || null),
vacancyBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")).transform(v => v || null),
vacancyCountFontSize: emojiSizeSchema.default("large"),
vacancyHeadlineFontSize: emojiSizeSchema.default("medium"),
vacancyFooterFontSize: emojiSizeSchema.default("small"),
```

### 2. Repository (lib/repos/whatsapp-pages.ts)

**2.1 Atualizar WhatsAppPageRecord type:**
```typescript
export type WhatsAppPageRecord = {
  // ... existentes ...
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string | null;
  vacancyBackgroundColor: string | null;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
};
```

**2.2 Atualizar LegacyWhatsAppPageRecord:**
```typescript
type LegacyWhatsAppPageRecord = {
  // ... existentes ...
  vacancyCounterEnabled?: boolean;
  vacancyHeadline?: string;
  vacancyCount?: number;
  vacancyFooter?: string | null;
  vacancyBackgroundColor?: string | null;
  vacancyCountFontSize?: EmojiSize;
  vacancyHeadlineFontSize?: EmojiSize;
  vacancyFooterFontSize?: EmojiSize;
};
```

**2.3 Atualizar migrateRecord:**
```typescript
migrated.vacancyCounterEnabled = record.vacancyCounterEnabled ?? false;
migrated.vacancyHeadline = record.vacancyHeadline ?? "";
migrated.vacancyCount = record.vacancyCount ?? 0;
migrated.vacancyFooter = record.vacancyFooter ?? null;
migrated.vacancyBackgroundColor = record.vacancyBackgroundColor ?? null;
migrated.vacancyCountFontSize = record.vacancyCountFontSize ?? "large";
migrated.vacancyHeadlineFontSize = record.vacancyHeadlineFontSize ?? "medium";
migrated.vacancyFooterFontSize = record.vacancyFooterFontSize ?? "small";
```

**2.4 Atualizar upsertWhatsAppPage record:**
```typescript
const record: WhatsAppPageRecord = {
  // ... existentes ...
  vacancyCounterEnabled: parsed.vacancyCounterEnabled ?? existing?.vacancyCounterEnabled ?? false,
  vacancyHeadline: parsed.vacancyHeadline ?? existing?.vacancyHeadline ?? "",
  vacancyCount: parsed.vacancyCount ?? existing?.vacancyCount ?? 0,
  vacancyFooter: parsed.vacancyFooter ?? existing?.vacancyFooter ?? null,
  vacancyBackgroundColor: parsed.vacancyBackgroundColor ?? existing?.vacancyBackgroundColor ?? null,
  vacancyCountFontSize: parsed.vacancyCountFontSize ?? existing?.vacancyCountFontSize ?? "large",
  vacancyHeadlineFontSize: parsed.vacancyHeadlineFontSize ?? existing?.vacancyHeadlineFontSize ?? "medium",
  vacancyFooterFontSize: parsed.vacancyFooterFontSize ?? existing?.vacancyFooterFontSize ?? "small",
};
```

### 3. Admin Form (app/parametrizacao/whatsapp/page.tsx)

**3.1 Atualizar FormState type:**
```typescript
type FormState = {
  // ... existentes ...
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string;
  vacancyBackgroundColor: string;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
};
```

**3.2 Atualizar initialForm:**
```typescript
const initialForm: FormState = {
  // ... existentes ...
  vacancyCounterEnabled: false,
  vacancyHeadline: "",
  vacancyCount: 0,
  vacancyFooter: "",
  vacancyBackgroundColor: "",
  vacancyCountFontSize: "large",
  vacancyHeadlineFontSize: "medium",
  vacancyFooterFontSize: "small",
};
```

**3.3 Adicionar seção na aba Gatilhos (após Social Proof):**
- Checkbox toggle (desabilitado se redirectEnabled)
- Input headline (required quando enabled)
- Input number
- Input footer
- Color picker background
- 3x seletores de tamanho de fonte
- Preview do componente

**3.4 Implementar exclusividade mútua:**
```typescript
// Quando vacancyCounterEnabled muda para true
if (newValue && form.redirectEnabled) {
  // Bloquear ou desabilitar automaticamente
}

// Quando redirectEnabled muda para true
if (newValue && form.vacancyCounterEnabled) {
  // Bloquear ou desabilitar automaticamente
}
```

### 4. Client Component (app/w/[slug]/client.tsx)

**4.1 Atualizar Props:**
```typescript
type Props = {
  page: WhatsAppPageRecord;
  // ... existentes ...
};
```

**4.2 Adicionar VacancyCounter component:**
```tsx
{page.vacancyCounterEnabled && (
  <div
    className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-6 py-4"
    style={{ backgroundColor: page.vacancyBackgroundColor || "transparent" }}
  >
    <span className={FONT_SIZE_CLASSES[page.vacancyHeadlineFontSize]}>
      {page.vacancyHeadline}
    </span>
    <span className={`font-bold text-green-600 ${FONT_SIZE_CLASSES[page.vacancyCountFontSize]}`}>
      {page.vacancyCount}
    </span>
    {page.vacancyFooter && (
      <span className={FONT_SIZE_CLASSES[page.vacancyFooterFontSize]}>
        {page.vacancyFooter}
      </span>
    )}
  </div>
)}
```

**4.3 Adicionar mapeamento de tamanhos:**
```typescript
const FONT_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-2xl",
};
```

---

## Ordem de Implementação Sugerida

1. **lib/validation.ts** - Adicionar campos ao schema
2. **lib/repos/whatsapp-pages.ts** - Atualizar types e migration
3. **app/w/[slug]/client.tsx** - Renderizar componente público
4. **app/parametrizacao/whatsapp/page.tsx** - Form admin com exclusividade mútua

---

## Testes Manuais

1. **Criar página com contador:**
   - Desabilitar redirect
   - Habilitar contador
   - Preencher headline, número, footer
   - Configurar cor e tamanhos
   - Salvar e verificar persistência

2. **Exclusividade mútua:**
   - Com redirect habilitado, tentar habilitar contador (deve bloquear)
   - Com contador habilitado, tentar habilitar redirect (deve bloquear)

3. **Página pública:**
   - Acessar /w/[slug]
   - Verificar exibição do contador com estilos corretos
   - Testar responsividade mobile

4. **Backward compatibility:**
   - Verificar páginas existentes continuam funcionando
   - Contador deve estar desabilitado por padrão
