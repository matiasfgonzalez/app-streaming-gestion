import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MediaForm } from "@/components/admin/media-form";
import { requireRole } from "@/lib/auth";
import { getMediaById } from "@/server/queries/media";

export const metadata = { title: "Editar elemento" };

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "EDITOR");
  const { id } = await params;
  const m = await getMediaById(id);
  if (!m) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/media" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar elemento</h1>
      <MediaForm
        mediaId={m.id}
        defaults={{
          type: m.type,
          title: m.title ?? "",
          url: m.url ?? "",
          youtubeId: m.youtubeId ?? "",
          caption: m.caption ?? "",
          featured: m.featured,
          order: m.order,
        }}
      />
    </div>
  );
}
