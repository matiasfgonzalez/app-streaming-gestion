"use server";

import { revalidatePath } from "next/cache";
import type { QuoteStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { quoteSchema, type QuoteInput } from "@/lib/validations/quote";
import { adminRecipients, sendEmailSafe } from "@/server/emails/resend";
import { quoteRequestEmail } from "@/server/emails/templates";

type ActionResult = { ok: false; error: string } | { ok: true };

/** Público: crea una solicitud de presupuesto y notifica al admin por email. */
export async function createQuoteRequest(
  input: QuoteInput,
): Promise<ActionResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const quote = await db.quoteRequest.create({
    data: {
      name: d.name,
      contact: d.contact,
      services: d.services,
      venue: d.venue || null,
      dates: d.dates || null,
      schedule: d.schedule || null,
      details: d.details || null,
      eventId: d.eventId || null,
    },
    include: { event: { select: { name: true } } },
  });

  const { subject, html } = quoteRequestEmail({
    name: quote.name,
    contact: quote.contact,
    services: quote.services,
    venue: quote.venue,
    dates: quote.dates,
    schedule: quote.schedule,
    details: quote.details,
    eventName: quote.event?.name ?? null,
  });
  await sendEmailSafe({ to: adminRecipients(), subject, html });

  revalidatePath("/admin/presupuestos");
  return { ok: true };
}

/** Admin: cambia el estado de una solicitud. */
export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
): Promise<void> {
  await requireRole("ADMIN", "EDITOR");
  await db.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/presupuestos");
}
