import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

/** Cliente Resend (null si no hay API key configurada). */
export const resend = apiKey ? new Resend(apiKey) : null;

/** Remitente por defecto. En dev usar el dominio de pruebas de Resend. */
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Viva La Mañana <onboarding@resend.dev>";

/**
 * Destinatarios de las notificaciones al equipo.
 * Prioriza NOTIFY_EMAIL (útil en dev: Resend en modo test solo entrega al email
 * dueño de la cuenta); si no está, cae a ADMIN_EMAILS.
 */
export function adminRecipients(): string[] {
  const raw = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Envía un email de forma tolerante a fallos: si Resend no está configurado o
 * falla, loguea y no lanza (para no romper el flujo que lo invoca).
 */
export async function sendEmailSafe(opts: {
  to: string[];
  subject: string;
  html: string;
}): Promise<void> {
  if (!resend || opts.to.length === 0) {
    console.warn("[email] Resend no configurado o sin destinatarios; se omite envío.");
    return;
  }
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (err) {
    console.error("[email] Error enviando con Resend:", err);
  }
}
