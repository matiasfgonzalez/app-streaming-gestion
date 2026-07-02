import type { QuoteService } from "@prisma/client";
import { QUOTE_SERVICE_LABEL } from "@/lib/events";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#666;">${esc(label)}</td><td style="padding:6px 12px;font-weight:600;">${esc(value)}</td></tr>`;
}

/** Email al admin cuando llega una nueva solicitud de presupuesto. */
export function quoteRequestEmail(data: {
  name: string;
  contact: string;
  services: QuoteService[];
  venue?: string | null;
  dates?: string | null;
  schedule?: string | null;
  details?: string | null;
  eventName?: string | null;
}): { subject: string; html: string } {
  const services = data.services
    .map((s) => QUOTE_SERVICE_LABEL[s])
    .join(", ");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#e07000;">Nueva solicitud de presupuesto</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Nombre", data.name)}
      ${row("Contacto", data.contact)}
      ${row("Servicios", services)}
      ${row("Evento", data.eventName)}
      ${row("Lugar", data.venue)}
      ${row("Días", data.dates)}
      ${row("Horarios", data.schedule)}
      ${row("Detalles", data.details)}
    </table>
    <p style="color:#999;font-size:12px;margin-top:16px;">Viva La Mañana — panel de administración.</p>
  </div>`;

  return { subject: `Presupuesto: ${data.name}`, html };
}

/** Aviso al admin de una nueva contratación de publicidad. */
export function newContractEmail(data: {
  title: string;
  packageName: string;
  clientName?: string | null;
}): { subject: string; html: string } {
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#e07000;">Nueva contratación de publicidad</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Título", data.title)}
      ${row("Paquete", data.packageName)}
      ${row("Cliente", data.clientName)}
    </table>
    <p style="color:#999;font-size:12px;margin-top:16px;">Revisá el pago y aprobá la publicidad en el panel.</p>
  </div>`;
  return { subject: `Nueva contratación: ${data.title}`, html };
}

/** Aviso al cliente del resultado de la revisión de su pago. */
export function paymentResultEmail(data: {
  approved: boolean;
  contractTitle: string;
  amount: string;
  notes?: string | null;
}): { subject: string; html: string } {
  const estado = data.approved ? "aprobado" : "rechazado";
  const color = data.approved ? "#16a34a" : "#dc2626";
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:${color};">Tu pago fue ${estado}</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Publicidad", data.contractTitle)}
      ${row("Monto", data.amount)}
      ${row("Nota", data.notes)}
    </table>
    <p style="color:#999;font-size:12px;margin-top:16px;">${
      data.approved
        ? "¡Gracias! Tu publicidad quedó activa."
        : "Si creés que es un error, respondé este correo."
    }</p>
  </div>`;
  return { subject: `Pago ${estado}: ${data.contractTitle}`, html };
}
