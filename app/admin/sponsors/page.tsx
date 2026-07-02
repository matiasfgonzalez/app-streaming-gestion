import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteSponsorButton } from "@/components/admin/delete-sponsor-button";
import { requireRole } from "@/lib/auth";
import { getAllSponsorsAdmin } from "@/server/queries/banners";
import { SPONSOR_STATUS_LABEL } from "@/lib/banners";
import { cn } from "@/lib/utils";

export const metadata = { title: "Sponsors" };

const STATUS_CLS: Record<string, string> = {
  ACTIVE: "bg-primary/15 text-primary",
  INACTIVE: "bg-muted text-muted-foreground",
  EXPIRED: "bg-destructive/10 text-destructive",
};

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
        <GlassCard className="py-16 text-center text-muted-foreground">
          Todavía no hay sponsors.
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {sponsors.map((s) => (
              <li key={s.id} className="flex items-center gap-4 p-4">
                {s.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.logoUrl} alt={s.name} className="size-12 rounded-lg object-contain" />
                ) : (
                  <div className="size-12 rounded-lg bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{s.name}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_CLS[s.status])}>
                      {SPONSOR_STATUS_LABEL[s.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {s.clicks} clicks · {s.impressions} impresiones
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/sponsors/${s.id}/editar`}
                    aria-label="Editar"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteSponsorButton id={s.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
