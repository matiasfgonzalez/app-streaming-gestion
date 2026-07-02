import { Pencil, Plus, Radio as RadioIcon } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { RadioTabs } from "@/components/admin/radio-tabs";
import { DeleteProgramButton } from "@/components/admin/delete-program-button";
import { requireRole } from "@/lib/auth";
import { getAllProgramsAdmin } from "@/server/queries/radio";
import { WEEKDAY_SHORT } from "@/lib/radio";
import { Badge, DataTable, EmptyState, type Column } from "@/components/ui";

export const metadata = { title: "Radio" };

type ProgramRow = Awaited<ReturnType<typeof getAllProgramsAdmin>>[number];

const columns: Column<ProgramRow>[] = [
  {
    key: "name",
    header: "Programa",
    primary: true,
    cell: (p) => (
      <div className="flex items-center gap-3">
        {p.coverUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.coverUrl} alt={p.name} className="size-11 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <RadioIcon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{p.name}</span>
            {!p.active && <Badge variant="neutral">Oculto</Badge>}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {p.hosts.length > 0 ? p.hosts.join(", ") : "Sin conductores"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "schedule",
    header: "Horarios",
    cell: (p) => (
      <span className="text-xs text-muted-foreground tnum">
        {p.schedules.length > 0
          ? p.schedules
              .map((s) => `${WEEKDAY_SHORT[s.day]} ${s.startTime}`)
              .slice(0, 4)
              .join(" · ")
          : "Sin horarios"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    action: true,
    cell: (p) => (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/admin/radio/${p.id}/editar`}
          aria-label="Editar"
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
        >
          <Pencil className="size-4" />
        </Link>
        <DeleteProgramButton id={p.id} />
      </div>
    ),
  },
];

export default async function AdminRadioPage() {
  await requireRole("ADMIN", "EDITOR");
  const programs = await getAllProgramsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Radio</h1>
          <p className="text-sm text-muted-foreground">{programs.length} programas</p>
        </div>
        <Link href="/admin/radio/nuevo" className={neuButton()}>
          <Plus /> Nuevo programa
        </Link>
      </div>

      <RadioTabs />

      {programs.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={RadioIcon}
            title="Todavía no hay programas"
            description="Creá el primer programa con sus conductores y horarios semanales."
            action={
              <Link href="/admin/radio/nuevo" className={neuButton()}>
                <Plus /> Nuevo programa
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <DataTable columns={columns} rows={programs} getKey={(p) => p.id} />
      )}
    </div>
  );
}
