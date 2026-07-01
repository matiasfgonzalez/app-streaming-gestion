import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Nuevo evento" };

export default async function NewEventPage() {
  await requireRole("ADMIN", "EDITOR");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/eventos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver
      </Link>
      <h1 className="font-display text-2xl font-bold">Nuevo evento</h1>
      <EventForm />
    </div>
  );
}
