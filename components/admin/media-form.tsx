"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { mediaSchema, type MediaInput } from "@/lib/validations/media";
import { createMedia, updateMedia } from "@/server/actions/media";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium";

export function MediaForm({
  mediaId,
  defaults,
}: {
  mediaId?: string;
  defaults?: Partial<MediaInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MediaInput>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      type: "IMAGE",
      title: "",
      url: "",
      youtubeId: "",
      caption: "",
      featured: false,
      order: 0,
      ...defaults,
    },
  });

  const type = watch("type");
  const url = watch("url");
  const youtubeId = watch("youtubeId");

  async function onSubmit(values: MediaInput) {
    setServerError(null);
    const res = mediaId ? await updateMedia(mediaId, values) : await createMedia(values);
    if (res && !res.ok) setServerError(res.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <GlassCard className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="type">Tipo</label>
            <select id="type" className={inputCls} {...register("type")}>
              <option value="IMAGE">Imagen (galería)</option>
              <option value="VIDEO">Video (YouTube)</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="order">Orden</label>
            <input id="order" type="number" className={inputCls} {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="title">Título</label>
          <input id="title" className={inputCls} {...register("title")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="caption">Descripción</label>
          <textarea id="caption" rows={2} className={inputCls} {...register("caption")} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" {...register("featured")} /> Destacada (primera en la landing)
        </label>
      </GlassCard>

      {type === "VIDEO" ? (
        <GlassCard className="space-y-3">
          <div>
            <label className={labelCls} htmlFor="youtubeId">YouTube ID</label>
            <input id="youtubeId" className={inputCls} placeholder="dQw4w9WgXcQ" {...register("youtubeId")} />
            {errors.youtubeId && <p className="mt-1 text-xs text-destructive">{errors.youtubeId.message}</p>}
          </div>
          {youtubeId && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                key={youtubeId}
                className="size-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                title="Vista previa"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </GlassCard>
      ) : (
        <GlassCard className="space-y-3">
          <span className={labelCls}>Imagen</span>
          {url ? (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Imagen" className="aspect-video w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setValue("url", "")}
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
                  const u = res?.[0]?.ufsUrl;
                  if (u) setValue("url", u);
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
          {errors.url && <p className="mt-1 text-xs text-destructive">{errors.url.message}</p>}
        </GlassCard>
      )}

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {mediaId ? "Guardar cambios" : "Agregar"}
      </button>
    </form>
  );
}
