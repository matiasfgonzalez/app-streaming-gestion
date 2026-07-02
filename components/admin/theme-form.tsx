"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { DEFAULT_THEME, FONT_NAMES } from "@/lib/theme";
import { themeSchema, type ThemeInput } from "@/lib/validations/theme";
import { updateTheme } from "@/server/actions/settings";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

function ColorField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input
        type="color"
        className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
        {...props}
      />
      <span className="font-medium">{label}</span>
    </label>
  );
}

export function ThemeForm({ defaults }: { defaults: ThemeInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ThemeInput>({
    resolver: zodResolver(themeSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: ThemeInput) {
    setServerError(null);
    const res = await updateTheme(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <GlassCard className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Paleta — Claro</h2>
          <ColorField label="Primario" {...register("light.primary")} />
          <ColorField label="Secundario" {...register("light.secondary")} />
          <ColorField label="Acento" {...register("light.accent")} />
        </GlassCard>
        <GlassCard className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Paleta — Oscuro</h2>
          <ColorField label="Primario" {...register("dark.primary")} />
          <ColorField label="Secundario" {...register("dark.secondary")} />
          <ColorField label="Acento" {...register("dark.accent")} />
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Tipografías</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="fontDisplay">Títulos (display)</label>
            <select id="fontDisplay" className={inputCls} {...register("fontDisplay")}>
              {FONT_NAMES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="fontBody">Texto (body)</label>
            <select id="fontBody" className={inputCls} {...register("fontBody")}>
              {FONT_NAMES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Estilo</h2>
        <div>
          <label className={labelCls} htmlFor="radius">Radio de bordes (rem)</label>
          <input
            id="radius"
            type="number"
            step="0.1"
            min="0"
            max="2"
            className={cn(inputCls, "max-w-40")}
            {...register("radius", { valueAsNumber: true })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...register("animations")} /> Animaciones (aurora de fondo)
        </label>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Guardar tema
        </button>
        <button
          type="button"
          onClick={() => reset(DEFAULT_THEME)}
          className={cn(neuButton({ variant: "glass" }), "w-fit")}
        >
          <RotateCcw className="size-4" /> Restaurar por defecto
        </button>
      </div>
    </form>
  );
}
