# Quickstart: WhatsApp Group Social Proof Image Generator

**Feature**: 001-whatsapp-proof-generator
**Date**: 2026-01-11
**For**: Developers implementing this feature

## Overview

This guide helps developers implement the WhatsApp Group Social Proof Image Generator feature quickly. The feature creates realistic WhatsApp group chat screenshots entirely on the client-side for use as social proof on landing pages.

## Prerequisites

- Existing Next.js 16 + React 19 + TypeScript 5 project (already in place)
- Familiarity with shadcn/ui and Radix UI Tabs component
- Basic understanding of html-to-image library

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd frontend
yarn add html-to-image
```

That's it! All other dependencies are already installed.

### 2. Verify Existing Components

Ensure these shadcn/ui components exist (they should already be in the project):

```bash
# Check for existing components
ls frontend/src/components/ui/button.tsx   # ✓ Should exist
ls frontend/src/components/ui/tabs.tsx     # ✓ Should exist
```

If missing, install via shadcn/ui CLI (unlikely):
```bash
npx shadcn-ui@latest add button tabs
```

## Implementation Steps

### Step 1: Create New Admin Route (10 minutes)

**Location**: `frontend/src/app/parametrizacao/whatsapp-generator/page.tsx`

**Create directory**:
```bash
mkdir -p frontend/src/app/parametrizacao/whatsapp-generator
```

**Create `page.tsx`** with basic structure:

```typescript
'use client';

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Type definitions (move to separate file later if needed)
interface Participant {
  id: string;
  label: string;
  name: string;
  message: string;
  timestamp: string;
  order: number;
}

export default function WhatsAppGeneratorPage() {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);

  // Helper: Generate timestamp
  const generateTimestamp = (index: number): string => {
    const base = new Date();
    base.setHours(10, 30 + index, 0, 0);
    return `${base.getHours().toString().padStart(2, '0')}:${base.getMinutes().toString().padStart(2, '0')}`;
  };

  // Add participant
  const addParticipant = () => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      label: `pessoa ${participants.length + 1}`,
      name: '',
      message: '',
      timestamp: generateTimestamp(participants.length),
      order: participants.length
    };
    setParticipants([...participants, newParticipant]);
    setSelectedParticipantId(newParticipant.id);
  };

  // Remove participant
  const removeParticipant = (id: string) => {
    const filtered = participants.filter(p => p.id !== id);
    const renumbered = filtered.map((p, idx) => ({
      ...p,
      label: `pessoa ${idx + 1}`,
      order: idx,
      timestamp: generateTimestamp(idx)
    }));
    setParticipants(renumbered);
    if (selectedParticipantId === id) {
      setSelectedParticipantId(renumbered[0]?.id ?? null);
    }
  };

  // Update participant
  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Download screenshot
  const downloadScreenshot = useCallback(async () => {
    if (!screenshotRef.current) return;

    // Validation
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    if (participants.length === 0 || !participants.some(p => p.message.trim())) {
      setError('Add at least 1 participant with a message');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const dataUrl = await toPng(screenshotRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#e5ddd5'
      });

      const link = document.createElement('a');
      link.download = `whatsapp-${groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setSuccess('Screenshot downloaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to generate screenshot: ${err}`);
    }
  }, [groupName, participants]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gerador de Provas de Whatsapp</h1>
        <p className="text-muted-foreground">
          Crie capturas de tela de grupos do WhatsApp para usar como prova social
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-4 rounded-lg bg-card p-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nome do Grupo *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Grupo VIP Shopee"
              maxLength={100}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Participantes</label>
            {participants.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum participante adicionado</p>
            ) : (
              <Tabs value={selectedParticipantId ?? ''} onValueChange={setSelectedParticipantId}>
                <TabsList className="w-full flex-wrap h-auto">
                  {participants.map((p) => (
                    <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>
                  ))}
                </TabsList>
                {participants.map((p) => (
                  <TabsContent key={p.id} value={p.id} className="space-y-3">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updateParticipant(p.id, 'name', e.target.value)}
                      placeholder="Nome (opcional)"
                      maxLength={50}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <textarea
                      value={p.message}
                      onChange={(e) => updateParticipant(p.id, 'message', e.target.value)}
                      placeholder="Mensagem *"
                      maxLength={500}
                      rows={3}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeParticipant(p.id)}
                    >
                      Remover {p.label}
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            )}
            <Button
              onClick={addParticipant}
              disabled={participants.length >= 20}
              className="w-full sm:w-auto"
            >
              + Adicionar Pessoa
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button onClick={downloadScreenshot} size="lg" className="w-full">
            Download Screenshot
          </Button>
        </div>

        {/* Right: Preview */}
        <div className="rounded-lg bg-card p-4">
          <h2 className="text-sm font-medium mb-3">Preview</h2>
          <div
            ref={screenshotRef}
            className="max-w-md mx-auto bg-[#e5ddd5] rounded-lg overflow-hidden shadow-lg"
          >
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {groupName || 'Nome do Grupo'}
                </p>
                <p className="text-xs opacity-90">
                  {participants.length} {participants.length === 1 ? 'participante' : 'participantes'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-2 min-h-[300px]">
              {participants.map((p) => (
                p.message.trim() && (
                  <div key={p.id} className="flex flex-col">
                    <div className="bg-white rounded-lg px-3 py-2 max-w-[80%] shadow-sm">
                      {p.name && <p className="text-xs font-semibold text-[#075e54] mb-1">{p.name}</p>}
                      <p className="text-sm break-words">{p.message}</p>
                      <p className="text-[10px] text-gray-500 text-right mt-1">{p.timestamp}</p>
                    </div>
                  </div>
                )
              ))}
              {participants.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-10">
                  Adicione participantes para visualizar o preview
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Add to Admin Navigation (5 minutes)

**Update**: `frontend/src/app/parametrizacao/layout.tsx` or equivalent navigation file

Add link to new generator page alongside existing admin tabs:

```typescript
// Example navigation (adapt to your existing pattern)
const adminNavItems = [
  { label: 'Produtos', href: '/parametrizacao/products' },
  { label: 'Pixels', href: '/parametrizacao/pixels' },
  { label: 'Páginas WhatsApp', href: '/parametrizacao/whatsapp' },
  { label: 'Gerador de Provas de Whatsapp', href: '/parametrizacao/whatsapp-generator' }, // NEW
];
```

### Step 3: Test Locally (10 minutes)

```bash
# Start dev server
cd frontend
yarn dev

# Navigate to http://localhost:3000/parametrizacao/whatsapp-generator

# Test workflow:
# 1. Enter group name
# 2. Click "Adicionar Pessoa"
# 3. Fill in participant name and message
# 4. Preview updates in real-time
# 5. Add more participants
# 6. Click "Download Screenshot"
# 7. Verify PNG file downloads with WhatsApp-style design
```

## Customization

### Enhance WhatsApp Design Accuracy

**Improve message bubbles**:
```tsx
<div className="bg-white rounded-lg px-3 py-2 shadow-md">
  {/* Add subtle border */}
  <div className="border-l-4 border-[#25D366] pl-2">
    {p.name && <p className="text-xs font-semibold text-[#075e54]">{p.name}</p>}
    <p className="text-sm">{p.message}</p>
  </div>
  <div className="flex items-center justify-end gap-1 mt-1">
    <p className="text-[10px] text-gray-500">{p.timestamp}</p>
    {/* Add read receipts (blue checkmarks) */}
    <span className="text-[10px] text-blue-500">✓✓</span>
  </div>
</div>
```

### Add Participant Reordering

```typescript
const moveParticipant = (id: string, direction: 'up' | 'down') => {
  const index = participants.findIndex(p => p.id === id);
  if (index === -1) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= participants.length) return;

  const reordered = [...participants];
  [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

  const updated = reordered.map((p, idx) => ({
    ...p,
    order: idx,
    timestamp: generateTimestamp(idx)
  }));

  setParticipants(updated);
};

// Add up/down buttons in participant tab
<div className="flex gap-2">
  <Button size="sm" onClick={() => moveParticipant(p.id, 'up')} disabled={p.order === 0}>↑</Button>
  <Button size="sm" onClick={() => moveParticipant(p.id, 'down')} disabled={p.order === participants.length - 1}>↓</Button>
</div>
```

### Add Group Icon Upload

```typescript
const [groupIconUrl, setGroupIconUrl] = useState('');

// In preview header
<div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
  {groupIconUrl ? (
    <img src={groupIconUrl} alt="Group icon" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gray-400"></div>
  )}
</div>

// In editor form
<input
  type="url"
  value={groupIconUrl}
  onChange={(e) => setGroupIconUrl(e.target.value)}
  placeholder="URL do ícone do grupo (HTTPS)"
  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
/>
```

## Common Issues & Solutions

### Issue: Emojis render differently across platforms

**Solution**: This is expected behavior. Emojis use system fonts. For consistency, consider documenting recommended emoji usage or providing emoji picker with preview.

### Issue: Next.js Image component not rendering in screenshot

**Solution**: Use standard `<img>` tags instead of Next.js `<Image>` component inside the `screenshotRef` div. html-to-image doesn't serialize Next.js Image components correctly.

```tsx
{/* ✗ Don't use Next.js Image in screenshot area */}
<Image src={iconUrl} alt="Icon" width={40} height={40} />

{/* ✓ Use standard img tag */}
<img src={iconUrl} alt="Icon" className="w-10 h-10 rounded-full" />
```

### Issue: Screenshot missing external stylesheets

**Solution**: Use Tailwind classes or inline styles only. External stylesheets may not serialize. html-to-image works best with inline styles.

### Issue: Screenshot quality is blurry

**Solution**: Ensure `pixelRatio: 2` is set in toPng options:
```typescript
await toPng(element, {
  pixelRatio: 2, // High DPI for retina displays
  cacheBust: true
});
```

## Performance Tips

1. **Debounce preview updates** if real-time rendering is slow:
   ```typescript
   const debouncedUpdate = useMemo(
     () => debounce((value) => setGroupName(value), 300),
     []
   );
   ```

2. **Lazy load html-to-image**:
   ```typescript
   const generateScreenshot = async () => {
     const { toPng } = await import('html-to-image');
     // Use toPng...
   };
   ```

3. **Limit preview re-renders** with `useMemo` for expensive components

## Next Steps

After basic implementation:

1. Add participant reordering (up/down arrows or drag-and-drop)
2. Add group icon upload support
3. Enhance WhatsApp visual design (read receipts, more accurate styling)
4. Add loading states during screenshot generation
5. Add unsaved changes warning before navigation
6. Consider adding preset templates (e.g., "5 participants with common messages")

## Resources

- [html-to-image Documentation](https://github.com/bubkoo/html-to-image)
- [Radix UI Tabs](https://www.radix-ui.com/docs/primitives/components/tabs)
- [WhatsApp Web Design Reference](https://web.whatsapp.com/)
- [Feature Spec](/specs/001-whatsapp-proof-generator/spec.md)
- [Data Model](/specs/001-whatsapp-proof-generator/data-model.md)
- [Research](/specs/001-whatsapp-proof-generator/research.md)

## Version History

- 2026-01-11: Initial quickstart guide created
  - Setup instructions
  - Basic implementation with code samples
  - Customization examples
  - Common issues and solutions
  - Performance tips
