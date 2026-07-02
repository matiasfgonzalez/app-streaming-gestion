"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { podcastSchema, type PodcastInput } from "@/lib/validations/radio";
import { createPodcast, updatePodcast } from "@/server/actions/radio";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select } from "@/components/ui";

export function PodcastForm({
  podcastId,
  programs,
  defaults,
}: {
  podcastId?: string;
  programs: { id: string; name: string }[];
  defaults?: Partial<PodcastInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PodcastInput>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: "",
      description: "",
      audioUrl: "",
      youtubeId: "",
      coverUrl: "",
      programId: "",
      publishedAt: "",
      ...defaults,
    },
  });

  const coverUrl = watch("coverUrl");

  async function onSubmit(values: PodcastInput) {
    setServerError(null);
    const res = podcastId
      ? await updatePodcast(podcastId, values)
      : await createPodcast(values);
    if (res && !res.ok) setServerError(res.error);
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
            <label className={labelCls} htmlFor="description">Descripción</label>
            <textarea id="description" rows={4} className={inputCls} {...register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="youtubeId">YouTube ID</label>
              <input id="youtubeId" className={inputCls} placeholder="dQw4w9WgXcQ" {...register("youtubeId")} />
              {errors.audioUrl && <p className="mt-1 text-xs text-destructive">{errors.audioUrl.message}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="publishedAt">Fecha</label>
              <input id="publishedAt" type="datetime-local" className={inputCls} {...register("publishedAt")} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Audio propio (mp3)</label>
            {watch("audioUrl") ? (
              <div className="flex items-center gap-3">
                <audio controls src={watch("audioUrl")} className="w-full" />
                <button
                  type="button"
                  onClick={() => setValue("audioUrl", "")}
                  aria-label="Quitar audio"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-4 text-muted-foreground">
                <UploadButton
                  endpoint="podcastAudio"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.ufsUrl;
                    if (url) setValue("audioUrl", url);
                  }}
                  onUploadError={(e) => setServerError(e.message)}
                />
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-5">
        <GlassCard>
          <label className={labelCls} htmlFor="programId">Programa</label>
          <Select id="programId" {...register("programId")}>
            <option value="">— Sin programa —</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
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
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
        )}

        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-full")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {podcastId ? "Guardar cambios" : "Crear podcast"}
        </button>
      </div>
    </form>
  );
}
