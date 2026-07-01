import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { requireRole } from "@/lib/auth";
import { getEventById } from "@/server/queries/events";
import { toDatetimeLocal } from "@/lib/format";

export const metadata = { title: "Editar evento" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN", "EDITOR");
  const { id } = await params;
  const ev = await getEventById(id);
  if (!ev) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/eventos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Editar evento</h1>
      <EventForm
        eventId={ev.id}
        defaults={{
          name: ev.name,
          description: ev.description,
          venue: ev.venue ?? "",
          address: ev.address ?? "",
          startsAt: toDatetimeLocal(ev.startsAt),
          endsAt: toDatetimeLocal(ev.endsAt),
          status: ev.status,
          coverUrl: ev.coverUrl ?? "",
          artists: ev.artists.join(", "),
          hosts: ev.hosts.join(", "),
        }}
      />
    </div>
  );
}
