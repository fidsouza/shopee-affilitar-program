# Data Model: Página de Política de Privacidade + Personalização WhatsApp

**Feature**: 008-privacy-policy
**Date**: 2026-01-04

## Visão Geral

Esta feature inclui:
1. **Página de Política de Privacidade**: Conteúdo estático definido no código-fonte (sem persistência)
2. **Personalização Visual WhatsApp**: Configuração global persistida no Edge Config

## Entidades Conceituais

Embora não haja persistência, as seguintes estruturas conceituais são usadas para organizar o conteúdo:

### 1. PolicySection

Representa uma seção da política de privacidade.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | Identificador único da seção (slug para âncora) |
| title | string | Título da seção (ex: "Dados Coletados") |
| content | ReactNode | Conteúdo da seção (texto, listas, etc.) |
| order | number | Ordem de exibição na página |

### 2. ContactInfo

Informações de contato do controlador de dados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| name | string | Nome do responsável/empresa |
| email | string | Email para contato |
| cnpj | string? | CNPJ (opcional, se pessoa jurídica) |

### 3. PolicyMetadata

Metadados da política.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| lastUpdated | Date | Data da última atualização |
| version | string | Versão da política (opcional) |
| language | string | Idioma (pt-BR) |

## Estrutura de Seções Obrigatórias

A política deve conter as seguintes seções, na ordem sugerida:

1. **Introdução** - Apresentação e escopo da política
2. **Controlador de Dados** - Identificação do responsável
3. **Dados Coletados** - Lista de dados pessoais tratados
4. **Finalidade do Tratamento** - Para que os dados são usados
5. **Base Legal** - Fundamento jurídico (consentimento)
6. **Compartilhamento de Dados** - Com quem os dados são compartilhados
7. **Retenção de Dados** - Período de armazenamento
8. **Direitos do Titular** - Direitos garantidos pela LGPD
9. **Exercício de Direitos** - Como solicitar acesso, correção, exclusão
10. **Cookies** - Informações sobre cookies (se aplicável)
11. **Atualizações da Política** - Como mudanças são comunicadas

## Relacionamentos

```text
PolicyPage
├── PolicyMetadata (1:1)
├── ContactInfo (1:1)
└── PolicySection[] (1:N)
```

## Validações

| Regra | Descrição |
|-------|-----------|
| Seções obrigatórias | Todas as 11 seções devem estar presentes |
| Data de atualização | Deve ser exibida de forma visível |
| Email de contato | Deve ser um email válido |
| Conteúdo em pt-BR | Todo o texto deve estar em português brasileiro |

## Notas de Implementação (Política de Privacidade)

- O conteúdo é hardcoded como constantes TypeScript
- Não há necessidade de banco de dados ou Edge Config
- As seções podem ser componentizadas para melhor manutenibilidade
- A data de atualização pode ser definida como constante e atualizada manualmente quando houver mudanças

---

# Entidades Persistidas (Personalização WhatsApp)

## WhatsAppAppearanceConfig

Configuração global de aparência para as páginas de redirecionamento WhatsApp (`/w/[slug]`).

### Schema

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
const whatsAppAppearanceSchema = z.object({
  redirectText: z.string()
    .min(1, "Texto é obrigatório")
    .max(100, "Texto muito longo (máx. 100 caracteres)"),
  backgroundColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional(),
  borderEnabled: z.boolean().default(false),
});
```

### Persistência

| Aspecto | Valor |
|---------|-------|
| Storage | Vercel Edge Config |
| Key | `whatsapp_appearance` |
| Pattern | Singleton (única config global) |

### Valores Padrão (quando config não existe)

```typescript
const DEFAULT_APPEARANCE: WhatsAppAppearanceConfig = {
  redirectText: "Redirecionando...",
  backgroundColor: undefined,
  borderEnabled: false,
  updatedAt: new Date().toISOString(),
};
```

### Estilo da Borda (quando habilitada)

| Propriedade | Valor |
|-------------|-------|
| Cor | `#e5e7eb` (Tailwind gray-200) |
| Espessura | 1px |
| Estilo | solid |
| Raio | 8px (rounded-lg) |

## Relacionamentos

```text
WhatsAppAppearanceConfig (Singleton)
    ↓ aplica-se a
WhatsAppPageRecord[] (todas as páginas /w/[slug])
```

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

## Notas de Implementação (Personalização WhatsApp)

- Criar arquivo `lib/repos/whatsapp-appearance.ts` seguindo padrão existente
- Adicionar schema Zod em `lib/validation.ts`
- Server component `/w/[slug]/page.tsx` carrega config junto com dados da página
- Client component aplica estilos inline para cor dinâmica
- Fallback para valores padrão se Edge Config não tiver a chave
