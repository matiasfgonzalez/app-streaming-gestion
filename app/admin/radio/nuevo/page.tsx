import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RadioProgramForm } from "@/components/admin/radio-program-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo programa" };

export default async function NewProgramPage() {
  await requireRole("ADMIN", "EDITOR");
  return (
    <div className="space-y-6">
      <Link href="/admin/radio" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo programa</h1>
      <RadioProgramForm />
    </div>
  );
}
