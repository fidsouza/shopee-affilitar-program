# Data Model: WhatsApp Group Social Proof Image Generator

**Feature**: 001-whatsapp-proof-generator
**Date**: 2026-01-11
**Status**: Complete

## Overview

This feature operates entirely on the client-side with ephemeral data (no persistence). Data models define the structure of React component state used to generate WhatsApp group screenshots.

## Entities

### 1. WhatsAppScreenshot

Represents the complete WhatsApp group screenshot being generated.

**Purpose**: Root entity containing all information needed to render and export a WhatsApp group chat screenshot.

**Attributes**:
| Attribute | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| `groupName` | string | Yes | "" | Max 100 chars | Name displayed in WhatsApp group header |
| `participants` | Participant[] | No | [] | Max 20 items | Array of participant entries ordered by display sequence |
| `createdAt` | Date | Yes | new Date() | Valid date | Timestamp when screenshot creation started (for filename) |
| `groupIconUrl` | string | No | undefined | Valid HTTPS URL or undefined | Optional custom group icon (defaults to placeholder) |

**Relationships**:
- Has many `Participant` (0 to 20)

**State Transitions**:
- `Empty` → Admin creates new screenshot
- `Editing` → Admin adds/edits/removes participants
- `Ready for Export` → Admin has added at least group name and 1 participant
- `Exported` → Screenshot downloaded (state resets or persists in form)

**Business Rules**:
- Group name is required for export
- Must have at least 1 participant with message to generate meaningful screenshot
- Participant order determines chat message sequence (top to bottom)
- Maximum 20 participants enforced (FR-010)

**Example**:
```typescript
const screenshot: WhatsAppScreenshot = {
  groupName: "Grupo VIP Shopee",
  participants: [
    { id: "uuid-1", label: "pessoa 1", name: "Maria", message: "Acabei de entrar!", timestamp: "10:30", order: 0 },
    { id: "uuid-2", label: "pessoa 2", name: "João", message: "Bem-vinda!", timestamp: "10:31", order: 1 }
  ],
  createdAt: new Date("2026-01-11T14:30:00"),
  groupIconUrl: undefined
};
```

---

### 2. Participant

Represents a single participant's message entry in the WhatsApp group chat.

**Purpose**: Individual chat message with participant information, displayed as a message bubble in the WhatsApp interface.

**Attributes**:
| Attribute | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| `id` | string | Yes | crypto.randomUUID() | Valid UUID | Unique identifier for React key and tab management |
| `label` | string | Yes | Auto-generated | Format: "pessoa N" | Sequential label (pessoa 1, pessoa 2, etc.) displayed in tab |
| `name` | string | No | "" | Max 50 chars | Participant display name shown above message bubble |
| `message` | string | Yes | "" | Max 500 chars | Message text content (supports emojis and special characters) |
| `timestamp` | string | Yes | Auto-generated | Format: HH:MM | Time shown next to message (e.g., "10:30") |
| `order` | number | Yes | Index-based | 0 to 19 | Display order in chat (0 = first message, 19 = last) |

**Relationships**:
- Belongs to one `WhatsAppScreenshot`

**State Transitions**:
- `New` → Admin clicks "Adicionar pessoa"
- `Editing` → Admin fills in name and message
- `Valid` → Name and message both filled (ready for screenshot)
- `Removed` → Admin deletes participant entry

**Business Rules**:
- `label` is auto-generated sequentially (pessoa 1, pessoa 2, ..., pessoa 20)
- When participant is removed, remaining participants are renumbered (pessoa 3 becomes pessoa 2 if pessoa 2 is deleted)
- `timestamp` is auto-generated incrementally (e.g., 10:30, 10:31, 10:32) to simulate realistic chat flow
- `order` determines vertical position in chat (lower order = higher in chat, like WhatsApp's chronological display)
- `name` is optional - if empty, displays as "pessoa N" in chat bubble
- `message` supports emojis via system keyboard input (rendered by browser's emoji font)

**Example**:
```typescript
const participant: Participant = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  label: "pessoa 1",
  name: "Priscila",
  message: "Muito obrigada! 🎉",
  timestamp: "10:30",
  order: 0
};
```

---

## Type Definitions (TypeScript)

```typescript
/**
 * Complete WhatsApp group screenshot configuration
 */
export interface WhatsAppScreenshot {
  /** Group name displayed in header */
  groupName: string;

  /** Ordered list of participant messages */
  participants: Participant[];

  /** Creation timestamp (for filename generation) */
  createdAt: Date;

  /** Optional custom group icon URL (HTTPS only) */
  groupIconUrl?: string;
}

/**
 * Individual participant message in group chat
 */
export interface Participant {
  /** Unique identifier (UUID) */
  id: string;

  /** Sequential label ("pessoa 1", "pessoa 2", etc.) */
  label: string;

  /** Optional display name (empty = use label) */
  name: string;

  /** Message text content */
  message: string;

  /** Auto-generated timestamp (HH:MM format) */
  timestamp: string;

  /** Display order (0-19, ascending from top) */
  order: number;
}

/**
 * Form state for WhatsApp screenshot generator component
 */
export interface WhatsAppGeneratorFormState {
  groupName: string;
  participants: Participant[];
  selectedParticipantId: string | null;
}

/**
 * Initial empty form state
 */
export const initialFormState: WhatsAppGeneratorFormState = {
  groupName: "",
  participants: [],
  selectedParticipantId: null
};
```

---

## Validation Rules

### WhatsAppScreenshot Validation

```typescript
const validateScreenshot = (screenshot: WhatsAppScreenshot): ValidationResult => {
  const errors: string[] = [];

  // Group name validation
  if (!screenshot.groupName.trim()) {
    errors.push("Group name is required");
  }
  if (screenshot.groupName.length > 100) {
    errors.push("Group name must be 100 characters or less");
  }

  // Participants validation
  if (screenshot.participants.length === 0) {
    errors.push("At least 1 participant is required");
  }
  if (screenshot.participants.length > 20) {
    errors.push("Maximum 20 participants allowed");
  }

  // Group icon URL validation (if provided)
  if (screenshot.groupIconUrl && !screenshot.groupIconUrl.startsWith('https://')) {
    errors.push("Group icon URL must use HTTPS");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### Participant Validation

```typescript
const validateParticipant = (participant: Participant): ValidationResult => {
  const errors: string[] = [];

  // Message validation (required)
  if (!participant.message.trim()) {
    errors.push("Message text is required");
  }
  if (participant.message.length > 500) {
    errors.push("Message must be 500 characters or less");
  }

  // Name validation (optional but has max length)
  if (participant.name.length > 50) {
    errors.push("Participant name must be 50 characters or less");
  }

  // Order validation
  if (participant.order < 0 || participant.order > 19) {
    errors.push("Participant order must be between 0 and 19");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

---

## State Management

### React Component State

```typescript
'use client';

import { useState } from 'react';

export default function WhatsAppGeneratorPage() {
  const [groupName, setGroupName] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  // Participant management functions
  const addParticipant = () => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      label: `pessoa ${participants.length + 1}`,
      name: "",
      message: "",
      timestamp: generateTimestamp(participants.length),
      order: participants.length
    };
    setParticipants([...participants, newParticipant]);
    setSelectedParticipantId(newParticipant.id);
  };

  const removeParticipant = (id: string) => {
    const filtered = participants.filter(p => p.id !== id);
    // Renumber remaining participants
    const renumbered = filtered.map((p, idx) => ({
      ...p,
      label: `pessoa ${idx + 1}`,
      order: idx,
      timestamp: generateTimestamp(idx)
    }));
    setParticipants(renumbered);

    // Update selected tab if current was deleted
    if (selectedParticipantId === id) {
      setSelectedParticipantId(renumbered[0]?.id ?? null);
    }
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const reorderParticipant = (id: string, direction: 'up' | 'down') => {
    const index = participants.findIndex(p => p.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= participants.length) return;

    const reordered = [...participants];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

    // Update order numbers and timestamps
    const updated = reordered.map((p, idx) => ({
      ...p,
      order: idx,
      timestamp: generateTimestamp(idx)
    }));

    setParticipants(updated);
  };

  return (
    // Component JSX...
  );
}
```

---

## Helper Functions

### Generate Timestamp

```typescript
/**
 * Generate auto-incrementing timestamp for participant messages
 * @param index - Participant index (0-based)
 * @returns Time string in HH:MM format
 */
const generateTimestamp = (index: number): string => {
  const baseTime = new Date();
  baseTime.setHours(10, 30, 0, 0); // Start at 10:30 AM
  baseTime.setMinutes(baseTime.getMinutes() + index); // Add 1 minute per participant

  const hours = baseTime.getHours().toString().padStart(2, '0');
  const minutes = baseTime.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};
```

### Generate Filename

```typescript
/**
 * Generate filename for downloaded screenshot
 * @param screenshot - WhatsApp screenshot data
 * @returns Filename string
 */
const generateFilename = (screenshot: WhatsAppScreenshot): string => {
  const timestamp = screenshot.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitizedGroupName = screenshot.groupName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `whatsapp-${sanitizedGroupName || 'grupo'}-${timestamp}.png`;
};
```

---

## Data Flow

1. **Initialize Form**
   ```
   User navigates to /parametrizacao/whatsapp-generator
   → Component mounts with initialFormState
   → Empty form displayed
   ```

2. **Enter Group Name**
   ```
   User types in group name input
   → setGroupName(value)
   → Preview header updates in real-time
   ```

3. **Add Participants**
   ```
   User clicks "Adicionar pessoa"
   → addParticipant()
   → New Participant created with auto-generated label, timestamp, order
   → Participant added to participants array
   → New tab appears in Tabs component
   → Tab automatically selected
   ```

4. **Edit Participant**
   ```
   User selects participant tab
   → setSelectedParticipantId(id)
   → Participant form displayed
   User types name and message
   → updateParticipant(id, { name, message })
   → Preview message bubble updates in real-time
   ```

5. **Reorder Participants**
   ```
   User clicks up/down arrow
   → reorderParticipant(id, direction)
   → Participants swapped in array
   → Order numbers recalculated
   → Timestamps regenerated
   → Preview updates immediately
   ```

6. **Remove Participant**
   ```
   User clicks remove button
   → removeParticipant(id)
   → Participant filtered out
   → Remaining participants renumbered (pessoa 3 → pessoa 2)
   → Order numbers recalculated (0, 1, 2, ...)
   → Timestamps regenerated (10:30, 10:31, 10:32)
   → If removed participant was selected, switch to first participant
   ```

7. **Export Screenshot**
   ```
   User clicks "Download" button
   → Validate screenshot (group name + at least 1 participant)
   → html-to-image captures preview element
   → PNG generated with 2x pixel ratio
   → File downloaded with auto-generated filename
   → Success message displayed
   ```

---

## No Persistence

**Important**: This feature does NOT persist data to any storage system.

- ❌ No Edge Config records created
- ❌ No API endpoints for save/retrieve
- ❌ No database tables
- ❌ No local storage
- ❌ No cookies

**Data Lifecycle**: Exists only in React component state during active session. When user navigates away or refreshes page, all data is lost. This is intentional per spec requirements.

**Rationale**: Admin downloads the generated screenshot image for use elsewhere (landing pages, social media). The screenshot generator is a tool, not a content management system.

---

## Version History

- 2026-01-11: Initial data model created
  - WhatsAppScreenshot entity (group name, participants, created timestamp)
  - Participant entity (id, label, name, message, timestamp, order)
  - TypeScript type definitions
  - Validation rules
  - React state management patterns
  - Helper functions (timestamp generation, filename generation)
  - Data flow documentation
