# Quickstart: Home Page Simplification and Admin Route Rename

**Branch**: `004-home-page-update` | **Date**: 2025-12-31

## Prerequisites

- Node.js 20+
- Yarn package manager
- Git

## Quick Implementation

### 1. Renomear diretório admin

```bash
cd frontend/src/app
mv admin parametrizacao
```

### 2. Atualizar home page

Substituir conteúdo de `frontend/src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold">
          Página em Construção
        </h1>
      </div>
    </main>
  );
}
```

### 3. Atualizar layout com emoji

Modificar `frontend/src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "🏷️",
  description: "",
};
```

### 4. Verificar build

```bash
cd frontend
yarn build
```

### 5. Testar localmente

```bash
yarn dev
```

Verificar:
- `http://localhost:3000/` → Página em Construção
- `http://localhost:3000/admin` → 404
- `http://localhost:3000/parametrizacao` → Dashboard

## Files Changed

| Arquivo | Ação |
|---------|------|
| `frontend/src/app/admin/` | Renomear para `parametrizacao/` |
| `frontend/src/app/page.tsx` | Simplificar conteúdo |
| `frontend/src/app/layout.tsx` | Atualizar metadata com emoji |
| `CLAUDE.md` | Atualizar documentação |

## Rollback

Se necessário reverter:

```bash
cd frontend/src/app
mv parametrizacao admin
git checkout -- page.tsx layout.tsx
```
