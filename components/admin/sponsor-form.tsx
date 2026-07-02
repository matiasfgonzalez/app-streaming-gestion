"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { sponsorSchema, type SponsorInput } from "@/lib/validations/banners";
import { createSponsor, updateSponsor } from "@/server/actions/banners";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

export function SponsorForm({
  sponsorId,
  defaults,
}: {
  sponsorId?: string;
  defaults?: Partial<SponsorInput>;
}) {
  const [logoUrl, setLogoUrl] = useState(defaults?.logoUrl ?? "");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SponsorInput>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      socials: "",
      status: "ACTIVE",
      order: 0,
      ...defaults,
    },
  });

  async function onSubmit(values: SponsorInput) {
    setServerError(null);
    const payload = { ...values, logoUrl };
    const res = sponsorId
      ? await updateSponsor(sponsorId, payload)
      : await createSponsor(payload);
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
          <textarea id="description" rows={2} className={inputCls} {...register("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="website">Sitio web</label>
            <input id="website" className={inputCls} placeholder="https://..." {...register("website")} />
            {errors.website && <p className="mt-1 text-xs text-destructive">{errors.website.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="socials">Redes</label>
            <input id="socials" className={inputCls} {...register("socials")} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="status">Estado</label>
            <select id="status" className={inputCls} {...register("status")}>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="EXPIRED">Vencido</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="order">Orden</label>
            <input id="order" type="number" className={inputCls} {...register("order", { valueAsNumber: true })} />
          </div>
        </div>

        <div>
          <span className={labelCls}>Logo</span>
          <p className="mb-2 text-xs text-muted-foreground">Cuadrado ~500×500px, PNG. Máx 4MB.</p>
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
                endpoint="newsImage"
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.ufsUrl;
                  if (url) setLogoUrl(url);
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
        </div>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {sponsorId ? "Guardar cambios" : "Crear sponsor"}
      </button>
    </form>
  );
}
