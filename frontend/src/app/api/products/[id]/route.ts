import { NextResponse } from "next/server";

import { deleteProduct } from "@/lib/repos/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: productId } = await params;
    await deleteProduct({ productId });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product", details: String(error) },
      { status: 400 },
    );
  }
}
