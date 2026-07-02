"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { computeEndDate } from "@/lib/ads";
import { paymentSchema, type PaymentInput } from "@/lib/validations/ads";
import { sendEmailSafe } from "@/server/emails/resend";
import { paymentResultEmail } from "@/server/emails/templates";

type ActionResult = { ok: false; error: string } | { ok: true };

/** Cliente: informa un pago de una de sus contrataciones. Queda PENDING. */
export async function createPayment(input: PaymentInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "No autorizado" };

  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  // El contrato debe ser del cliente (salvo admin).
  const contract = await db.adContract.findUnique({ where: { id: d.contractId } });
  if (!contract) return { ok: false, error: "Contrato no encontrado" };
  if (contract.clientId !== user.id && user.role !== "ADMIN") {
    return { ok: false, error: "No autorizado" };
  }

  await db.payment.create({
    data: {
      contractId: d.contractId,
      amount: d.amount,
      method: d.method,
      proofUrl: d.proofUrl && d.proofUrl.length > 0 ? d.proofUrl : null,
      notes: d.notes || null,
      status: "PENDING",
    },
  });

  revalidatePath(`/cliente/contrataciones/${d.contractId}`);
  revalidatePath("/admin/pagos");
  return { ok: true };
}

/**
 * Admin: aprueba o rechaza un pago. Al aprobar, activa la contratación y
 * notifica al cliente por email.
 */
export async function reviewPayment(
  id: string,
  approve: boolean,
  notes?: string,
): Promise<void> {
  const admin = await requireRole("ADMIN");

  const payment = await db.payment.update({
    where: { id },
    data: {
      status: approve ? "APPROVED" : "REJECTED",
      reviewedById: admin.id,
      reviewedAt: new Date(),
      paidAt: approve ? new Date() : null,
      notes: notes || undefined,
    },
    include: {
      contract: {
        include: { client: { select: { email: true } } },
      },
    },
  });

  if (approve) {
    const start = payment.contract.startDate ?? new Date();
    await db.adContract.update({
      where: { id: payment.contractId },
      data: {
        status: "ACTIVE",
        startDate: start,
        endDate: computeEndDate(start, payment.contract.billingCycle),
      },
    });
  }

  const clientEmail = payment.contract.client?.email;
  if (clientEmail) {
    const { subject, html } = paymentResultEmail({
      approved: approve,
      contractTitle: payment.contract.title,
      amount: formatMoney(payment.amount),
      notes,
    });
    await sendEmailSafe({ to: [clientEmail], subject, html });
  }

  revalidatePath("/admin/pagos");
  revalidatePath("/admin/publicidad");
  revalidatePath("/cliente");
}
