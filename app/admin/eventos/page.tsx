import { CalendarDays, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { requireRole } from "@/lib/auth";
import { getAllEventsAdmin } from "@/server/queries/events";
import { EVENT_STATUS_LABEL } from "@/lib/events";
import { formatDateTime } from "@/lib/format";
import { Badge, EmptyState } from "@/components/ui";

export const metadata = { title: "Eventos" };

export default async function AdminEventsPage() {
  await requireRole("ADMIN", "EDITOR");
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Eventos</h1>
          <p className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </p>
        </div>
        <Link href="/admin/eventos/nuevo" className={neuButton()}>
          <Plus /> Nuevo
        </Link>
      </div>

      {events.length === 0 ? (
        <GlassCard className="p-0">
          <EmptyState
            icon={CalendarDays}
            title="Todavía no hay eventos"
            description="Creá el primero para que aparezca en la agenda pública."
            action={
              <Link href="/admin/eventos/nuevo" className={neuButton()}>
                <Plus /> Nuevo evento
              </Link>
            }
          />
        </GlassCard>
      ) : (
        <GlassCard className="p-0">
          <ul className="divide-y divide-border">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Badge
                    variant={
                      e.status === "LIVE"
                        ? "primary"
                        : e.status === "UPCOMING"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {EVENT_STATUS_LABEL[e.status]}
                  </Badge>
                  <p className="mt-1 truncate font-medium">{e.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDateTime(e.startsAt)} · {e.venue ?? "sin lugar"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/eventos/${e.id}/editar`}
                    aria-label="Editar"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteEventButton id={e.id} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
