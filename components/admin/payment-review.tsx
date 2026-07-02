"use client";

import { Check, Loader2, X } from "lucide-react";
import { useTransition } from "react";
import { reviewPayment } from "@/server/actions/payments";

export function PaymentReview({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function act(approve: boolean) {
    const notes = approve
      ? undefined
      : prompt("Motivo del rechazo (opcional):") ?? undefined;
    startTransition(() => {
      void reviewPayment(id, approve, notes);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => act(true)}
        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
        Aprobar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => act(false)}
        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-destructive disabled:opacity-50"
      >
        <X className="size-4" /> Rechazar
      </button>
    </div>
  );
}
