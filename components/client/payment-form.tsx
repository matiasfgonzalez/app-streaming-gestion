"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlassCard } from "@/components/glass/glass-card";
import { neuButton } from "@/components/glass/neu-button";
import { UploadButton } from "@/lib/uploadthing";
import { paymentSchema, type PaymentInput } from "@/lib/validations/ads";
import { createPayment } from "@/server/actions/payments";
import { cn } from "@/lib/utils";

import { inputCls, labelCls } from "@/components/ui";

export function PaymentForm({
  contractId,
  defaultAmount,
}: {
  contractId: string;
  defaultAmount: number;
}) {
  const [proofUrl, setProofUrl] = useState("");
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      contractId,
      amount: defaultAmount,
      method: "TRANSFER",
      proofUrl: "",
      notes: "",
    },
  });

  async function onSubmit(values: PaymentInput) {
    setServerError(null);
    const res = await createPayment({ ...values, proofUrl });
    if (res.ok) setSent(true);
    else setServerError(res.error);
  }

  if (sent) {
    return (
      <GlassCard className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="mt-2 font-display font-semibold">Pago informado</p>
        <p className="text-sm text-muted-foreground">Queda pendiente de validación.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("contractId")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="amount">Monto</label>
            <input id="amount" type="number" className={inputCls} {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="method">Método</label>
            <select id="method" className={inputCls} {...register("method")}>
              <option value="TRANSFER">Transferencia</option>
              <option value="CASH">Efectivo</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="notes">Nota (opcional)</label>
          <input id="notes" className={inputCls} {...register("notes")} />
        </div>
        <div>
          <span className={labelCls}>Comprobante (imagen o PDF)</span>
          {proofUrl ? (
            <p className="text-sm text-primary">Comprobante cargado ✓</p>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-4 text-muted-foreground">
              <FileUp className="size-5" />
              <UploadButton
                endpoint="paymentProof"
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.ufsUrl;
                  if (url) setProofUrl(url);
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
            </div>
          )}
        </div>

        {serverError && (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
        )}

        <button type="submit" disabled={isSubmitting} className={cn(neuButton(), "w-full")}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Informar pago
        </button>
      </form>
    </GlassCard>
  );
}
