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
