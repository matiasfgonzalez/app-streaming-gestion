"use client";

import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { QUOTE_SERVICES } from "@/lib/events";
import { quoteSchema, type QuoteInput } from "@/lib/validations/quote";
import { createQuoteRequest } from "@/server/actions/quotes";
import { cn } from "@/lib/utils";

import { inputCls, labelCls, Select } from "@/components/ui";

export function QuoteForm({
  events = [],
  defaultEventId,
}: {
  events?: { id: string; name: string }[];
  defaultEventId?: string;
}) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      contact: "",
      services: [],
      venue: "",
      dates: "",
      schedule: "",
      details: "",
      eventId: defaultEventId ?? "",
    },
  });

  async function onSubmit(values: QuoteInput) {
    setServerError(null);
    const res = await createQuoteRequest(values);
    if (res.ok) {
      setSent(true);
      toast.success("Solicitud enviada. Te contactamos a la brevedad.");
    } else {
      setServerError(res.error);
      toast.error(res.error);
    }
  }

  if (sent) {
    return (
      <GlassCard className="flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="mt-3 font-display text-lg font-semibold">¡Solicitud enviada!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Te vamos a contactar con un presupuesto a la brevedad.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="q-name">Nombre</label>
            <input id="q-name" className={inputCls} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="q-contact">Email o teléfono</label>
            <input id="q-contact" className={inputCls} {...register("contact")} />
            {errors.contact && <p className="mt-1 text-xs text-destructive">{errors.contact.message}</p>}
          </div>
        </div>

        <div>
          <span className={labelCls}>Servicios que necesitás</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {QUOTE_SERVICES.map((s) => (
              <label
                key={s.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                <input type="checkbox" value={s.value} className="size-4" {...register("services")} />
                {s.label}
              </label>
            ))}
          </div>
          {errors.services && <p className="mt-1 text-xs text-destructive">{errors.services.message}</p>}
        </div>

        {events.length > 0 && (
          <div>
            <label className={labelCls} htmlFor="q-event">Evento (opcional)</label>
            <Select id="q-event" {...register("eventId")}>
              <option value="">— Ninguno / evento nuevo —</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </Select>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="q-venue">Lugar</label>
            <input id="q-venue" className={inputCls} {...register("venue")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="q-dates">Días</label>
            <input id="q-dates" className={inputCls} placeholder="12 y 13 de julio" {...register("dates")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="q-schedule">Horarios</label>
            <input id="q-schedule" className={inputCls} placeholder="20 a 23 hs" {...register("schedule")} />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="q-details">Información adicional</label>
          <textarea id="q-details" rows={4} className={inputCls} {...register("details")} />
        </div>

        {serverError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-full")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          <Send /> Solicitar presupuesto
        </button>
      </form>
    </GlassCard>
  );
}
