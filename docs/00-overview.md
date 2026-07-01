# Viva La Mañana — Overview del proyecto

> Documento maestro. Punto de entrada a la guía. Si estás empezando, leé este archivo primero y después seguí el orden numérico de `docs/`.

## 1. Qué es

Plataforma web **mobile-first** que nuclea todo lo del medio **Viva La Mañana**: programa de radio, canales de streaming, cobertura de eventos, noticias y venta de publicidad/sponsors, con un panel de administración tipo CMS (estilo WordPress + Vercel) donde casi todo el contenido es editable y las secciones se pueden habilitar/deshabilitar.

Hay dos grandes mundos:

- **Sitio público** → landing comercial + módulos de contenido (noticias, eventos, radio, streaming, sponsors, publicidad, contacto). Objetivo: difundir el programa y vender servicios de publicidad.
- **Panel admin (CMS)** → gestión total de contenido, publicidad, pagos, usuarios y configuración.

## 2. Alcance

**Incluido (a lo largo de las fases):**
- Landing con identidad visual propia, dark/light, mobile-first.
- Noticias, Eventos (con solicitud de presupuesto), Radio, Streaming (YouTube embebido).
- Publicidad: paquetes, contratación por cliente, pagos manuales con comprobante y aprobación.
- Sponsors y Banners gestionables.
- Panel admin CMS con RBAC.
- CMS de contenido de landing (secciones on/off) y configuración global.
- Theme engine (colores/tipografías editables) en fase posterior.
- Analytics y auditoría.
- Tienda **preparada pero inactiva**.

**A futuro / backlog (fuera del MVP):**
- Transmitir la radio propia desde la plataforma (por ahora es embed).
- Integración con Mercado Pago (por ahora pago manual).
- Migración de storage a Cloudflare R2.
- Internacionalización (por ahora solo español).

## 3. Roles

| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Control total: contenido, módulos, usuarios, pagos, settings, tema. |
| **EDITOR** (Periodista) | Crea/edita noticias, eventos, galerías, podcasts. No toca usuarios/pagos/settings. |
| **CLIENTE** | Contrata paquetes de publicidad, carga creatividades, informa pagos, solicita presupuestos. |
| **VISITANTE** | Público no autenticado: navega, escucha radio, ve streaming, envía formularios. |

Ver detalle de permisos en [02-arquitectura.md](02-arquitectura.md#rbac).

## 4. Decisiones tomadas (baseline del proyecto)

| Tema | Decisión |
|------|----------|
| Primer MVP | **Landing pública estática** (identidad visual primero, contenido seed). |
| Alcance CMS inicial | Contenido dinámico temprano; **tema fijo** al inicio, theme-engine en fase posterior. |
| Idioma | **Solo español** (sin i18n por ahora). |
| Storage | **UploadThing** ahora → Cloudflare R2 a futuro. |
| Pagos | **Manual** (transferencia/efectivo) con comprobante y aprobación. Mercado Pago a futuro. |
| Tienda | Modelada y preparada, **inactiva** (feature flag). |

## 5. Stack

Next.js 16 (App Router) · React 19 · TypeScript · Prisma · Neon (PostgreSQL) · Clerk · Zod · React Hook Form · ShadCN/UI · TailwindCSS v4 · Framer Motion · TanStack Table · Tremor/Recharts · UploadThing · Resend · Pino · Sentry · Vitest + Playwright · Vercel.

Detalle en [02-arquitectura.md](02-arquitectura.md).

## 6. Cómo usar esta guía

| Archivo | Contenido |
|---------|-----------|
| [00-overview.md](00-overview.md) | Este documento. |
| [01-vision-y-prompt.md](01-vision-y-prompt.md) | Especificación precisa (el "prompt"). |
| [02-arquitectura.md](02-arquitectura.md) | Stack, carpetas, RBAC, storage, emails. |
| [03-modelo-de-datos.md](03-modelo-de-datos.md) | Esquema Prisma comentado. |
| [04-design-system.md](04-design-system.md) | Identidad visual, tokens, mobile-first. |
| [05-roadmap.md](05-roadmap.md) | Fases/MVPs con checklist. |
| [06-modulos.md](06-modulos.md) | Spec funcional por módulo. |
| [CHANGELOG.md](CHANGELOG.md) | Bitácora de avance. |

## 7. Regla de oro para quien programe

Este proyecto usa **Next.js 16.x**, que puede diferir del conocimiento previo. **Antes de escribir código en cada fase, consultar `node_modules/next/dist/docs/01-app/`** (getting-started, guides, api-reference). Es obligatorio según `AGENTS.md`.
