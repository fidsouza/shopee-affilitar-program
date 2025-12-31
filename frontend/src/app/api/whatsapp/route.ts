import { NextResponse } from 'next/server';

import { listWhatsAppPages, upsertWhatsAppPage } from '@/lib/repos/whatsapp-pages';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pages = await listWhatsAppPages();
    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load WhatsApp pages', details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = await upsertWhatsAppPage(body);
    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Validation or save failed', details: String(error) },
      { status: 400 },
    );
  }
}
