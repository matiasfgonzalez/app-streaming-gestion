"use client";

import { useTransition } from "react";
import type { QuoteStatus } from "@prisma/client";
import { QUOTE_STATUS_LABEL } from "@/lib/events";
import { updateQuoteStatus } from "@/server/actions/quotes";

const STATUSES: QuoteStatus[] = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];

export function QuoteStatusSelect({
  id,
  value,
}: {
  id: string;
  value: QuoteStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as QuoteStatus;
        startTransition(() => {
          void updateQuoteStatus(id, next);
        });
      }}
      className="rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {QUOTE_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
