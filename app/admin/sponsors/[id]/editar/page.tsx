import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { requireRole } from "@/lib/auth";
import { getSponsorById } from "@/server/queries/banners";

export const metadata = { title: "Editar sponsor" };

export default async function EditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const s = await getSponsorById(id);
  if (!s) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/sponsors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar sponsor</h1>
      <SponsorForm
        sponsorId={s.id}
        defaults={{
          name: s.name,
          logoUrl: s.logoUrl ?? "",
          description: s.description ?? "",
          website: s.website ?? "",
          socials: s.socials ?? "",
          status: s.status,
          order: s.order,
        }}
      />
    </div>
  );
}
