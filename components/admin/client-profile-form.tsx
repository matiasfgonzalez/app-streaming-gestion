"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { clientProfileSchema, type ClientProfileInput } from "@/lib/validations/users";
import { updateClientProfile } from "@/server/actions/users";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

export function ClientProfileForm({
  userId,
  defaults,
}: {
  userId: string;
  defaults: ClientProfileInput;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ClientProfileInput>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: ClientProfileInput) {
    setServerError(null);
    setSaved(false);
    const res = await updateClientProfile(userId, values);
    if (res && !res.ok) setServerError(res.error);
    else setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GlassCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Perfil de cliente</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="company">Empresa</label>
            <input id="company" className={inputCls} {...register("company")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">Teléfono</label>
            <input id="phone" className={inputCls} {...register("phone")} />
          </div>
          <div>
            <label className={labelCls} htmlFor="taxId">CUIT / ID fiscal</label>
            <input id="taxId" className={inputCls} {...register("taxId")} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="notes">Notas internas</label>
          <textarea id="notes" rows={3} className={inputCls} {...register("notes")} />
        </div>

        {serverError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-fit")}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Guardar perfil
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm text-primary">
              <CheckCircle2 className="size-4" /> Guardado
            </span>
          )}
        </div>
      </GlassCard>
    </form>
  );
}
