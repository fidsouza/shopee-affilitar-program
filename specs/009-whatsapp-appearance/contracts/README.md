# Contracts: Personalização Visual das Páginas de WhatsApp

**Feature**: 009-whatsapp-appearance
**Date**: 2026-01-04

## Visão Geral

Esta feature possui uma API REST para gerenciamento da configuração global de aparência das páginas WhatsApp.

---

## API Endpoints

### GET /api/whatsapp/appearance

Retorna a configuração atual de aparência ou valores padrão.

**Autenticação**: Nenhuma
**Rate Limit**: N/A

#### Response 200

```json
{
  "redirectText": "Redirecionando...",
  "backgroundColor": null,
  "borderEnabled": false,
  "updatedAt": "2026-01-04T12:00:00.000Z"
}
```

#### Response Schema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| redirectText | string | Texto exibido na caixa de redirecionamento |
| backgroundColor | string \| null | Cor de fundo em formato hex (#RRGGBB) ou null |
| borderEnabled | boolean | Se a caixa deve ter borda |
| updatedAt | string | ISO timestamp da última atualização |

---

### PUT /api/whatsapp/appearance

Atualiza a configuração de aparência.

**Autenticação**: Nenhuma
**Rate Limit**: N/A

#### Request Body

```json
{
  "redirectText": "Aguarde um momento...",
  "backgroundColor": "#f0fdf4",
  "borderEnabled": true
}
```

#### Request Schema

| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| redirectText | string | Sim | min: 1, max: 100 caracteres |
| backgroundColor | string | Não | Regex: ^#[0-9A-Fa-f]{6}$ ou string vazia |
| borderEnabled | boolean | Sim | true ou false |

#### Response 200

```json
{
  "redirectText": "Aguarde um momento...",
  "backgroundColor": "#f0fdf4",
  "borderEnabled": true,
  "updatedAt": "2026-01-04T12:30:00.000Z"
}
```

#### Response 400 (Validação)

```json
{
  "error": "Validation failed",
  "details": [
    { "path": ["redirectText"], "message": "Texto é obrigatório" },
    { "path": ["backgroundColor"], "message": "Cor deve estar em formato hexadecimal (#RRGGBB)" }
  ]
}
```

---

## Valores Padrão

Quando nenhuma configuração existe no Edge Config:

| Campo | Valor Padrão |
|-------|--------------|
| redirectText | "Redirecionando..." |
| backgroundColor | null (transparente) |
| borderEnabled | false |
| updatedAt | (timestamp atual) |

---

## Estilo da Borda (quando habilitada)

| Propriedade | Valor |
|-------------|-------|
| Cor | #e5e7eb (gray-200) |
| Espessura | 1px |
| Estilo | solid |
| Raio | 8px (rounded-lg) |

---

## Integrações Externas

| Serviço | Descrição |
|---------|-----------|
| Vercel Edge Config | Armazenamento da configuração (chave: `whatsapp_appearance`) |

---

## Exemplos cURL

```bash
# GET - Obter configuração atual
curl http://localhost:3000/api/whatsapp/appearance

# PUT - Atualizar configuração
curl -X PUT http://localhost:3000/api/whatsapp/appearance \
  -H "Content-Type: application/json" \
  -d '{
    "redirectText": "Aguarde um momento...",
    "backgroundColor": "#f0fdf4",
    "borderEnabled": true
  }'

# PUT - Configuração mínima (sem cor de fundo)
curl -X PUT http://localhost:3000/api/whatsapp/appearance \
  -H "Content-Type: application/json" \
  -d '{
    "redirectText": "Redirecionando para WhatsApp...",
    "borderEnabled": false
  }'
```
