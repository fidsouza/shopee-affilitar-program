import { NextResponse } from "next/server";
import {
  getWhatsAppAppearance,
  updateWhatsAppAppearance,
} from "@/lib/repos/whatsapp-appearance";
import { ZodError } from "zod";

export async function GET() {
  try {
    const config = await getWhatsAppAppearance();
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'private, max-age=0, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error("Error fetching appearance config:", error);
    return NextResponse.json(
      { error: "Failed to fetch appearance config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const config = await updateWhatsAppAppearance(body);
    return NextResponse.json(config);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Error updating appearance config:", error);
    return NextResponse.json(
      { error: "Failed to update appearance config" },
      { status: 500 }
    );
  }
}
