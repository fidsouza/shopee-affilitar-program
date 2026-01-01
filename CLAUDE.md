# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Affiliate link redirect system with Facebook Meta Pixel tracking. The app provides an admin dashboard for managing affiliate products and pixel configurations, and generates transition pages (`/t/[slug]`) that fire Meta events before redirecting users to affiliate URLs.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: Node.js 20, TypeScript
- **Frontend**: React 19, Tailwind CSS, shadcn/ui (Radix UI)
- **Data Storage**: Vercel Edge Config (REST API)
- **Tracking**: Meta Pixel (client-side fbq) + Conversion API (server-side)
- **Validation**: Zod
- **Package Manager**: Yarn

## Commands

All commands run from `frontend/` directory:

```bash
yarn dev          # Start Next.js dev server
yarn build        # Production build
yarn start        # Start production server
yarn lint         # ESLint check
```

## Architecture

### Directory Structure

```
frontend/src/
├── app/
│   ├── (root)/           # "Página em Construção" - landing page simples
│   ├── parametrizacao/   # Admin dashboard (client components) - acessível via /parametrizacao
│   │   ├── products/     # Product CRUD
│   │   ├── pixels/       # Pixel configuration
│   │   └── whatsapp/     # WhatsApp group pages
│   ├── t/[slug]/         # Transition pages (Edge Runtime)
│   ├── w/[slug]/         # WhatsApp redirect pages
│   └── api/              # REST endpoints for products & pixels
├── components/
│   └── ui/               # shadcn components
└── lib/
    ├── repos/            # Server actions for data access
    ├── hooks/            # React hooks
    ├── edge-config.ts    # Vercel Edge Config wrapper
    ├── conversion-api.ts # Meta Conversion API client
    └── validation.ts     # Zod schemas
```

### Key Patterns

**Repository Pattern** (`lib/repos/`): Server-only data layer using `'use server'`. Manages Edge Config with index + individual records pattern.

**Transition Pages** (`/t/[slug]`): Edge Runtime for low-latency. Fires server-side Conversion API events, client-side fbq tracking, then redirects to affiliate URL.

**Dual Tracking**: Both server-side (Conversion API in `conversion-api.ts`) and client-side (fbq in `t/[slug]/client.tsx`) Meta event firing with event ID deduplication.

**Validation** (`lib/validation.ts`): Zod schemas enforce allowed affiliate hosts (Shopee, AliExpress, Mercado Livre, Amazon) and HTTPS-only URLs.

### Data Model

- **Product**: id, slug, title, affiliateUrl, pixelConfigId, events[], status, timestamps
- **Pixel**: id, label, pixelId, defaultEvents[], isDefault, timestamps

## Environment Variables

Required:
- `EDGE_CONFIG` - Vercel Edge Config connection string
- `EDGE_CONFIG_REST_API_URL` - Edge Config REST API endpoint
- `EDGE_CONFIG_REST_TOKEN` - Authentication token
- `FB_PIXEL_API_TOKEN` - Meta Pixel API access token
- `NEXT_PUBLIC_BASE_URL` - Base URL for transition links

Optional:
- `EDGE_CONFIG_TEAM_ID` - Vercel team ID
- `FB_TEST_EVENT_CODE` - Meta test event code for development

## Active Technologies
- TypeScript 5, Node.js 20 + Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui, Zod 4.1 (003-whatsapp-redirect-page)
- Vercel Edge Config (REST API) - pattern: index + individual records (003-whatsapp-redirect-page)
- TypeScript 5, Node.js 20 + Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui, Zod 4.1 (003-whatsapp-redirect-page)
- N/A (não há mudanças de dados) (004-home-page-update)
- TypeScript 5, Node.js 20 + Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI), Zod 4.1 (005-whatsapp-benefit-cards)
- Vercel Edge Config (REST API) - padrão: index + registros individuais (005-whatsapp-benefit-cards)

## Recent Changes
- 004-home-page-update: Home page simplificada para "Página em Construção", rota admin renomeada para /parametrizacao
- 003-whatsapp-redirect-page: Added TypeScript 5, Node.js 20 + Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui, Zod 4.1
