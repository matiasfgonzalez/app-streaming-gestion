"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ContractStatus } from "@prisma/client";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  contractSchema,
  adminContractSchema,
  type ContractInput,
  type AdminContractInput,
} from "@/lib/validations/ads";
import { adminRecipients, sendEmailSafe } from "@/server/emails/resend";
import { newContractEmail } from "@/server/emails/templates";

type ActionResult = { ok: false; error: string } | { ok: true };

function creativesCreate(logoUrl?: string, imageUrls?: string[]) {
  const items: { type: "LOGO" | "IMAGE"; url: string; order: number }[] = [];
  if (logoUrl) items.push({ type: "LOGO", url: logoUrl, order: 0 });
  (imageUrls ?? []).forEach((url, i) =>
    items.push({ type: "IMAGE", url, order: i + 1 }),
  );
  return items;
}

/** Cliente: contrata un paquete. Queda PENDING hasta que el admin apruebe. */
export async function createClientContract(
  input: ContractInput,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const parsed = contractSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const pkg = await db.package.findUnique({ where: { id: d.packageId } });
  if (!pkg || !pkg.active) return { ok: false, error: "Paquete no disponible" };

  const contract = await db.adContract.create({
    data: {
      clientId: user.id,
      packageId: d.packageId,
      billingCycle: d.billingCycle,
      title: d.title,
      description: d.description || null,
      socials: d.socials || null,
      status: "PENDING",
      creatives: {
        create: creativesCreate(
          d.logoUrl && d.logoUrl.length > 0 ? d.logoUrl : undefined,
          d.imageUrls,
        ),
      },
    },
  });

  const { subject, html } = newContractEmail({
    title: contract.title,
    packageName: pkg.name,
    clientName: user.name,
  });
  await sendEmailSafe({ to: adminRecipients(), subject, html });

  revalidatePath("/cliente");
  revalidatePath("/admin/publicidad");
  redirect(`/cliente/contrataciones/${contract.id}`);
}

/** Admin: crea una publicidad sin cliente ("de palabra"). */
export async function adminCreateContract(
  input: AdminContractInput,
): Promise<ActionResult> {
  await requireRole("ADMIN");
  const parsed = adminContractSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  await db.adContract.create({
    data: {
      packageId: d.packageId,
      billingCycle: d.billingCycle,
      title: d.title,
      description: d.description || null,
      socials: d.socials || null,
      status: d.status,
      startDate: d.status === "ACTIVE" ? new Date() : null,
      creatives: {
        create: creativesCreate(
          d.logoUrl && d.logoUrl.length > 0 ? d.logoUrl : undefined,
          d.imageUrls,
        ),
      },
    },
  });

  revalidatePath("/admin/publicidad");
  redirect("/admin/publicidad");
}

/** Admin: cambia el estado de una contratación. */
export async function updateContractStatus(
  id: string,
  status: ContractStatus,
): Promise<void> {
  await requireRole("ADMIN");
  await db.adContract.update({
    where: { id },
    data: {
      status,
      startDate: status === "ACTIVE" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/publicidad");
  revalidatePath("/cliente");
}
