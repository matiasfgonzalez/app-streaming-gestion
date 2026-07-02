"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { newsSchema, type NewsInput } from "@/lib/validations/news";
import { createNews, updateNews } from "@/server/actions/news";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select, Checkbox } from "@/components/ui";

export function NewsForm({
  newsId,
  defaults,
}: {
  newsId?: string;
  defaults?: Partial<NewsInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverUrl: "",
      videoUrl: "",
      podcastUrl: "",
      categories: "",
      tags: "",
      status: "DRAFT",
      featured: false,
      breaking: false,
      ...defaults,
    },
  });

  const coverUrl = watch("coverUrl");

  async function onSubmit(values: NewsInput) {
    setServerError(null);
    const res = newsId
      ? await updateNews(newsId, values)
      : await createNews(values);
    // En éxito, la action hace redirect (no retorna). Si retorna, es error.
    if (res && !res.ok) {
      setServerError(res.error);
      toast.error(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <GlassCard className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="title">Título</label>
            <input id="title" className={inputCls} {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="excerpt">Resumen</label>
            <textarea id="excerpt" rows={2} className={inputCls} {...register("excerpt")} />
            {errors.excerpt && <p className="mt-1 text-xs text-destructive">{errors.excerpt.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="content">Contenido</label>
            <textarea id="content" rows={12} className={inputCls} {...register("content")} />
            {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
          </div>
        </GlassCard>

        <GlassCard className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="videoUrl">Video (URL, opcional)</label>
            <input id="videoUrl" className={inputCls} placeholder="https://youtube.com/..." {...register("videoUrl")} />
            {errors.videoUrl && <p className="mt-1 text-xs text-destructive">{errors.videoUrl.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="podcastUrl">Podcast/Audio (URL, opcional)</label>
            <input id="podcastUrl" className={inputCls} placeholder="https://..." {...register("podcastUrl")} />
            {errors.podcastUrl && <p className="mt-1 text-xs text-destructive">{errors.podcastUrl.message}</p>}
          </div>
        </GlassCard>
      </div>

      {/* Sidebar de publicación */}
      <div className="space-y-5">
        <GlassCard className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="status">Estado</label>
            <Select id="status" {...register("status")}>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicada</option>
            </Select>
          </div>
          <Checkbox label="Destacada" {...register("featured")} />
          <Checkbox label="Breaking news" {...register("breaking")} />
        </GlassCard>

        <GlassCard className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="categories">Categorías (coma)</label>
            <input id="categories" className={inputCls} placeholder="Deportes, Eventos" {...register("categories")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tags">Etiquetas (coma)</label>
            <input id="tags" className={inputCls} placeholder="futbol, vivo" {...register("tags")} />
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <span className={labelCls}>Portada</span>
          {coverUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="Portada" className="aspect-video w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setValue("coverUrl", "")}
                className="glass absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full"
                aria-label="Quitar portada"
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
                  if (url) setValue("coverUrl", url);
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
        </GlassCard>

        {serverError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(neuButton(), "w-full")}
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {newsId ? "Guardar cambios" : "Crear noticia"}
        </button>
      </div>
    </form>
  );
}
