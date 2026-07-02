"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ContractStatus } from "@prisma/client";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeEndDate } from "@/lib/ads";
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

  const now = new Date();
  await db.adContract.create({
    data: {
      packageId: d.packageId,
      billingCycle: d.billingCycle,
      title: d.title,
      description: d.description || null,
      socials: d.socials || null,
      status: d.status,
      startDate: d.status === "ACTIVE" ? now : null,
      endDate: d.status === "ACTIVE" ? computeEndDate(now, d.billingCycle) : null,
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

/** Cliente/Admin: reemplaza las creatividades (logo + imágenes) de un contrato. */
export async function updateContractCreatives(
  contractId: string,
  logoUrl: string | undefined,
  imageUrls: string[],
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "No autorizado" };

  const contract = await db.adContract.findUnique({ where: { id: contractId } });
  if (!contract) return { ok: false, error: "Contrato no encontrado" };
  if (contract.clientId !== user.id && user.role !== "ADMIN") {
    return { ok: false, error: "No autorizado" };
  }

  const items = creativesCreate(
    logoUrl && logoUrl.length > 0 ? logoUrl : undefined,
    imageUrls.slice(0, 6),
  );

  await db.$transaction([
    db.creative.deleteMany({ where: { contractId } }),
    ...(items.length > 0
      ? [db.creative.createMany({ data: items.map((i) => ({ ...i, contractId })) })]
      : []),
  ]);

  revalidatePath(`/cliente/contrataciones/${contractId}`);
  revalidatePath(`/admin/publicidad/${contractId}`);
  return { ok: true };
}

/** Admin: cambia el estado de una contratación. */
export async function updateContractStatus(
  id: string,
  status: ContractStatus,
): Promise<void> {
  await requireRole("ADMIN");

  let data: {
    status: ContractStatus;
    startDate?: Date;
    endDate?: Date;
  } = { status };

  if (status === "ACTIVE") {
    const current = await db.adContract.findUnique({ where: { id } });
    if (current) {
      const start = current.startDate ?? new Date();
      data = { status, startDate: start, endDate: computeEndDate(start, current.billingCycle) };
    }
  }

  await db.adContract.update({ where: { id }, data });
  revalidatePath("/admin/publicidad");
  revalidatePath(`/admin/publicidad/${id}`);
  revalidatePath("/cliente");
}
