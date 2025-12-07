import { NextResponse } from "next/server";

import { deletePixel } from "@/lib/repos/pixels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: pixelId } = await params;
    await deletePixel({ pixelId });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete pixel", details: String(error) },
      { status: 400 },
    );
  }
}
