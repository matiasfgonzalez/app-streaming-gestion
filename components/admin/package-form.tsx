"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { packageSchema, type PackageInput } from "@/lib/validations/ads";
import { createPackage, updatePackage } from "@/server/actions/packages";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium";

export function PackageForm({
  packageId,
  defaults,
}: {
  packageId?: string;
  defaults?: Partial<PackageInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      description: "",
      priceMonthly: 0,
      priceWeekly: 0,
      priceDaily: 0,
      features: "",
      active: true,
      order: 0,
      ...defaults,
    },
  });

  async function onSubmit(values: PackageInput) {
    setServerError(null);
    const res = packageId
      ? await updatePackage(packageId, values)
      : await createPackage(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <GlassCard className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="name">Nombre</label>
          <input id="name" className={inputCls} {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Descripción</label>
          <textarea id="description" rows={3} className={inputCls} {...register("description")} />
          {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="priceMonthly">Precio mensual</label>
            <input id="priceMonthly" type="number" className={inputCls} {...register("priceMonthly", { valueAsNumber: true })} />
            {errors.priceMonthly && <p className="mt-1 text-xs text-destructive">{errors.priceMonthly.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="priceWeekly">Semanal (0 = —)</label>
            <input id="priceWeekly" type="number" className={inputCls} {...register("priceWeekly", { valueAsNumber: true })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="priceDaily">Diario (0 = —)</label>
            <input id="priceDaily" type="number" className={inputCls} {...register("priceDaily", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="features">Características (una por línea)</label>
          <textarea id="features" rows={5} className={inputCls} {...register("features")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="order">Orden</label>
            <input id="order" type="number" className={inputCls} {...register("order", { valueAsNumber: true })} />
          </div>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
            <input type="checkbox" className="size-4" {...register("active")} />
            Activo (visible en la web)
          </label>
        </div>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {packageId ? "Guardar cambios" : "Crear paquete"}
      </button>
    </form>
  );
}
