"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validations/settings";
import { updateSiteConfig } from "@/server/actions/settings";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

/** Campo de imagen de marca: preview + subir/quitar, con hint de tamaño. */
function BrandImageField({
  label,
  hint,
  value,
  onChange,
  onError,
  previewClass,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
  previewClass: string;
}) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
      {value ? (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className={cn("rounded-lg", previewClass)} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="glass absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full"
            aria-label={`Quitar ${label.toLowerCase()}`}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-6 text-muted-foreground">
          <ImagePlus className="size-6" />
          <UploadButton
            endpoint="brandAsset"
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.ufsUrl;
              if (url) onChange(url);
            }}
            onUploadError={(e) => onError(e.message)}
          />
        </div>
      )}
    </div>
  );
}

export function SiteConfigForm({ defaults }: { defaults: SiteConfigInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: defaults,
  });
  const logoUrl = watch("logoUrl") ?? "";
  const coverUrl = watch("coverUrl") ?? "";

  async function onSubmit(values: SiteConfigInput) {
    setServerError(null);
    const res = await updateSiteConfig(values);
    if (res && !res.ok) {
      setServerError(res.error);
      toast.error(res.error);
    } else {
      toast.success("Configuración guardada.");
    }
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
        <p className="text-xs text-muted-foreground">
          El nombre se usa en toda la web (navbar, footer, títulos): si mañana el proyecto pasa a
          llamarse de otra forma, cambialo acá y se actualiza en todos lados.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <BrandImageField
            label="Logo"
            hint="Cuadrado, fondo transparente (PNG). Recomendado: 512×512 px, máx. 4 MB. Se muestra en navbar, footer y panel."
            value={logoUrl}
            onChange={(url) => setValue("logoUrl", url, { shouldDirty: true })}
            onError={(msg) => toast.error(msg)}
            previewClass="size-24 bg-muted/50 object-contain p-2"
          />
          <BrandImageField
            label="Portada"
            hint="Apaisada 16:9 (JPG/PNG). Recomendado: 1920×1080 px, máx. 4 MB. Se muestra como imagen principal del hero de la landing."
            value={coverUrl}
            onChange={(url) => setValue("coverUrl", url, { shouldDirty: true })}
            onError={(msg) => toast.error(msg)}
            previewClass="aspect-video w-full max-w-64 object-cover"
          />
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
