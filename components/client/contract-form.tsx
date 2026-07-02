"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { CreativesUploader } from "@/components/client/creatives-uploader";
import { contractSchema } from "@/lib/validations/ads";
import { createClientContract } from "@/server/actions/contracts";
import { cn } from "@/lib/utils";
import { z } from "zod";

const fieldsSchema = contractSchema.pick({
  billingCycle: true,
  title: true,
  description: true,
  socials: true,
});
type FieldsInput = z.infer<typeof fieldsSchema>;

const inputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium";

export function ClientContractForm({ packageId }: { packageId: string }) {
  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldsInput>({
    resolver: zodResolver(fieldsSchema),
    defaultValues: { billingCycle: "MONTHLY", title: "", description: "", socials: "" },
  });

  async function onSubmit(values: FieldsInput) {
    setServerError(null);
    const res = await createClientContract({
      ...values,
      packageId,
      logoUrl,
      imageUrls,
    });
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <GlassCard className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="title">Título de la publicidad</label>
          <input id="title" className={inputCls} {...register("title")} />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Descripción</label>
          <textarea id="description" rows={3} className={inputCls} {...register("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="billingCycle">Ciclo de facturación</label>
            <select id="billingCycle" className={inputCls} {...register("billingCycle")}>
              <option value="MONTHLY">Mensual</option>
              <option value="WEEKLY">Semanal</option>
              <option value="DAILY">Por día</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="socials">Redes / links</label>
            <input id="socials" className={inputCls} placeholder="@cuenta, sitio web..." {...register("socials")} />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <CreativesUploader
          logoUrl={logoUrl}
          imageUrls={imageUrls}
          onLogoChange={setLogoUrl}
          onImagesChange={setImageUrls}
          onError={setServerError}
        />
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Contratar
      </button>
    </form>
  );
}
