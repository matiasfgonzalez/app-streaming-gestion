import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MediaForm } from "@/components/admin/media-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo elemento" };

export default async function NewMediaPage() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <div className="space-y-6">
      <Link href="/admin/media" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo elemento</h1>
      <MediaForm />
    </div>
  );
}
