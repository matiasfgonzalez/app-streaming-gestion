"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
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

      <GlassCard className="space-y-4">
        <div>
          <span className={labelCls}>Logo</span>
          {logoUrl ? (
            <div className="relative w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="aspect-square w-40 rounded-lg object-contain" />
              <button
                type="button"
                onClick={() => setLogoUrl("")}
                className="glass absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full"
                aria-label="Quitar logo"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-muted-foreground">
              <ImagePlus className="size-6" />
              <UploadButton
                endpoint="adCreative"
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.ufsUrl;
                  if (url) setLogoUrl(url);
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
        </div>

        <div>
          <span className={labelCls}>Imágenes de la publicidad</span>
          {imageUrls.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {imageUrls.map((url) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Creatividad" className="aspect-square w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((u) => u !== url))}
                    className="glass absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full"
                    aria-label="Quitar imagen"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <UploadDropzone
            endpoint="adCreative"
            onClientUploadComplete={(res) => {
              const urls = (res ?? []).map((f) => f.ufsUrl).filter(Boolean);
              setImageUrls((prev) => [...prev, ...urls].slice(0, 6));
            }}
            onUploadError={(e) => setServerError(e.message)}
          />
        </div>
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
