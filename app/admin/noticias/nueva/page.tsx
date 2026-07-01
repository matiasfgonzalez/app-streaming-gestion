import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nueva noticia" };

export default async function NewNewsPage() {
  await requireRole("ADMIN", "EDITOR");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/noticias"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nueva noticia</h1>
      <NewsForm />
    </div>
  );
}
