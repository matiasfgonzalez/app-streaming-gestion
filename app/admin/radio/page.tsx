import { Pencil, Plus, Radio as RadioIcon } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { RadioTabs } from "@/components/admin/radio-tabs";
import { DeleteProgramButton } from "@/components/admin/delete-program-button";
import { requireRole } from "@/lib/auth";
import { getAllProgramsAdmin } from "@/server/queries/radio";
import { WEEKDAY_SHORT } from "@/lib/radio";
import { cn } from "@/lib/utils";

export const metadata = { title: "Radio" };

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
        <GlassCard className="py-16 text-center text-muted-foreground">
          Todavía no hay programas. Creá el primero.
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {programs.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                {p.coverUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.coverUrl} alt={p.name} className="size-14 rounded-lg object-cover" />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <RadioIcon className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{p.name}</p>
                    {!p.active && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Oculto</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.hosts.length > 0 ? p.hosts.join(", ") : "Sin conductores"}
                    {" · "}
                    {p.schedules.length > 0
                      ? p.schedules
                          .map((s) => `${WEEKDAY_SHORT[s.day]} ${s.startTime}`)
                          .slice(0, 4)
                          .join(" · ")
                      : "Sin horarios"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/radio/${p.id}/editar`}
                    aria-label="Editar"
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted",
                    )}
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteProgramButton id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
