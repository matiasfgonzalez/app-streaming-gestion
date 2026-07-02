"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { WEEKDAYS, WEEKDAY_LABEL } from "@/lib/radio";
import { radioProgramSchema, type RadioProgramInput } from "@/lib/validations/radio";
import { createProgram, updateProgram } from "@/server/actions/radio";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select, Checkbox } from "@/components/ui";

export function RadioProgramForm({
  programId,
  defaults,
}: {
  programId?: string;
  defaults?: Partial<RadioProgramInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RadioProgramInput>({
    resolver: zodResolver(radioProgramSchema),
    defaultValues: {
      name: "",
      description: "",
      hosts: "",
      guests: "",
      coverUrl: "",
      active: true,
      order: 0,
      schedules: [],
      ...defaults,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "schedules" });
  const coverUrl = watch("coverUrl");

  async function onSubmit(values: RadioProgramInput) {
    setServerError(null);
    const res = programId
      ? await updateProgram(programId, values)
      : await createProgram(values);
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
            <textarea id="description" rows={5} className={inputCls} {...register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="hosts">Conductores (coma)</label>
              <input id="hosts" className={inputCls} placeholder="Ana, Beto" {...register("hosts")} />
            </div>
            <div>
              <label className={labelCls} htmlFor="guests">Invitados (coma)</label>
              <input id="guests" className={inputCls} {...register("guests")} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={labelCls}>Horarios</span>
            <button
              type="button"
              onClick={() => append({ day: "MON", startTime: "08:00", endTime: "11:00", isRerun: false })}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <Plus className="size-4" /> Agregar
            </button>
          </div>
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin horarios. Agregá franjas semanales.</p>
          ) : (
            <ul className="space-y-3">
              {fields.map((f, i) => (
                <li key={f.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center">
                  <Select className="min-w-0" {...register(`schedules.${i}.day`)}>
                    {WEEKDAYS.map((d) => (
                      <option key={d} value={d}>{WEEKDAY_LABEL[d]}</option>
                    ))}
                  </Select>
                  <input type="time" className={inputCls} {...register(`schedules.${i}.startTime`)} />
                  <input type="time" className={inputCls} {...register(`schedules.${i}.endTime`)} />
                  <label className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                    <input type="checkbox" {...register(`schedules.${i}.isRerun`)} /> Repetición
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Quitar horario"
                    className="inline-flex size-9 items-center justify-center justify-self-end rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <div className="space-y-5">
        <GlassCard className="space-y-4">
          <Checkbox label="Activo (visible en el sitio)" {...register("active")} />
          <div>
            <label className={labelCls} htmlFor="order">Orden</label>
            <input id="order" type="number" className={inputCls} {...register("order", { valueAsNumber: true })} />
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
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
        )}

        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-full")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {programId ? "Guardar cambios" : "Crear programa"}
        </button>
      </div>
    </form>
  );
}
