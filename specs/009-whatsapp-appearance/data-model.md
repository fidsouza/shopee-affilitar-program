# Data Model: Personalização Visual das Páginas de WhatsApp

**Feature**: 009-whatsapp-appearance
**Date**: 2026-01-04

## Visão Geral

Configuração global de aparência persistida no Edge Config para personalizar as páginas de redirecionamento WhatsApp (`/w/[slug]`).

---

## WhatsAppAppearanceConfig

Entidade singleton que armazena as configurações visuais aplicadas globalmente a todas as páginas `/w/[slug]`.

### Schema TypeScript

```typescript
interface WhatsAppAppearanceConfig {
  redirectText: string;         // Texto exibido durante redirecionamento
  backgroundColor?: string;     // Cor de fundo em formato hex (ex: "#ffffff")
  borderEnabled: boolean;       // Se a caixa deve ter borda
  updatedAt: string;           // ISO timestamp da última atualização
}
```

### Campos

| Campo | Tipo | Obrigatório | Padrão | Descrição |
|-------|------|-------------|--------|-----------|
| redirectText | string | Sim | "Redirecionando..." | Texto exibido na caixa de redirecionamento |
| backgroundColor | string | Não | undefined | Cor de fundo em formato hexadecimal (#RRGGBB) |
| borderEnabled | boolean | Sim | false | Ativa/desativa borda na caixa |
| updatedAt | string | Sim | - | Data/hora da última atualização (ISO 8601) |

### Validações (Zod Schema)

```typescript
export const whatsAppAppearanceSchema = z.object({
  redirectText: z.string()
    .min(1, "Texto é obrigatório")
    .max(100, "Texto muito longo (máx. 100 caracteres)"),
  backgroundColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal("")),
  borderEnabled: z.boolean().default(false),
});

export type WhatsAppAppearanceInput = z.infer<typeof whatsAppAppearanceSchema>;
```

### Persistência

| Aspecto | Valor |
|---------|-------|
| Storage | Vercel Edge Config |
| Key | `whatsapp_appearance` |
| Pattern | Singleton (única config global) |

### Valores Padrão

Quando a configuração não existe no Edge Config:

```typescript
export const DEFAULT_APPEARANCE: WhatsAppAppearanceConfig = {
  redirectText: "Redirecionando...",
  backgroundColor: undefined,
  borderEnabled: false,
  updatedAt: new Date().toISOString(),
};
```

---

## Estilo da Borda

Quando `borderEnabled: true`:

| Propriedade | Valor | Tailwind Class |
|-------------|-------|----------------|
| Cor | `#e5e7eb` | border-gray-200 |
| Espessura | 1px | border |
| Estilo | solid | - |
| Raio | 8px | rounded-lg |

---

## Relacionamentos

```text
WhatsAppAppearanceConfig (Singleton)
    ↓ aplica-se a
WhatsAppPageRecord[] (todas as páginas /w/[slug])
```

A configuração é carregada uma vez pelo server component e passada para o client component que aplica os estilos.

---

## API Endpoints

### GET /api/whatsapp/appearance

Retorna a configuração atual ou valores padrão.

**Response 200:**
```json
{
  "redirectText": "Redirecionando...",
  "backgroundColor": null,
  "borderEnabled": false,
  "updatedAt": "2026-01-04T12:00:00.000Z"
}
```

### PUT /api/whatsapp/appearance

Atualiza a configuração de aparência.

**Request Body:**
```json
{
  "redirectText": "Aguarde um momento...",
  "backgroundColor": "#f0fdf4",
  "borderEnabled": true
}
```

**Response 200:**
```json
{
  "redirectText": "Aguarde um momento...",
  "backgroundColor": "#f0fdf4",
  "borderEnabled": true,
  "updatedAt": "2026-01-04T12:30:00.000Z"
}
```

**Response 400 (Validação):**
```json
{
  "error": "Validation failed",
  "details": [
    { "path": ["redirectText"], "message": "Texto é obrigatório" }
  ]
}
```

---

## Repository

### Arquivo: `lib/repos/whatsapp-appearance.ts`

```typescript
'use server';

import { readValue, upsertItems } from "@/lib/edge-config";
import { whatsAppAppearanceSchema, type WhatsAppAppearanceInput } from "@/lib/validation";

const APPEARANCE_KEY = "whatsapp_appearance";

export type WhatsAppAppearanceRecord = WhatsAppAppearanceInput & {
  updatedAt: string;
};

const DEFAULT_APPEARANCE: WhatsAppAppearanceRecord = {
  redirectText: "Redirecionando...",
  backgroundColor: undefined,
  borderEnabled: false,
  updatedAt: new Date().toISOString(),
};

export async function getWhatsAppAppearance(): Promise<WhatsAppAppearanceRecord> {
  const config = await readValue<WhatsAppAppearanceRecord>(APPEARANCE_KEY);
  return config ?? DEFAULT_APPEARANCE;
}

export async function updateWhatsAppAppearance(
  input: WhatsAppAppearanceInput
): Promise<WhatsAppAppearanceRecord> {
  const parsed = whatsAppAppearanceSchema.parse(input);
  const now = new Date().toISOString();

  const record: WhatsAppAppearanceRecord = {
    redirectText: parsed.redirectText,
    backgroundColor: parsed.backgroundColor || undefined,
    borderEnabled: parsed.borderEnabled,
    updatedAt: now,
  };

  await upsertItems([{ key: APPEARANCE_KEY, value: record }]);

  return record;
}
```

---

## Notas de Implementação

- Criar arquivo `lib/repos/whatsapp-appearance.ts` seguindo padrão existente
- Adicionar schema Zod em `lib/validation.ts`
- Server component `/w/[slug]/page.tsx` carrega config junto com dados da página
- Client component aplica estilos inline para cor dinâmica
- Fallback para valores padrão se Edge Config não tiver a chave
- Cor de fundo vazia ("") é tratada como undefined (transparente)
