"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deletePodcast } from "@/server/actions/radio";

export function DeletePodcastButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Eliminar"
      onClick={() => {
        if (!confirm("¿Eliminar este podcast?")) return;
        startTransition(() => {
          void deletePodcast(id);
        });
      }}
      className="inline-flex size-11 items-center justify-center rounded-lg md:size-9 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
