import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BannerForm } from "@/components/admin/banner-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo banner" };

export default async function NewBannerPage() {
  await requireRole("ADMIN");
  return (
    <div className="space-y-6">
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo banner</h1>
      <BannerForm />
    </div>
  );
}
