import { Handshake, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteSponsorButton } from "@/components/admin/delete-sponsor-button";
import { requireRole } from "@/lib/auth";
import { getAllSponsorsAdmin } from "@/server/queries/banners";
import { SPONSOR_STATUS_LABEL } from "@/lib/banners";
import { Badge, DataTable, EmptyState, type Column } from "@/components/ui";

export const metadata = { title: "Sponsors" };

type SponsorRow = Awaited<ReturnType<typeof getAllSponsorsAdmin>>[number];

const columns: Column<SponsorRow>[] = [
  {
    key: "name",
    header: "Sponsor",
    primary: true,
    cell: (s) => (
      <div className="flex items-center gap-3">
        {s.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={s.logoUrl} alt={s.name} className="size-10 shrink-0 rounded-lg object-contain" />
        ) : (
          <div className="size-10 shrink-0 rounded-lg bg-muted" />
        )}
        <span className="min-w-0 truncate font-medium">{s.name}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Estado",
    cell: (s) => (
      <Badge
        variant={s.status === "ACTIVE" ? "success" : s.status === "EXPIRED" ? "danger" : "neutral"}
      >
        {SPONSOR_STATUS_LABEL[s.status]}
      </Badge>
    ),
  },
  {
    key: "perf",
    header: "Rendimiento",
    cell: (s) => (
      <span className="text-xs text-muted-foreground tnum">
        {s.clicks} clicks · {s.impressions} impresiones
      </span>
    ),
  },
  {
    key: "actions",
    header: "Acciones",
    action: true,
    cell: (s) => (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/admin/sponsors/${s.id}/editar`}
          aria-label="Editar"
          className="inline-flex size-11 items-center justify-center rounded-lg md:size-9 text-foreground/80 transition-colors hover:bg-muted"
        >
          <Pencil className="size-4" />
        </Link>
        <DeleteSponsorButton id={s.id} />
      </div>
    ),
  },
];

export default async function AdminSponsorsPage() {
  await requireRole("ADMIN");
  const sponsors = await getAllSponsorsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Sponsors</h1>
          <p className="text-sm text-muted-foreground">{sponsors.length} sponsors</p>
        </div>
        <Link href="/admin/sponsors/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      {sponsors.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={Handshake}
            title="Todavía no hay sponsors"
            description="Sumá el primero para mostrarlo en la landing y medir sus clicks."
            action={
              <Link href="/admin/sponsors/nuevo" className={neuButton()}>
                <Plus /> Nuevo sponsor
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <DataTable columns={columns} rows={sponsors} getKey={(s) => s.id} />
      )}
    </div>
  );
}
