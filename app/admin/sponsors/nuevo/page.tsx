import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo sponsor" };

export default async function NewSponsorPage() {
  await requireRole("ADMIN");
  return (
    <div className="space-y-6">
      <Link href="/admin/sponsors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo sponsor</h1>
      <SponsorForm />
    </div>
  );
}
