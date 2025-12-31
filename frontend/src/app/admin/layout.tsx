"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/products", label: "Cadastrar Produto" },
  { href: "/admin/pixels", label: "Cadastrar Pixel" },
  { href: "/admin/whatsapp", label: "Páginas WhatsApp" },
  { href: "/admin/defaults", label: "Configurações padrão" },
];

function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card p-4">
      <div className="mb-4 text-lg font-semibold">Admin</div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <SideNav />
        <main className="flex-1 rounded-lg border bg-card p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}
