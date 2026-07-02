"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { eventSchema, type EventInput } from "@/lib/validations/event";
import { createEvent, updateEvent } from "@/server/actions/events";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select } from "@/components/ui";

export function EventForm({
  eventId,
  defaults,
}: {
  eventId?: string;
  defaults?: Partial<EventInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      address: "",
      startsAt: "",
      endsAt: "",
      status: "UPCOMING",
      coverUrl: "",
      artists: "",
      hosts: "",
      ...defaults,
    },
  });

  const coverUrl = watch("coverUrl");

  async function onSubmit(values: EventInput) {
    setServerError(null);
    const res = eventId
      ? await updateEvent(eventId, values)
      : await createEvent(values);
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
            <label className={labelCls} htmlFor="name">Nombre</label>
            <input id="name" className={inputCls} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="description">Descripción</label>
            <textarea id="description" rows={8} className={inputCls} {...register("description")} />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="venue">Lugar</label>
              <input id="venue" className={inputCls} placeholder="Estadio Municipal" {...register("venue")} />
            </div>
            <div>
              <label className={labelCls} htmlFor="address">Dirección (para el mapa)</label>
              <input id="address" className={inputCls} placeholder="Av. Siempre Viva 123" {...register("address")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="startsAt">Inicio</label>
              <input id="startsAt" type="datetime-local" className={inputCls} {...register("startsAt")} />
              {errors.startsAt && <p className="mt-1 text-xs text-destructive">{errors.startsAt.message}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="endsAt">Fin (opcional)</label>
              <input id="endsAt" type="datetime-local" className={inputCls} {...register("endsAt")} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="artists">Artistas (coma)</label>
            <input id="artists" className={inputCls} {...register("artists")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="hosts">Conductores (coma)</label>
            <input id="hosts" className={inputCls} {...register("hosts")} />
          </div>
        </GlassCard>
      </div>

      <div className="space-y-5">
        <GlassCard>
          <label className={labelCls} htmlFor="status">Estado</label>
          <Select id="status" {...register("status")}>
            <option value="UPCOMING">Próximamente</option>
            <option value="LIVE">En vivo</option>
            <option value="FINISHED">Finalizado</option>
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
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-full")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {eventId ? "Guardar cambios" : "Crear evento"}
        </button>
      </div>
    </form>
  );
}
