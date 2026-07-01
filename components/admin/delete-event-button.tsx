"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteEvent } from "@/server/actions/events";

export function DeleteEventButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Eliminar"
      onClick={() => {
        if (!confirm("¿Eliminar este evento? Esta acción no se puede deshacer."))
          return;
        startTransition(() => {
          void deleteEvent(id);
        });
      }}
      className="inline-flex size-9 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
