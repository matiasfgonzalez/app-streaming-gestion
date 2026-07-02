"use client";

import { useTransition } from "react";
import type { ContractStatus } from "@prisma/client";
import { CONTRACT_STATUS_LABEL } from "@/lib/ads";
import { updateContractStatus } from "@/server/actions/contracts";

const STATUSES: ContractStatus[] = [
  "DRAFT",
  "PENDING",
  "ACTIVE",
  "REJECTED",
  "EXPIRED",
];

export function ContractStatusSelect({
  id,
  value,
}: {
  id: string;
  value: ContractStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as ContractStatus;
        startTransition(() => {
          void updateContractStatus(id, next);
        });
      }}
      className="rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {CONTRACT_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
