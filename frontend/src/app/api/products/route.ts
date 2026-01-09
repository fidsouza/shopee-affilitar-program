import { NextResponse } from 'next/server';

import { listProducts, upsertProduct } from '@/lib/repos/products';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(products, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=0, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load products', details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await upsertProduct(body);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Validation or save failed', details: String(error) },
      { status: 400 },
    );
  }
}
