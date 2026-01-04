# API Contracts: Notificação de Prova Social

**Feature**: 007-social-proof-notification
**Date**: 2026-01-03

## Overview

Esta feature **não requer novos endpoints de API**. Ela estende o endpoint existente `/api/whatsapp` com dois novos campos opcionais.

## Extended Endpoint

### POST /api/whatsapp

**Extended Request Body**:

```json
{
  // ... existing fields ...
  "headline": "string",
  "buttonText": "string",
  "whatsappUrl": "string",

  // NEW OPTIONAL FIELDS
  "socialProofEnabled": false,      // boolean, default: false
  "socialProofInterval": 10         // integer 5-60, default: 10
}
```

**Extended Response Body**:

```json
{
  // ... existing fields ...
  "id": "uuid",
  "slug": "string",

  // NEW FIELDS IN RESPONSE
  "socialProofEnabled": false,
  "socialProofInterval": 10
}
```

## Validation Rules

| Field | Type | Min | Max | Default |
|-------|------|-----|-----|---------|
| `socialProofEnabled` | boolean | - | - | `false` |
| `socialProofInterval` | integer | 5 | 60 | `10` |

## Backward Compatibility

- Os novos campos são opcionais no request
- Registros existentes retornarão valores default via migration layer
- Clientes antigos que não enviam os novos campos continuarão funcionando
