"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { streamingSchema, type StreamingInput } from "@/lib/validations/radio";
import { updateStreaming } from "@/server/actions/radio";
import { facebookEmbedUrl } from "@/lib/radio";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

export function StreamingForm({ defaults }: { defaults: StreamingInput }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StreamingInput>({
    resolver: zodResolver(streamingSchema),
    defaultValues: defaults,
  });

  const youtubeId = watch("youtubeId");
  const facebookUrl = watch("facebookUrl");
  const validFacebook =
    facebookUrl && /(facebook\.com\/|fb\.watch\/)/.test(facebookUrl) ? facebookUrl : "";

  async function onSubmit(values: StreamingInput) {
    setServerError(null);
    const res = await updateStreaming(values);
    if (res && !res.ok) {
      setServerError(res.error);
      toast.error(res.error);
    } else {
      toast.success("Streaming actualizado.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-2xl gap-5">
      <GlassCard className="space-y-4">
        <div>
          <label className={labelCls} htmlFor="youtubeId">ID del video/stream de YouTube</label>
          <input id="youtubeId" className={inputCls} placeholder="jfKfPfyJRdk" {...register("youtubeId")} />
          <p className="mt-1 text-xs text-muted-foreground">
            El código después de <code>watch?v=</code> o <code>youtu.be/</code>.
          </p>
          {errors.youtubeId && <p className="mt-1 text-xs text-destructive">{errors.youtubeId.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="facebookUrl">URL del vivo de Facebook (opcional)</label>
          <input
            id="facebookUrl"
            className={inputCls}
            placeholder="https://www.facebook.com/tupagina/videos/123456789"
            {...register("facebookUrl")}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Pegá el link de la transmisión o video <strong>público</strong> (desde Facebook:
            Compartir → Copiar enlace). Si cargás ambas plataformas, el sitio muestra pestañas
            para elegir.
          </p>
          {errors.facebookUrl && <p className="mt-1 text-xs text-destructive">{errors.facebookUrl.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="title">Título (opcional)</label>
          <input id="title" className={inputCls} {...register("title")} />
        </div>
        <div>
          <label className={labelCls} htmlFor="channelUrl">URL del canal (opcional)</label>
          <input id="channelUrl" className={inputCls} placeholder="https://youtube.com/@canal" {...register("channelUrl")} />
          {errors.channelUrl && <p className="mt-1 text-xs text-destructive">{errors.channelUrl.message}</p>}
        </div>
      </GlassCard>

      {youtubeId && (
        <GlassCard className="p-3">
          <p className="mb-2 px-1 text-xs text-muted-foreground">Vista previa · YouTube</p>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              key={youtubeId}
              className="size-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="Vista previa del stream de YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </GlassCard>
      )}

      {validFacebook && (
        <GlassCard className="p-3">
          <p className="mb-2 px-1 text-xs text-muted-foreground">Vista previa · Facebook</p>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              key={validFacebook}
              className="size-full"
              src={facebookEmbedUrl(validFacebook)}
              title="Vista previa del stream de Facebook"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Si se ve «contenido no disponible», el video no es público.
          </p>
        </GlassCard>
      )}

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Guardar
      </button>
    </form>
  );
}
