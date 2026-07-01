import { CalendarDays, Clock, MapPin } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import { requireRole } from "@/lib/auth";
import { getAllQuotes } from "@/server/queries/quotes";
import { QUOTE_SERVICE_LABEL } from "@/lib/events";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Presupuestos" };

export default async function AdminQuotesPage() {
  await requireRole("ADMIN", "EDITOR");
  const quotes = await getAllQuotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Solicitudes de presupuesto</h1>
        <p className="text-sm text-muted-foreground">
          {quotes.length} {quotes.length === 1 ? "solicitud" : "solicitudes"}
        </p>
      </div>

      {quotes.length === 0 ? (
        <GlassCard className="py-16 text-center text-muted-foreground">
          Todavía no hay solicitudes.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <GlassCard key={q.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{q.name}</p>
                  <p className="text-sm text-muted-foreground">{q.contact}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(q.createdAt)}
                  </span>
                  <QuoteStatusSelect id={q.id} value={q.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {q.services.map((s) => (
                  <span key={s} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                    {QUOTE_SERVICE_LABEL[s]}
                  </span>
                ))}
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                {q.event?.name && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {q.event.name}
                  </span>
                )}
                {q.venue && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" /> {q.venue}
                  </span>
                )}
                {q.dates && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {q.dates}
                  </span>
                )}
                {q.schedule && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" /> {q.schedule}
                  </span>
                )}
              </div>

              {q.details && (
                <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm">{q.details}</p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
