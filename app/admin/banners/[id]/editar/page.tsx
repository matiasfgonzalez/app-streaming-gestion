import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { BannerForm } from "@/components/admin/banner-form";
import { requireRole } from "@/lib/auth";
import { getBannerById } from "@/server/queries/banners";

export const metadata = { title: "Editar banner" };

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const b = await getBannerById(id);
  if (!b) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar banner</h1>
      <BannerForm
        bannerId={b.id}
        defaults={{
          title: b.title ?? "",
          imageUrl: b.imageUrl,
          link: b.link ?? "",
          placement: b.placement,
          active: b.active,
          order: b.order,
        }}
      />
    </div>
  );
}
