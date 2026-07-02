"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validations/settings";
import { updateSiteConfig } from "@/server/actions/settings";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium";

export function SiteConfigForm({ defaults }: { defaults: SiteConfigInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: SiteConfigInput) {
    setServerError(null);
    const res = await updateSiteConfig(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-3xl gap-5">
      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Identidad</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="brandName">Nombre</label>
            <input id="brandName" className={inputCls} {...register("brandName")} />
            {errors.brandName && <p className="mt-1 text-xs text-destructive">{errors.brandName.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="tagline">Eslogan</label>
            <input id="tagline" className={inputCls} {...register("tagline")} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="description">Descripción</label>
          <textarea id="description" rows={2} className={inputCls} {...register("description")} />
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Contacto</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="email">Email</label>
            <input id="email" className={inputCls} {...register("contact.email")} />
            {errors.contact?.email && <p className="mt-1 text-xs text-destructive">{errors.contact.email.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">Teléfono</label>
            <input id="phone" className={inputCls} {...register("contact.phone")} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="address">Dirección</label>
          <input id="address" className={inputCls} {...register("contact.address")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="mapsUrl">Google Maps (URL de embed)</label>
          <input id="mapsUrl" className={inputCls} placeholder="https://www.google.com/maps/embed?..." {...register("contact.mapsUrl")} />
          <p className="mt-1 text-xs text-muted-foreground">
            En Maps: Compartir → Insertar un mapa → copiá el valor de <code>src</code>.
          </p>
          {errors.contact?.mapsUrl && <p className="mt-1 text-xs text-destructive">{errors.contact.mapsUrl.message}</p>}
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Redes</h2>
        <p className="text-xs text-muted-foreground">Dejá vacío para ocultar el ícono.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["instagram", "Instagram"],
            ["facebook", "Facebook"],
            ["youtube", "YouTube"],
            ["tiktok", "TikTok"],
            ["whatsapp", "WhatsApp"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className={labelCls} htmlFor={key}>{label}</label>
              <input id={key} className={inputCls} placeholder="https://..." {...register(`socials.${key}`)} />
              {errors.socials?.[key] && <p className="mt-1 text-xs text-destructive">{errors.socials[key]?.message}</p>}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">SEO</h2>
        <div>
          <label className={labelCls} htmlFor="seoTitle">Título (metadata)</label>
          <input id="seoTitle" className={inputCls} {...register("seo.title")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="seoDesc">Descripción (metadata)</label>
          <textarea id="seoDesc" rows={2} className={inputCls} {...register("seo.description")} />
        </div>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Guardar configuración
      </button>
    </form>
  );
}
