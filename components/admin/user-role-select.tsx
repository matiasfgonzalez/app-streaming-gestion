"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { ROLES, ROLE_LABEL } from "@/lib/users";
import { updateUserRole } from "@/server/actions/users";

const selectCls =
  "rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-50";

export function UserRoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(role);

  function onChange(next: string) {
    const prev = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const res = await updateUserRole(userId, next);
      if (res && !res.ok) {
        setValue(prev);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        <select
          value={value}
          disabled={disabled || pending}
          onChange={(e) => onChange(e.target.value)}
          className={selectCls}
          aria-label="Rol"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
