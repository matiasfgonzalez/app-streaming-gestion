# Roadmap por fases

> Cada fase entrega un **MVP demostrable**. Regla de cierre de fase: `npm run build` y `npm run lint` sin errores, algo visible funcionando, y actualizar este archivo + [CHANGELOG.md](CHANGELOG.md).
>
> Antes de codear cada fase: revisar `node_modules/next/dist/docs/01-app/`.

Leyenda: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho.

---

## Fase 0 — Fundaciones ✅
- [x] Docs `docs/` creados (Entregable 0).
- [x] Config Tailwind v4 + design tokens (CSS variables) en `globals.css`.
- [x] ShadCN/UI listo (`components.json` + `cn()`); componentes se agregan on-demand.
- [x] Framer Motion instalado.
- [x] Theme provider (dark/light, sin flash con `next-themes`) en root layout.
- [x] Fuentes: Space Grotesk (display) + Inter (texto).
- [x] Componentes base: `GlassCard`, `NeuButton`, `AuroraBackground`, `Section/Container/SectionHeading`, `ThemeToggle`, `Navbar`, `BottomNav`, `MobileDrawer`, `Footer`.
- [x] Route group `(public)` con layout (Navbar + BottomNav + Footer) + home demo.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** layout base mobile-first con dark/light funcionando. ✅

## Fase 1 — Landing pública (primer MVP visible) ✅
- [x] Secciones con contenido **seed** (`lib/landing-data.ts`): hero, stats, qué es, radio, streaming, noticias, eventos, cobertura deportiva, publicidad+paquetes, sponsors, galería, videos, testimonios, FAQ, contacto+mapa.
- [x] Identidad visual aplicada (glass/neu/aurora/glow) + animaciones (`Reveal`, waveform, marquee).
- [x] Mobile-first: bottom-nav, drawer, safe-area, `Reveal` respeta reduced-motion.
- [x] Streaming = embed YouTube; Radio = reproductor placeholder (play/pausa visual); Estadísticas = contadores.
- [x] Formulario de contacto (front, sin persistencia — Fase 4/8).
- [x] Placeholders de imagen por gradiente (`MediaPlaceholder`), sin assets externos.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** landing navegable, responsive, dark/light. ✅
- Pendiente menor: rutas internas (`/noticias`, `/eventos`, `/radio`, `/publicidad`) aún 404 — se crean en sus fases.

## Fase 2 — Base de datos + Auth + RBAC ✅
- [x] Prisma **7** + Neon conectados; esquema núcleo (User, ClientProfile, SiteSetting, Category, Tag) + enum Role. Migración `init` aplicada.
- [x] `lib/db.ts` (singleton con driver adapter `@prisma/adapter-pg`), `lib/auth.ts` (`getCurrentUser` con lazy-sync, `requireRole`, `hasRole`).
- [x] Clerk: sign-in/up (`app/(auth)`), `proxy.ts` (protege /admin, /cliente), provider en root layout (localización esES), controles en navbar.
- [x] `AdminShell` (dashboard-first, sidebar+drawer) protegido por rol; `/admin` dashboard con KPIs.
- [x] `npm run build` y `npm run lint` OK.
- **Entregable:** login real, roles, admin accesible solo a ADMIN/EDITOR. ✅
- **Bootstrap admin:** agregar `ADMIN_EMAILS="tu@mail.com"` en `.env` para que ese usuario se cree como ADMIN al primer login.
- **Deviaciones vs plan:** Prisma 7 (URL en `prisma.config.ts` + driver adapter, no en schema); `middleware.ts`→`proxy.ts` (deprecación Next 16); Clerk v7 (sin `SignedIn/SignedOut`, se usa `useUser`). Webhook de sync pospuesto: se usa **lazy-sync** en `getCurrentUser` (no requiere URL pública).

## Fase 3 — Noticias (primer CRUD end-to-end)
- [ ] CRUD admin (TanStack Table, RHF + Zod, UploadThing portada/galería).
- [ ] Categorías y tags.
- [ ] Render público: listado `/noticias`, detalle `/noticias/[slug]`, destacadas/breaking en landing.
- [ ] Tests Vitest de actions/validaciones.
- **Entregable:** EDITOR crea noticia → aparece en landing y en `/noticias`.

## Fase 4 — Eventos + Presupuestos
- [ ] CRUD eventos (estados, galería, mapa) + render público.
- [ ] Formulario público "Solicitar presupuesto" → `QuoteRequest`.
- [ ] Email a admin (Resend) + bandeja de solicitudes en admin.
- **Entregable:** evento publicado + presupuesto solicitable y gestionable.

## Fase 5 — Publicidad: Paquetes, Contratación, Pagos
- [ ] Paquetes editables (precios definidos) + sección pública.
- [ ] Portal Cliente: contratar → creatividades (logo/imágenes/redes/desc) → informar pago (comprobante).
- [ ] Admin: aprobar/rechazar contratos y pagos; ADMIN crea publicidad sin solicitud.
- [ ] Emails de estado de pago.
- **Entregable:** flujo completo Cliente → Pendiente → Aprobación → Activa.

## Fase 6 — Sponsors + Banners
- [ ] Módulo sponsors (clicks/impresiones) gestionable + render.
- [ ] Banners por ubicación, gestionables + render en el sitio.
- **Entregable:** sponsors/banners dinámicos en las ubicaciones definidas.

## Fase 7 — Radio + Streaming
- [ ] Programación, conductores, programas, horarios, invitados, repeticiones, podcasts.
- [ ] Streaming YouTube gestionable desde admin.
- **Entregable:** sección Radio completa con programación dinámica.

## Fase 8 — CMS Landing + Configuración
- [ ] Secciones de landing on/off y textos editables (`SiteSetting`/`SectionConfig`).
- [ ] Config global: logo, contacto, redes, SEO/OpenGraph, mapa.
- **Entregable:** admin enciende/apaga y edita secciones sin tocar código.

## Fase 9 — Theme Engine
- [ ] Paleta, tipografías, modo claro/oscuro configurable, loader, animaciones desde DB → CSS variables.
- **Entregable:** admin cambia colores/tipografías y el sitio lo refleja.

## Fase 10 — Analytics + Auditoría + PWA
- [ ] Dashboard KPIs (Tremor/Recharts), AuditLog visible, contadores reales, CTR publicidad.
- [ ] PWA (manifest + SW), Sentry, Pino.
- **Entregable:** panel con métricas reales y app instalable.

## Fase 11 — Tienda (preparada, inactiva)
- [ ] Modelos + UI base detrás de feature flag; pago manual.
- **Entregable:** tienda lista para activar a futuro.

---

## Backlog (post-MVP)
- Transmisión de radio propia desde la plataforma.
- Integración Mercado Pago.
- Migración de storage a Cloudflare R2.
- Internacionalización (i18n).
