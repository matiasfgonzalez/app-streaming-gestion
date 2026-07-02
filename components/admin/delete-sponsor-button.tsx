"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteSponsor } from "@/server/actions/banners";

export function DeleteSponsorButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Eliminar"
      onClick={() => {
        if (!confirm("¿Eliminar este sponsor?")) return;
        startTransition(() => {
          void deleteSponsor(id);
        });
      }}
      className="inline-flex size-9 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
