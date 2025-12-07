import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Affiliate Pixel Redirect MVP
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          Admin console e páginas de transição em Next.js + shadcn/ui
        </h1>
        <p className="text-base text-muted-foreground">
          Cadastre pixels, configure eventos padrão e gere links de redirecionamento com
          disparo de eventos browser + Conversion API.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/admin">Abrir dashboard</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/t/exemplo">Ver página de transição</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
