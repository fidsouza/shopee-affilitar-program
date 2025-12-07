import { notFound } from "next/navigation";

import { ClientTracker } from "./client";
import { headers } from "next/headers";
import { getProductBySlug } from "@/lib/repos/products";
import { readValue } from "@/lib/edge-config";
import type { PixelRecord } from "@/lib/repos/pixels";
import { META_STANDARD_EVENTS } from "@/lib/meta-events";
import { generateEventId, sendConversionEvent } from "@/lib/conversion-api";
import { logError, logInfo } from "@/lib/logging";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TransitionPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  if (product.status === "inactive") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Link inativo</h1>
          <p className="text-muted-foreground">
            Este link de transição está desativado. Nenhum evento foi disparado.
          </p>
        </div>
      </main>
    );
  }

  const pixel = await readValue<PixelRecord>(`pixels_${product.pixelConfigId}`);
  if (!pixel) {
    logError("Pixel não encontrado para produto", { productId: product.id, pixelId: product.pixelConfigId });
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Configuração inválida</h1>
          <p className="text-muted-foreground">
            Nenhum pixel está associado a este link. Nenhum evento foi disparado.
          </p>
        </div>
      </main>
    );
  }

  const events = Array.from(
    new Set(product.events.filter((e) => META_STANDARD_EVENTS.includes(e))),
  );
  const eventId = generateEventId();
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const host = hdrs.get("host") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const sourceUrl = `${proto}://${host}/t/${product.slug}`;

  // Fire Conversion API server-side (best effort)
  await Promise.all(
    events.map((event) =>
      sendConversionEvent({
        pixelId: pixel.pixelId,
        eventName: event,
        eventId,
        eventSourceUrl: sourceUrl || "",
      }).catch((err) => logError("CAPI send failed in page", { error: String(err), event })),
    ),
  );

  logInfo("Transition page render", { slug: product.slug, events, pixelId: pixel.pixelId });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex max-w-xl flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">Preparando redirecionamento...</p>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="text-muted-foreground">
          Estamos carregando a pagina do produto.
        </p>
        <ClientTracker
          pixelId={pixel.pixelId}
          events={events}
          eventId={eventId}
          targetUrl={product.affiliateUrl}
        />
      </div>
    </main>
  );
}
