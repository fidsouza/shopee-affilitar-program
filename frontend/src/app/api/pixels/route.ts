import { NextResponse } from 'next/server';

import { listPixels, upsertPixel } from '@/lib/repos/pixels';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pixels = await listPixels();
    return NextResponse.json(pixels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load pixels', details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pixel = await upsertPixel(body);
    return NextResponse.json(pixel, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Validation or save failed', details: String(error) },
      { status: 400 },
    );
  }
}
