"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { BANNER_PLACEMENT_LABEL, BANNER_PLACEMENTS } from "@/lib/banners";
import { bannerSchema, type BannerInput } from "@/lib/validations/banners";
import { createBanner, updateBanner } from "@/server/actions/banners";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select, Checkbox } from "@/components/ui";

export function BannerForm({
  bannerId,
  defaults,
}: {
  bannerId?: string;
  defaults?: Partial<BannerInput>;
}) {
  const [imageUrl, setImageUrl] = useState(defaults?.imageUrl ?? "");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      imageUrl: defaults?.imageUrl ?? "",
      link: "",
      placement: "HOME",
      active: true,
      order: 0,
      ...defaults,
    },
  });

  async function onSubmit(values: BannerInput) {
    setServerError(null);
    const res = bannerId
      ? await updateBanner(bannerId, values)
      : await createBanner(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <input type="hidden" {...register("imageUrl")} />
      <GlassCard className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="title">Título (opcional)</label>
          <input id="title" className={inputCls} {...register("title")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="placement">Ubicación</label>
            <Select id="placement" {...register("placement")}>
              {BANNER_PLACEMENTS.map((p) => (
                <option key={p} value={p}>{BANNER_PLACEMENT_LABEL[p]}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className={labelCls} htmlFor="order">Orden</label>
            <input id="order" type="number" className={inputCls} {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="link">Link (al hacer click)</label>
          <input id="link" className={inputCls} placeholder="https://..." {...register("link")} />
          {errors.link && <p className="mt-1 text-xs text-destructive">{errors.link.message}</p>}
        </div>
        <Checkbox label="Activo" {...register("active")} />

        <div>
          <span className={labelCls}>Imagen del banner</span>
          <p className="mb-2 text-xs text-muted-foreground">Horizontal ~1200×300px (banner ancho). Máx 4MB.</p>
          {imageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Banner" className="w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setValue("imageUrl", "");
                }}
                className="glass absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full"
                aria-label="Quitar imagen"
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
                  if (url) {
                    setImageUrl(url);
                    setValue("imageUrl", url, { shouldValidate: true });
                  }
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
          {errors.imageUrl && <p className="mt-1 text-xs text-destructive">{errors.imageUrl.message}</p>}
        </div>
      </GlassCard>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {bannerId ? "Guardar cambios" : "Crear banner"}
      </button>
    </form>
  );
}
