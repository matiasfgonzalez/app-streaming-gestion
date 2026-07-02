"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { adminContractSchema, type AdminContractInput } from "@/lib/validations/ads";
import { adminCreateContract } from "@/server/actions/contracts";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

export function AdminContractForm({
  packages,
}: {
  packages: { id: string; name: string }[];
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminContractInput>({
    resolver: zodResolver(adminContractSchema),
    defaultValues: {
      packageId: packages[0]?.id ?? "",
      billingCycle: "MONTHLY",
      title: "",
      description: "",
      socials: "",
      status: "ACTIVE",
    },
  });

  async function onSubmit(values: AdminContractInput) {
    setServerError(null);
    const res = await adminCreateContract(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <GlassCard className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="title">Título de la publicidad</label>
          <input id="title" className={inputCls} {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="packageId">Paquete</label>
            <select id="packageId" className={inputCls} {...register("packageId")}>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="billingCycle">Ciclo</label>
            <select id="billingCycle" className={inputCls} {...register("billingCycle")}>
              <option value="MONTHLY">Mensual</option>
              <option value="WEEKLY">Semanal</option>
              <option value="DAILY">Por día</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="status">Estado</label>
            <select id="status" className={inputCls} {...register("status")}>
              <option value="ACTIVE">Activa</option>
              <option value="PENDING">Pendiente</option>
              <option value="DRAFT">Borrador</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Descripción</label>
          <textarea id="description" rows={3} className={inputCls} {...register("description")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="socials">Redes / links</label>
          <input id="socials" className={inputCls} placeholder="@cuenta, sitio web..." {...register("socials")} />
        </div>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Crear publicidad
      </button>
    </form>
  );
}
