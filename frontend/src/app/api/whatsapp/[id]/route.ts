import { NextResponse } from "next/server";

import { deleteWhatsAppPage } from "@/lib/repos/whatsapp-pages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    await deleteWhatsAppPage({ pageId });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete WhatsApp page", details: String(error) },
      { status: 400 },
    );
  }
}
