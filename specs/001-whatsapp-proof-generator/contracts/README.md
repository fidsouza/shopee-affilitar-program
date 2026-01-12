# Contracts: WhatsApp Group Social Proof Image Generator

**Feature**: 001-whatsapp-proof-generator
**Date**: 2026-01-11

## Overview

This feature is **purely client-side** with no server-side APIs or backend contracts.

## No API Endpoints Required

This feature does NOT create any REST API endpoints because:

1. **Client-Side Only** (FR-012): Image generation happens entirely in the browser using html-to-image
2. **Ephemeral Data**: No persistence to Edge Config, database, or any storage system
3. **No Server Processing**: Screenshot creation is handled by browser's Canvas/SVG APIs
4. **Download Direct**: Images are downloaded directly from browser using blob URLs

## No GraphQL Schema Required

This feature does not use GraphQL.

## Client-Side Contracts

The only "contracts" for this feature are **TypeScript interfaces** for React component state, which are documented in `/specs/001-whatsapp-proof-generator/data-model.md`.

### Key Types

```typescript
// See data-model.md for complete type definitions

interface WhatsAppScreenshot {
  groupName: string;
  participants: Participant[];
  createdAt: Date;
  groupIconUrl?: string;
}

interface Participant {
  id: string;
  label: string;
  name: string;
  message: string;
  timestamp: string;
  order: number;
}
```

These types will be defined in:
```
frontend/src/app/parametrizacao/whatsapp-generator/types.ts
```

## Integration Points

### With Existing Admin Navigation

The new tab integrates with the existing admin parametrization layout:

**Location**: `/parametrizacao` (existing admin panel)

**New Route**: `/parametrizacao/whatsapp-generator`

**Navigation Update**: Add new tab/link to existing parametrization navigation

**No API calls needed** - purely UI/UX integration

### With Existing UI Components

Uses existing shadcn/ui components:
- `Button` (from `@/components/ui/button`)
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` (from `@/components/ui/tabs`)
- `Input` (from `@/components/ui/input` or inline)
- `Textarea` (inline or from shadcn if exists)

**No new component contracts** - uses existing component APIs

## Browser APIs Used

This feature relies on standard browser APIs:

### 1. html-to-image Library API

```typescript
import { toPng } from 'html-to-image';

// Generate PNG from DOM element
await toPng(element: HTMLElement, options?: Options): Promise<string>;

interface Options {
  cacheBust?: boolean;      // Avoid cached resources
  pixelRatio?: number;      // DPI multiplier (2 = retina)
  backgroundColor?: string; // Background color
  width?: number;           // Custom width
  height?: number;          // Custom height
}
```

### 2. File Download API

```typescript
// Create download link and trigger
const link = document.createElement('a');
link.download = filename;
link.href = dataUrl; // From html-to-image
link.click();
```

### 3. Crypto API

```typescript
// Generate unique IDs for participants
const id = crypto.randomUUID(); // Returns UUID v4 string
```

## Error Handling

Since there are no API endpoints, error handling is limited to:

1. **Image Generation Failures**
   ```typescript
   try {
     const dataUrl = await toPng(element, options);
     // Download logic
   } catch (error) {
     console.error('Failed to generate screenshot:', error);
     // Display user-friendly error message
   }
   ```

2. **Validation Errors**
   ```typescript
   if (!groupName.trim()) {
     setError("Group name is required");
     return;
   }
   if (participants.length === 0) {
     setError("Add at least 1 participant");
     return;
   }
   ```

3. **Browser Compatibility**
   ```typescript
   if (!crypto.randomUUID) {
     // Fallback for older browsers (unlikely with modern Next.js)
     console.error("Browser does not support crypto.randomUUID");
   }
   ```

## Version History

- 2026-01-11: Initial contracts documentation
  - Confirmed no API endpoints required
  - Documented client-side TypeScript interfaces
  - Listed browser APIs used
  - Defined integration points
