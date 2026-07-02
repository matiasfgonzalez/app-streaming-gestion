"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { LANDING_SECTIONS, type SectionFlags } from "@/lib/sections";
import { updateSectionFlags } from "@/server/actions/settings";
import { cn } from "@/lib/utils";

export function SectionsForm({ defaults }: { defaults: SectionFlags }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SectionFlags>({ defaultValues: defaults });

  async function onSubmit(values: SectionFlags) {
    setServerError(null);
    const res = await updateSectionFlags(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <GlassCard className="p-0">
        <ul className="divide-y divide-border">
          {LANDING_SECTIONS.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm font-medium">{s.label}</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" {...register(s.key)} />
                <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
                <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </label>
            </li>
          ))}
        </ul>
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        El Hero (encabezado) siempre se muestra. Apagá el resto según necesites.
      </p>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Guardar secciones
      </button>
    </form>
  );
}
