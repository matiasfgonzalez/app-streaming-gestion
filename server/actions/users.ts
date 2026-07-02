"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { ROLE_LABEL } from "@/lib/users";
import {
  roleSchema,
  clientProfileSchema,
  type ClientProfileInput,
} from "@/lib/validations/users";

type ActionResult = { ok: false; error: string } | { ok: true };

function nullify(v?: string) {
  return v && v.length > 0 ? v : null;
}

export async function updateUserRole(userId: string, role: string): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { ok: false, error: "Rol inválido" };

  // Un admin no puede cambiar su propio rol (evita autobloqueo).
  if (admin.id === userId) {
    return { ok: false, error: "No podés cambiar tu propio rol." };
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, error: "Usuario no encontrado" };

  await db.user.update({ where: { id: userId }, data: { role: parsed.data } });
  await logAudit({
    action: "update",
    entity: "User",
    entityId: userId,
    summary: `Rol de ${target.email}: ${ROLE_LABEL[target.role]} → ${ROLE_LABEL[parsed.data]}`,
    actor: admin,
  });

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
  return { ok: true };
}

export async function updateClientProfile(
  userId: string,
  input: ClientProfileInput,
): Promise<ActionResult> {
  const admin = await requireRole("ADMIN");
  const parsed = clientProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, error: "Usuario no encontrado" };

  const data = {
    company: nullify(parsed.data.company),
    phone: nullify(parsed.data.phone),
    taxId: nullify(parsed.data.taxId),
    notes: nullify(parsed.data.notes),
  };
  await db.clientProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
  await logAudit({
    action: "update",
    entity: "ClientProfile",
    entityId: userId,
    summary: `Perfil de cliente actualizado (${target.email})`,
    actor: admin,
  });

  revalidatePath(`/admin/usuarios/${userId}`);
  return { ok: true };
}
