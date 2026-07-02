import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

type Actor = { id: string; email: string } | null | undefined;

type AuditParams = {
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
  actor?: Actor;
};

/**
 * Registra una acción sensible. Tolerante a fallos: nunca rompe la acción
 * principal si el log falla. Pasá `actor` si ya tenés el usuario a mano.
 */
export async function logAudit({ action, entity, entityId, summary, actor }: AuditParams) {
  try {
    await db.auditLog.create({
      data: {
        action,
        entity,
        entityId: entityId ?? null,
        summary,
        userId: actor?.id ?? null,
        userEmail: actor?.email ?? null,
      },
    });
  } catch (e) {
    logger.error("audit log failed", e);
  }
}
