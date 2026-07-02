import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { RadioProgramForm } from "@/components/admin/radio-program-form";
import { requireRole } from "@/lib/auth";
import { getProgramById } from "@/server/queries/radio";

export const metadata = { title: "Editar programa" };

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "EDITOR");
  const { id } = await params;
  const p = await getProgramById(id);
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/radio" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar programa</h1>
      <RadioProgramForm
        programId={p.id}
        defaults={{
          name: p.name,
          description: p.description ?? "",
          hosts: p.hosts.join(", "),
          guests: p.guests.join(", "),
          coverUrl: p.coverUrl ?? "",
          active: p.active,
          order: p.order,
          schedules: p.schedules.map((s) => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            isRerun: s.isRerun,
          })),
        }}
      />
    </div>
  );
}
